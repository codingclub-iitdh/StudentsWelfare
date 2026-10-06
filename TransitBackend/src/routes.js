const express = require('express');
const { HttpError } = require('./errors');
const { withTransaction } = require('./db/pool');
const {
  isAtLeastHoursAhead,
  validateBookingInput,
  validateExtensionInput,
  validateDecision,
  validateRoomNumbers,
} = require('./validation');
const { requireRole } = require('./auth');
const {
  bookingDenied,
  bookingConfirmed,
  extensionDenied,
  extensionConfirmed,
} = require('./email-templates');

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function requireUuid(value, label) {
  if (!UUID_PATTERN.test(value)) throw new HttpError(400, `${label} must be a valid ID.`);
  return value;
}

function dateString(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
}

function pageParams(query) {
  const limit = Number(query.limit || 50);
  const offset = Number(query.offset || 0);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100
    || !Number.isInteger(offset) || offset < 0) {
    throw new HttpError(400, 'limit must be 1-100 and offset must be zero or greater.');
  }
  return { limit, offset };
}

function logStatus(client, { entityType, entityId, fromStatus, toStatus, actor, reason, eventType, metadata = {} }) {
  return Promise.all([
    client.query(
      `INSERT INTO status_history
         (entity_type, entity_id, from_status, to_status, actor_email, reason)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [entityType, entityId, fromStatus, toStatus, actor.email, reason || null],
    ),
    client.query(
      `INSERT INTO audit_events
         (actor_email, event_type, entity_type, entity_id, metadata)
       VALUES ($1, $2, $3, $4, $5::jsonb)`,
      [actor.email, eventType, entityType, entityId, JSON.stringify(metadata)],
    ),
  ]);
}

async function notifyStudent(req, res, mailer, message, context) {
  try {
    await mailer.send(message);
    res.locals.emailNotification = 'sent';
  } catch (error) {
    console.error('Email notification failed', {
      ...context,
      error: error.message,
    });
    res.locals.emailNotification = 'failed';
  }
}

function withNotification(body, res) {
  return { ...body, emailNotification: res.locals.emailNotification || 'not_sent' };
}

function createApiRouter({ pool, config, mailer }) {
  const router = express.Router();

  router.get('/me', (req, res) => {
    res.json({ user: req.user });
  });

  router.post('/bookings', requireRole('student'), asyncHandler(async (req, res) => {
    validateBookingInput(req.body, config.termsVersion);
    if (!isAtLeastHoursAhead(req.body.checkIn, 48, config.bookingTimeZone)) {
      throw new HttpError(400, 'Bookings must be submitted at least 48 hours before check-in.');
    }

    const booking = await withTransaction(pool, async (client) => {
      const result = await client.query(
        `INSERT INTO booking_requests
           (student_sub, student_email, student_name, contact_phone, visitors,
            check_in, check_out, terms_accepted, terms_version)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6::date, $7::date, TRUE, $8)
         RETURNING *`,
        [
          req.user.sub,
          req.user.email,
          req.user.name,
          req.body.contactPhone.trim(),
          JSON.stringify(req.body.visitors.map((visitor) => ({
            name: visitor.name.trim(),
            relationship: visitor.relationship.trim(),
          }))),
          req.body.checkIn,
          req.body.checkOut,
          config.termsVersion,
        ],
      );
      const created = result.rows[0];
      await logStatus(client, {
        entityType: 'booking',
        entityId: created.id,
        fromStatus: null,
        toStatus: created.status,
        actor: req.user,
        eventType: 'booking.created',
        metadata: { visitorCount: created.visitors.length },
      });
      return created;
    });
    res.status(201).json({ booking });
  }));

  router.get('/bookings', requireRole('student'), asyncHandler(async (req, res) => {
    const { limit, offset } = pageParams(req.query);
    const result = await pool.query(
      `SELECT * FROM booking_requests
       WHERE student_sub = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.sub, limit, offset],
    );
    res.json({ bookings: result.rows, limit, offset });
  }));

  router.get('/bookings/:bookingId', asyncHandler(async (req, res) => {
    const id = requireUuid(req.params.bookingId, 'bookingId');
    const result = await pool.query('SELECT * FROM booking_requests WHERE id = $1', [id]);
    const booking = result.rows[0];
    if (!booking) throw new HttpError(404, 'Booking not found.');
    if (req.user.role === 'student' && booking.student_sub !== req.user.sub) {
      throw new HttpError(403, 'You may only view your own bookings.');
    }
    const extensions = await pool.query(
      `SELECT * FROM extension_requests WHERE booking_id = $1 ORDER BY created_at DESC`,
      [id],
    );
    res.json({ booking, extensions: extensions.rows });
  }));

  router.post('/bookings/:bookingId/extensions', requireRole('student'), asyncHandler(async (req, res) => {
    const bookingId = requireUuid(req.params.bookingId, 'bookingId');
    validateExtensionInput(req.body);

    const extension = await withTransaction(pool, async (client) => {
      const bookingResult = await client.query(
        `SELECT * FROM booking_requests
         WHERE id = $1 AND student_sub = $2
         FOR UPDATE`,
        [bookingId, req.user.sub],
      );
      const booking = bookingResult.rows[0];
      if (!booking) throw new HttpError(404, 'Booking not found.');
      if (booking.status !== 'confirmed') {
        throw new HttpError(409, 'Only a confirmed booking can be extended.');
      }
      if (req.body.requestedCheckOut <= dateString(booking.check_out)) {
        throw new HttpError(400, 'requestedCheckOut must be after the current check-out date.');
      }
      if (!isAtLeastHoursAhead(dateString(booking.check_out), 48, config.bookingTimeZone)) {
        throw new HttpError(400, 'Extension requests must be made at least 48 hours before the current check-out date.');
      }
      const active = await client.query(
        `SELECT (
          check_in <= (CURRENT_TIMESTAMP AT TIME ZONE $2::text)::date
          AND check_out > (CURRENT_TIMESTAMP AT TIME ZONE $2::text)::date
        ) AS active
         FROM booking_requests WHERE id = $1`,
        [bookingId, config.bookingTimeZone],
      );
      if (!active.rows[0].active) {
        throw new HttpError(409, 'An extension can only be requested for a currently active booking.');
      }
      const existing = await client.query(
        `SELECT 1 FROM extension_requests
         WHERE booking_id = $1 AND status IN ('pending_dean', 'pending_manager')
         LIMIT 1`,
        [bookingId],
      );
      if (existing.rowCount) throw new HttpError(409, 'This booking already has an extension under review.');

      const inserted = await client.query(
        `INSERT INTO extension_requests
           (booking_id, student_sub, student_email, requested_check_out, reason)
         VALUES ($1, $2, $3, $4::date, $5)
         RETURNING *`,
        [bookingId, req.user.sub, req.user.email, req.body.requestedCheckOut, req.body.reason.trim()],
      );
      const created = inserted.rows[0];
      await logStatus(client, {
        entityType: 'extension',
        entityId: created.id,
        fromStatus: null,
        toStatus: created.status,
        actor: req.user,
        eventType: 'extension.created',
        metadata: { bookingId },
      });
      return created;
    });
    res.status(201).json({ extension });
  }));

  router.get('/extensions', requireRole('student'), asyncHandler(async (req, res) => {
    const { limit, offset } = pageParams(req.query);
    const result = await pool.query(
      `SELECT * FROM extension_requests
       WHERE student_sub = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.sub, limit, offset],
    );
    res.json({ extensions: result.rows, limit, offset });
  }));

  router.get('/extensions/:extensionId', asyncHandler(async (req, res) => {
    const id = requireUuid(req.params.extensionId, 'extensionId');
    const result = await pool.query(
      `SELECT e.*, b.student_name, b.check_in, b.check_out, b.room_numbers
       FROM extension_requests e
       JOIN booking_requests b ON b.id = e.booking_id
       WHERE e.id = $1`,
      [id],
    );
    const extension = result.rows[0];
    if (!extension) throw new HttpError(404, 'Extension request not found.');
    if (req.user.role === 'student' && extension.student_sub !== req.user.sub) {
      throw new HttpError(403, 'You may only view your own extension requests.');
    }
    res.json({ extension });
  }));

  router.get('/admin/bookings', requireRole('associate_dean'), asyncHandler(async (req, res) => {
    const { limit, offset } = pageParams(req.query);
    const status = req.query.status || 'pending_dean';
    const allowed = ['pending_dean', 'denied_by_dean', 'pending_manager', 'denied_by_manager', 'confirmed'];
    if (!allowed.includes(status)) throw new HttpError(400, 'Invalid booking status filter.');
    const result = await pool.query(
      `SELECT * FROM booking_requests WHERE status = $1
       ORDER BY created_at ASC LIMIT $2 OFFSET $3`,
      [status, limit, offset],
    );
    res.json({ bookings: result.rows, limit, offset });
  }));

  router.patch('/admin/bookings/:bookingId/decision', requireRole('associate_dean'), asyncHandler(async (req, res) => {
    const id = requireUuid(req.params.bookingId, 'bookingId');
    validateDecision(req.body);
    const nextStatus = req.body.decision === 'approve' ? 'pending_manager' : 'denied_by_dean';
    const booking = await withTransaction(pool, async (client) => {
      const found = await client.query(
        'SELECT * FROM booking_requests WHERE id = $1 FOR UPDATE',
        [id],
      );
      const current = found.rows[0];
      if (!current) throw new HttpError(404, 'Booking not found.');
      if (current.status !== 'pending_dean') throw new HttpError(409, 'This booking is no longer awaiting Associate Dean review.');
      const updated = await client.query(
        `UPDATE booking_requests SET status = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING *`,
        [id, nextStatus],
      );
      await logStatus(client, {
        entityType: 'booking',
        entityId: id,
        fromStatus: current.status,
        toStatus: nextStatus,
        actor: req.user,
        reason: req.body.reason,
        eventType: `booking.${req.body.decision === 'approve' ? 'approved' : 'denied'}_by_dean`,
        metadata: {},
      });
      return updated.rows[0];
    });

    if (req.body.decision === 'deny') {
      await notifyStudent(req, res, mailer, {
        to: booking.student_email,
        ...bookingDenied({
          reviewer: 'Associate Dean',
          reason: req.body.reason.trim(),
        }),
      }, { entity: 'booking', id, notification: 'dean-denial' });
    }
    res.json(withNotification({ booking }, res));
  }));

  router.get('/manager/bookings', requireRole('transit_manager'), asyncHandler(async (req, res) => {
    const { limit, offset } = pageParams(req.query);
    const result = await pool.query(
      `SELECT * FROM booking_requests WHERE status = 'pending_manager'
       ORDER BY created_at ASC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    res.json({ bookings: result.rows, limit, offset });
  }));

  router.patch('/manager/bookings/:bookingId/decision', requireRole('transit_manager'), asyncHandler(async (req, res) => {
    const id = requireUuid(req.params.bookingId, 'bookingId');
    validateDecision(req.body);
    if (req.body.decision === 'approve') {
      throw new HttpError(400, 'Use the confirmation endpoint to allocate rooms and confirm a booking.');
    }
    const booking = await withTransaction(pool, async (client) => {
      const found = await client.query('SELECT * FROM booking_requests WHERE id = $1 FOR UPDATE', [id]);
      const current = found.rows[0];
      if (!current) throw new HttpError(404, 'Booking not found.');
      if (current.status !== 'pending_manager') throw new HttpError(409, 'This booking is no longer awaiting Transit Manager review.');
      const updated = await client.query(
        `UPDATE booking_requests SET status = 'denied_by_manager', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING *`,
        [id],
      );
      await logStatus(client, {
        entityType: 'booking',
        entityId: id,
        fromStatus: current.status,
        toStatus: 'denied_by_manager',
        actor: req.user,
        reason: req.body.reason,
        eventType: 'booking.denied_by_manager',
      });
      return updated.rows[0];
    });
    await notifyStudent(req, res, mailer, {
      to: booking.student_email,
      ...bookingDenied({
        reviewer: 'Transit Manager',
        reason: req.body.reason.trim(),
      }),
    }, { entity: 'booking', id, notification: 'manager-denial' });
    res.json(withNotification({ booking }, res));
  }));

  router.patch('/manager/bookings/:bookingId/confirm', requireRole('transit_manager'), asyncHandler(async (req, res) => {
    const id = requireUuid(req.params.bookingId, 'bookingId');
    const roomNumbers = validateRoomNumbers(req.body && req.body.roomNumbers);
    const booking = await withTransaction(pool, async (client) => {
      const found = await client.query('SELECT * FROM booking_requests WHERE id = $1 FOR UPDATE', [id]);
      const current = found.rows[0];
      if (!current) throw new HttpError(404, 'Booking not found.');
      if (current.status !== 'pending_manager') throw new HttpError(409, 'This booking is no longer awaiting Transit Manager review.');
      const updated = await client.query(
        `UPDATE booking_requests
         SET status = 'confirmed', room_numbers = $2::text[], updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING *`,
        [id, roomNumbers],
      );
      await logStatus(client, {
        entityType: 'booking',
        entityId: id,
        fromStatus: current.status,
        toStatus: 'confirmed',
        actor: req.user,
        eventType: 'booking.confirmed',
        metadata: { roomNumbers },
      });
      return updated.rows[0];
    });
    await notifyStudent(req, res, mailer, {
      to: booking.student_email,
      cc: config.confirmationCc,
      ...bookingConfirmed({
        studentName: booking.student_name,
        checkIn: dateString(booking.check_in),
        checkOut: dateString(booking.check_out),
        roomNumbers: booking.room_numbers,
      }),
    }, { entity: 'booking', id, notification: 'booking-confirmation' });
    res.json(withNotification({ booking }, res));
  }));

  router.get('/admin/extensions', requireRole('associate_dean'), asyncHandler(async (req, res) => {
    const { limit, offset } = pageParams(req.query);
    const result = await pool.query(
      `SELECT e.*, b.student_name, b.check_in, b.check_out, b.room_numbers
       FROM extension_requests e
       JOIN booking_requests b ON b.id = e.booking_id
       WHERE e.status = 'pending_dean'
       ORDER BY e.created_at ASC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    res.json({ extensions: result.rows, limit, offset });
  }));

  router.patch('/admin/extensions/:extensionId/decision', requireRole('associate_dean'), asyncHandler(async (req, res) => {
    const id = requireUuid(req.params.extensionId, 'extensionId');
    validateDecision(req.body);
    const nextStatus = req.body.decision === 'approve' ? 'pending_manager' : 'denied_by_dean';
    const extension = await withTransaction(pool, async (client) => {
      const found = await client.query('SELECT * FROM extension_requests WHERE id = $1 FOR UPDATE', [id]);
      const current = found.rows[0];
      if (!current) throw new HttpError(404, 'Extension request not found.');
      if (current.status !== 'pending_dean') throw new HttpError(409, 'This extension is no longer awaiting Associate Dean review.');
      const updated = await client.query(
        `UPDATE extension_requests SET status = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING *`,
        [id, nextStatus],
      );
      await logStatus(client, {
        entityType: 'extension',
        entityId: id,
        fromStatus: current.status,
        toStatus: nextStatus,
        actor: req.user,
        reason: req.body.reason,
        eventType: `extension.${req.body.decision === 'approve' ? 'approved' : 'denied'}_by_dean`,
      });
      return updated.rows[0];
    });
    if (req.body.decision === 'deny') {
      await notifyStudent(req, res, mailer, {
        to: extension.student_email,
        ...extensionDenied({
          reviewer: 'Associate Dean',
          reason: req.body.reason.trim(),
        }),
      }, { entity: 'extension', id, notification: 'dean-denial' });
    }
    res.json(withNotification({ extension }, res));
  }));

  router.get('/manager/extensions', requireRole('transit_manager'), asyncHandler(async (req, res) => {
    const { limit, offset } = pageParams(req.query);
    const result = await pool.query(
      `SELECT e.*, b.student_name, b.check_in, b.check_out, b.room_numbers
       FROM extension_requests e
       JOIN booking_requests b ON b.id = e.booking_id
       WHERE e.status = 'pending_manager'
       ORDER BY e.created_at ASC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    res.json({ extensions: result.rows, limit, offset });
  }));

  router.patch('/manager/extensions/:extensionId/decision', requireRole('transit_manager'), asyncHandler(async (req, res) => {
    const id = requireUuid(req.params.extensionId, 'extensionId');
    validateDecision(req.body);
    let updatedExtension;
    const extension = await withTransaction(pool, async (client) => {
      const found = await client.query('SELECT * FROM extension_requests WHERE id = $1 FOR UPDATE', [id]);
      const current = found.rows[0];
      if (!current) throw new HttpError(404, 'Extension request not found.');
      if (current.status !== 'pending_manager') throw new HttpError(409, 'This extension is no longer awaiting Transit Manager review.');

      const nextStatus = req.body.decision === 'approve' ? 'confirmed' : 'denied_by_manager';
      if (req.body.decision === 'approve') {
        const bookingResult = await client.query(
          'SELECT * FROM booking_requests WHERE id = $1 FOR UPDATE',
          [current.booking_id],
        );
        const booking = bookingResult.rows[0];
        if (!booking || booking.status !== 'confirmed') {
          throw new HttpError(409, 'The original booking is no longer active and confirmed.');
        }
        const activeResult = await client.query(
          `SELECT (
            check_in <= (CURRENT_TIMESTAMP AT TIME ZONE $2::text)::date
            AND check_out > (CURRENT_TIMESTAMP AT TIME ZONE $2::text)::date
          ) AS active
           FROM booking_requests WHERE id = $1`,
          [booking.id, config.bookingTimeZone],
        );
        if (!activeResult.rows[0].active) {
          throw new HttpError(409, 'The original booking has ended; the extension cannot be confirmed.');
        }
        if (dateString(current.requested_check_out) <= dateString(booking.check_out)) {
          throw new HttpError(409, 'The requested extension no longer follows the current check-out date.');
        }
        await client.query(
          `UPDATE booking_requests SET check_out = $2::date, updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [booking.id, dateString(current.requested_check_out)],
        );
      }

      const changed = await client.query(
        `UPDATE extension_requests SET status = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING *`,
        [id, nextStatus],
      );
      updatedExtension = changed.rows[0];
      await logStatus(client, {
        entityType: 'extension',
        entityId: id,
        fromStatus: current.status,
        toStatus: nextStatus,
        actor: req.user,
        reason: req.body.reason,
        eventType: `extension.${req.body.decision}d_by_manager`,
        metadata: { bookingId: current.booking_id },
      });
      return updatedExtension;
    });
    const approved = req.body.decision === 'approve';
    await notifyStudent(req, res, mailer, {
      to: extension.student_email,
      ...(approved
        ? extensionConfirmed({
          requestedCheckOut: dateString(extension.requested_check_out),
        })
        : extensionDenied({
          reviewer: 'Transit Manager',
          reason: req.body.reason.trim(),
        })),
    }, { entity: 'extension', id, notification: approved ? 'extension-confirmation' : 'manager-denial' });
    res.json(withNotification({ extension: updatedExtension }, res));
  }));

  return router;
}

module.exports = { createApiRouter };

const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

const bookingId = '8a7f5e18-148c-4d96-b90d-68da54dd497a';

function makeConfig() {
  return {
    frontendOrigins: ['http://localhost:3000'],
    googleClientId: 'test-client-id',
    associateDeanEmail: 'dean@iitdh.ac.in',
    transitManagerEmail: 'manager@iitdh.ac.in',
    transitTeamEmail: 'transit-team@iitdh.ac.in',
    bookingTimeZone: 'Asia/Kolkata',
    termsVersion: '2026-10',
    confirmationCc: [
      'dean@iitdh.ac.in',
      'transit-team@iitdh.ac.in',
      'sw@iitdh.ac.in',
      'cs@iitdh.ac.in',
    ],
  };
}

function testAuthenticator(role = 'student') {
  return (req, res, next) => {
    req.user = {
      sub: 'google-subject',
      email: `${role}@iitdh.ac.in`,
      name: 'Test User',
      role,
    };
    next();
  };
}

async function withServer(app, callback) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const address = server.address();
    await callback(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

function fakeClient({ bookingStatus = 'pending_dean' } = {}) {
  const calls = [];
  const booking = {
    id: bookingId,
    status: bookingStatus,
    student_sub: 'student-sub',
    student_email: 'student@iitdh.ac.in',
    student_name: 'Student',
    student_roll_number: 'B221020',
    contact_phone: '+91 98765 43210',
    visitors: [{ name: 'Visitor', relationship: 'Parent' }],
    check_in: '2026-10-10',
    check_out: '2026-10-12',
    room_numbers: [],
  };
  return {
    calls,
    booking,
    async query(sql, params) {
      calls.push({ sql, params });
      if (sql === 'BEGIN' || sql === 'COMMIT' || sql === 'ROLLBACK') return { rows: [], rowCount: 0 };
      if (sql.includes('SELECT * FROM booking_requests WHERE id = $1 FOR UPDATE')) {
        return { rows: [{ ...booking }], rowCount: 1 };
      }
      if (sql.includes('UPDATE booking_requests SET status = $2')) {
        booking.status = params[1];
        return { rows: [{ ...booking }], rowCount: 1 };
      }
      if (sql.includes("UPDATE booking_requests") && sql.includes("SET status = 'confirmed'")) {
        booking.status = 'confirmed';
        booking.room_numbers = params[1];
        return { rows: [{ ...booking }], rowCount: 1 };
      }
      if (sql.includes('INSERT INTO status_history') || sql.includes('INSERT INTO audit_events')) {
        return { rows: [], rowCount: 1 };
      }
      throw new Error(`Unexpected fake database query: ${sql}`);
    },
    release() {},
  };
}

function fakePool(client = null) {
  return {
    async query() {
      return { rows: [{ '?column?': 1 }], rowCount: 1 };
    },
    async connect() {
      if (!client) throw new Error('Unexpected transaction');
      return client;
    },
  };
}

test('health check returns database connectivity', async () => {
  const app = createApp({
    pool: fakePool(),
    config: makeConfig(),
    mailer: { send: async () => {} },
    authenticate: testAuthenticator(),
  });
  await withServer(app, async (url) => {
    const response = await fetch(`${url}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok', database: 'connected' });
  });
});

test('API requires authentication and enforces reviewer roles', async () => {
  const app = createApp({
    pool: fakePool(),
    config: makeConfig(),
    mailer: { send: async () => {} },
  });

  test('authenticated user endpoint returns the current terms version', async () => {
    const app = createApp({
      pool: fakePool(),
      config: makeConfig(),
      mailer: { send: async () => {} },
      authenticate: testAuthenticator(),
    });
    await withServer(app, async (url) => {
      const response = await fetch(`${url}/api/me`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), {
        user: {
          sub: 'google-subject',
          email: 'student@iitdh.ac.in',
          name: 'Test User',
          role: 'student',
        },
        termsVersion: '2026-10',
      });
    });
  });
  await withServer(app, async (url) => {
    const unauthenticated = await fetch(`${url}/api/me`);
    assert.equal(unauthenticated.status, 401);

    const wrongRoleApp = createApp({
      pool: fakePool(),
      config: makeConfig(),
      mailer: { send: async () => {} },
      authenticate: testAuthenticator('student'),
    });
    await withServer(wrongRoleApp, async (wrongRoleUrl) => {
      const response = await fetch(`${wrongRoleUrl}/api/admin/bookings`);
      assert.equal(response.status, 403);
    });
  });
});

test('student booking list includes the latest denial reason', async () => {
  const deniedReason = 'Dates unavailable';
  let query;
  const app = createApp({
    pool: {
      async query(sql, params) {
        query = { sql, params };
        return {
          rows: [{ id: bookingId, status: 'denied_by_dean', denial_reason: deniedReason }],
          rowCount: 1,
        };
      },
    },
    config: makeConfig(),
    mailer: { send: async () => {} },
    authenticate: testAuthenticator('student'),
  });

  await withServer(app, async (url) => {
    const response = await fetch(`${url}/api/bookings`);
    const result = await response.json();

    assert.equal(response.status, 200);
    assert.equal(result.bookings[0].denial_reason, deniedReason);
    assert.match(query.sql, /FROM status_history AS history/);
    assert.deepEqual(query.params, ['google-subject', 50, 0]);
  });
});

test('booking creation rejects missing current terms before database access', async () => {
  const app = createApp({
    pool: fakePool(),
    config: makeConfig(),
    mailer: { send: async () => {} },
    authenticate: testAuthenticator('student'),
  });
  await withServer(app, async (url) => {
    const response = await fetch(`${url}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactPhone: '+91 98765 43210',
        studentName: 'Spoofed Name',
        rollNumber: 'Spoofed Roll',
        visitors: [{ name: 'Visitor', relationship: 'Parent' }],
        checkIn: '2026-10-10T04:30:00.000Z',
        checkOut: '2026-10-12T12:30:00.000Z',
        termsAccepted: true,
        termsVersion: 'old-version',
      }),
    });
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /current terms/);
  });
});

test('booking creation stores student details and timezone-aware requested stay', async () => {
  const calls = [];
  const messages = [];
  const bookingIdForCreation = '5a7f5e18-148c-4d96-b90d-68da54dd497a';
  const client = {
    async query(sql, params = []) {
      calls.push({ sql, params });
      if (sql === 'BEGIN' || sql === 'COMMIT' || sql === 'ROLLBACK') {
        return { rows: [], rowCount: 0 };
      }
      if (sql.includes('INSERT INTO booking_requests')) {
        return {
          rows: [{
            id: bookingIdForCreation,
            status: 'pending_dean',
            student_name: params[2],
            student_roll_number: params[3],
            contact_phone: params[4],
            visitors: JSON.parse(params[5]),
            check_in: params[6],
            check_out: params[7],
          }],
          rowCount: 1,
        };
      }
      if (sql.includes('INSERT INTO status_history') || sql.includes('INSERT INTO audit_events')) {
        return { rows: [], rowCount: 1 };
      }
      throw new Error(`Unexpected fake database query: ${sql}`);
    },
    release() {},
  };
  const app = createApp({
    pool: fakePool(client),
    config: makeConfig(),
    mailer: { send: async (message) => messages.push(message) },
    authenticate: testAuthenticator('student'),
  });
  const checkIn = new Date(Date.now() + 72 * 60 * 60 * 1000);
  const checkOut = new Date(checkIn.getTime() + 6 * 60 * 60 * 1000);
  await withServer(app, async (url) => {
    const response = await fetch(`${url}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: 'Test Student',
        rollNumber: 'B221020',
        contactPhone: '+91 98765 43210',
        visitors: [{ name: 'Visitor', relationship: 'Parent' }],
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        termsAccepted: true,
        termsVersion: '2026-10',
      }),
    });
    const result = await response.json();
    assert.equal(response.status, 201);
    assert.equal(result.booking.status, 'pending_dean');
    assert.equal(result.booking.student_name, 'Test User');
    assert.equal(result.booking.student_roll_number, 'student');
    assert.equal(result.booking.check_in, checkIn.toISOString());
    assert.equal(result.booking.check_out, checkOut.toISOString());
    const insert = calls.find(({ sql }) => sql.includes('INSERT INTO booking_requests'));
    assert.match(insert.sql, /student_roll_number/);
    assert.equal(insert.params[2], 'Test User');
    assert.equal(insert.params[3], 'student');
    assert.equal(result.emailNotification, 'sent');
    assert.equal(messages.length, 1);
    assert.equal(messages[0].to, 'dean@iitdh.ac.in');
    assert.match(messages[0].subject, /action required/i);
    assert.match(messages[0].text, new RegExp(`http://localhost:3000/transit/dean\\?booking=${bookingIdForCreation}`));
  });
});

test('Dean approval emails the Transit Team with the protected manager queue link', async () => {
  const client = fakeClient();
  const messages = [];
  const app = createApp({
    pool: fakePool(client),
    config: makeConfig(),
    mailer: { send: async (message) => messages.push(message) },
    authenticate: testAuthenticator('associate_dean'),
  });
  await withServer(app, async (url) => {
    const response = await fetch(`${url}/api/admin/bookings/${bookingId}/decision`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'approve' }),
    });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.booking.status, 'pending_manager');
    assert.equal(result.emailNotification, 'sent');
    assert.equal(messages.length, 1);
    assert.equal(messages[0].to, 'transit-team@iitdh.ac.in');
    assert.match(messages[0].subject, /action required/i);
    assert.match(messages[0].text, new RegExp(`http://localhost:3000/transit/manager\\?booking=${bookingId}`));
  });
});

test('Manager confirmation emails the student and copies the configured offices and team', async () => {
  const client = fakeClient({ bookingStatus: 'pending_manager' });
  const messages = [];
  const app = createApp({
    pool: fakePool(client),
    config: makeConfig(),
    mailer: { send: async (message) => messages.push(message) },
    authenticate: testAuthenticator('transit_manager'),
  });
  await withServer(app, async (url) => {
    const response = await fetch(`${url}/api/manager/bookings/${bookingId}/confirm`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomNumbers: ['A-1', 'A-2'] }),
    });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.booking.status, 'confirmed');
    assert.equal(result.emailNotification, 'sent');
    assert.equal(messages.length, 1);
    assert.equal(messages[0].to, 'student@iitdh.ac.in');
    assert.deepEqual(messages[0].cc, [
      'dean@iitdh.ac.in',
      'transit-team@iitdh.ac.in',
      'sw@iitdh.ac.in',
      'cs@iitdh.ac.in',
    ]);
    assert.match(messages[0].subject, /confirmed/i);
    assert.match(messages[0].text, /A-1, A-2/);
  });
});

test('Dean denial persists its decision and surfaces SMTP delivery failure', async () => {
  const client = fakeClient();
  let emailAttempted = false;
  const app = createApp({
    pool: fakePool(client),
    config: makeConfig(),
    mailer: {
      async send() {
        emailAttempted = true;
        throw new Error('SMTP unavailable');
      },
    },
    authenticate: testAuthenticator('associate_dean'),
  });
  await withServer(app, async (url) => {
    const response = await fetch(`${url}/api/admin/bookings/${bookingId}/decision`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'deny', reason: 'Dates unavailable' }),
    });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.booking.status, 'denied_by_dean');
    assert.equal(result.emailNotification, 'failed');
    assert.equal(emailAttempted, true);
    assert.equal(client.calls.some(({ sql }) => sql === 'COMMIT'), true);
    assert.equal(client.calls.some(({ sql }) => sql.includes('INSERT INTO status_history')), true);
    assert.equal(client.calls.some(({ sql }) => sql.includes('INSERT INTO audit_events')), true);
  });
});

test('a stale booking decision is rejected without changing status', async () => {
  const client = fakeClient({ bookingStatus: 'pending_manager' });
  const app = createApp({
    pool: fakePool(client),
    config: makeConfig(),
    mailer: { send: async () => {} },
    authenticate: testAuthenticator('associate_dean'),
  });
  await withServer(app, async (url) => {
    const response = await fetch(`${url}/api/admin/bookings/${bookingId}/decision`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'approve' }),
    });
    assert.equal(response.status, 409);
    assert.equal(client.booking.status, 'pending_manager');
    assert.equal(client.calls.some(({ sql }) => sql === 'ROLLBACK'), true);
  });
});

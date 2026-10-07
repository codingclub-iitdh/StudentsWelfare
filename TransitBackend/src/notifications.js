const RETRY_LOCK_MINUTES = 15;

function messagePayload(message) {
  return {
    to: message.to,
    cc: Array.isArray(message.cc) ? message.cc : [],
    subject: message.subject,
    text: message.text,
  };
}

async function queueNotification(pool, message, context, error) {
  await pool.query(
    `INSERT INTO notification_outbox (message, context, last_error)
     VALUES ($1::jsonb, $2::jsonb, $3)`,
    [JSON.stringify(messagePayload(message)), JSON.stringify(context), error.message],
  );
}

async function markDelivered(pool, id) {
  await pool.query(
    `UPDATE notification_outbox
     SET delivered_at = CURRENT_TIMESTAMP, locked_at = NULL, last_error = NULL
     WHERE id = $1`,
    [id],
  );
}

async function rescheduleNotification(pool, notification, error) {
  const delayMinutes = Math.min(60, 2 ** Math.min(notification.attempts, 6));
  await pool.query(
    `UPDATE notification_outbox
     SET locked_at = NULL,
         last_error = $2,
         next_attempt_at = CURRENT_TIMESTAMP + ($3 * INTERVAL '1 minute')
     WHERE id = $1`,
    [notification.id, error.message, delayMinutes],
  );
}

async function claimPendingNotifications(pool, batchSize) {
  const result = await pool.query(
    `WITH due AS (
       SELECT id
       FROM notification_outbox
       WHERE delivered_at IS NULL
         AND next_attempt_at <= CURRENT_TIMESTAMP
         AND (locked_at IS NULL OR locked_at < CURRENT_TIMESTAMP - ($2 * INTERVAL '1 minute'))
       ORDER BY created_at ASC
       LIMIT $1
       FOR UPDATE SKIP LOCKED
     )
     UPDATE notification_outbox AS outbox
     SET locked_at = CURRENT_TIMESTAMP, attempts = outbox.attempts + 1
     FROM due
     WHERE outbox.id = due.id
     RETURNING outbox.*`,
    [batchSize, RETRY_LOCK_MINUTES],
  );
  return result.rows;
}

async function retryPendingNotifications(pool, mailer, batchSize = 10) {
  const notifications = await claimPendingNotifications(pool, batchSize);
  for (const notification of notifications) {
    try {
      await mailer.send(notification.message);
      await markDelivered(pool, notification.id);
    } catch (error) {
      await rescheduleNotification(pool, notification, error);
      console.error('Notification retry failed', {
        ...notification.context,
        id: notification.id,
        error: error.message,
      });
    }
  }
  return notifications.length;
}

function startNotificationRetryWorker({ pool, mailer, intervalMs = 60000 }) {
  let running = false;
  const run = async () => {
    if (running) return;
    running = true;
    try {
      await retryPendingNotifications(pool, mailer);
    } catch (error) {
      console.error('Notification retry worker failed', { error: error.message });
    } finally {
      running = false;
    }
  };
  const timer = setInterval(run, intervalMs);
  timer.unref();
  void run();
  return () => clearInterval(timer);
}

module.exports = {
  queueNotification,
  retryPendingNotifications,
  startNotificationRetryWorker,
};

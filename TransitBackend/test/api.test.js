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
    bookingTimeZone: 'Asia/Kolkata',
    termsVersion: '2026-10',
    confirmationCc: ['dean@iitdh.ac.in', 'manager@iitdh.ac.in'],
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
    check_in: '2026-10-10',
    check_out: '2026-10-12',
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
        visitors: [{ name: 'Visitor', relationship: 'Parent' }],
        checkIn: '2026-10-10',
        checkOut: '2026-10-12',
        termsAccepted: true,
        termsVersion: 'old-version',
      }),
    });
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /current terms/);
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

const test = require('node:test');
const assert = require('node:assert/strict');
const { getConfig, validateConfig } = require('../src/config');

const requiredEnvironment = {
  DB_HOST: 'localhost',
  DB_NAME: 'transit_portal',
  DB_USER: 'transit_app',
  DB_PASSWORD: 'test-password',
  GOOGLE_CLIENT_ID: 'test-client-id',
  ASSOCIATE_DEAN_EMAIL: 'Dean@iitdh.ac.in',
  TRANSIT_MANAGER_EMAIL: 'Manager@iitdh.ac.in',
  TERMS_VERSION: '2026-10',
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_USER: 'mailer@example.com',
  EMAIL_PASS: 'test-password',
  EMAIL_FROM: 'Transit <transit@example.com>',
};

test('one normalized email per role is also used for confirmation copies', () => {
  const config = getConfig(requiredEnvironment);
  assert.equal(config.associateDeanEmail, 'dean@iitdh.ac.in');
  assert.equal(config.transitManagerEmail, 'manager@iitdh.ac.in');
  assert.deepEqual(config.confirmationCc, ['dean@iitdh.ac.in', 'manager@iitdh.ac.in']);
  assert.doesNotThrow(() => validateConfig(config));
});

test('role emails are required configuration values', () => {
  const config = getConfig({
    ...requiredEnvironment,
    ASSOCIATE_DEAN_EMAIL: '',
    TRANSIT_MANAGER_EMAIL: '',
  });
  assert.throws(() => validateConfig(config), /ASSOCIATE_DEAN_EMAIL, TRANSIT_MANAGER_EMAIL/);
});

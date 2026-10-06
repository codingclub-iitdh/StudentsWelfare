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
  TRANSIT_TEAM_EMAIL: 'transit-team@iitdh.ac.in',
  SW_OFFICE_EMAIL: 'sw-office@iitdh.ac.in',
  CS_OFFICE_EMAIL: 'cs-office@iitdh.ac.in',
  TERMS_VERSION: '2026-10',
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_USER: 'mailer@example.com',
  EMAIL_PASS: 'test-password',
  EMAIL_FROM: 'Transit <transit@example.com>',
};

test('role and office emails are normalized and included in confirmation copies', () => {
  const config = getConfig(requiredEnvironment);
  assert.equal(config.associateDeanEmail, 'dean@iitdh.ac.in');
  assert.equal(config.transitManagerEmail, 'manager@iitdh.ac.in');
  assert.deepEqual(config.confirmationCc, [
    'dean@iitdh.ac.in',
    'transit-team@iitdh.ac.in',
    'sw-office@iitdh.ac.in',
    'cs-office@iitdh.ac.in',
  ]);
  assert.doesNotThrow(() => validateConfig(config));
});

test('role and office emails are required configuration values', () => {
  const config = getConfig({
    ...requiredEnvironment,
    ASSOCIATE_DEAN_EMAIL: '',
    TRANSIT_MANAGER_EMAIL: '',
    TRANSIT_TEAM_EMAIL: '',
    SW_OFFICE_EMAIL: '',
    CS_OFFICE_EMAIL: '',
  });
  assert.throws(() => validateConfig(config), /ASSOCIATE_DEAN_EMAIL, TRANSIT_MANAGER_EMAIL, SW_OFFICE_EMAIL, CS_OFFICE_EMAIL/);
});

test('Transit Facility Team copy defaults to the Transit Manager address', () => {
  const config = getConfig({
    ...requiredEnvironment,
    TRANSIT_TEAM_EMAIL: '',
  });
  assert.equal(config.transitTeamEmail, 'manager@iitdh.ac.in');
  assert.equal(config.confirmationCc.includes('manager@iitdh.ac.in'), true);
});

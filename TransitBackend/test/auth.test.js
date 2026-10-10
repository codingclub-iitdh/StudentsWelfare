const test = require('node:test');
const assert = require('node:assert/strict');
const { resolvePortalRole } = require('../src/auth');

const config = {
  associateDeanEmail: 'dean@iitdh.ac.in',
  transitManagerEmail: 'manager@iitdh.ac.in',
};

test('configured Associate Dean and Manager accounts are matched before the student domain', () => {
  assert.equal(resolvePortalRole('DEAN@iitdh.ac.in', 'iitdh.ac.in', config), 'associate_dean');
  assert.equal(resolvePortalRole('manager@iitdh.ac.in', 'iitdh.ac.in', config), 'transit_manager');
});

test('other verified IIT Dharwad hosted accounts receive the student role', () => {
  assert.equal(resolvePortalRole('student@iitdh.ac.in', 'iitdh.ac.in', config), 'student');
});

test('accounts outside the configured staff addresses and IIT Dharwad student domain are rejected', () => {
  assert.equal(resolvePortalRole('staff@iitdh.ac.in', undefined, config), null);
  assert.equal(resolvePortalRole('student@example.com', 'iitdh.ac.in', config), null);
});

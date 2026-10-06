const test = require('node:test');
const assert = require('node:assert/strict');
const {
  bookingDenied,
  bookingConfirmed,
  extensionDenied,
  extensionConfirmed,
} = require('../src/email-templates');

test('booking email skeletons include decision reason and confirmation details', () => {
  const denial = bookingDenied({ reviewer: 'Associate Dean', reason: 'Dates unavailable' });
  assert.match(denial.subject, /booking request update/i);
  assert.match(denial.text, /denied by the Associate Dean/);
  assert.match(denial.text, /Dates unavailable/);

  const confirmation = bookingConfirmed({
    studentName: 'Student',
    checkIn: '2026-10-10',
    checkOut: '2026-10-12',
    roomNumbers: ['A-1', 'A-2'],
  });
  assert.match(confirmation.subject, /confirmed/i);
  assert.match(confirmation.text, /Check-in: 2026-10-10/);
  assert.match(confirmation.text, /Room\(s\): A-1, A-2/);
});

test('extension email skeletons include denial reason or new check-out date', () => {
  const denial = extensionDenied({ reviewer: 'Transit Manager', reason: 'Unavailable' });
  assert.match(denial.text, /denied by the Transit Manager/);
  assert.match(denial.text, /Unavailable/);

  const confirmation = extensionConfirmed({ requestedCheckOut: '2026-10-15' });
  assert.match(confirmation.text, /new check-out date is 2026-10-15/);
});

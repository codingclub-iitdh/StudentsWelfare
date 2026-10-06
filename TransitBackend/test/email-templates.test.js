const test = require('node:test');
const assert = require('node:assert/strict');
const {
  bookingDenied,
  bookingConfirmed,
  bookingActionRequired,
  extensionActionRequired,
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

test('action-required templates include protected review links and request details', () => {
  const booking = bookingActionRequired({
    reviewer: 'Associate Dean',
    studentName: 'Student',
    rollNumber: 'B221020',
    checkIn: '2026-10-10T09:00:00+05:30',
    checkOut: '2026-10-12T17:00:00+05:30',
    visitorCount: 2,
    mobileNumber: '+91 98765 43210',
    actionUrl: 'https://portal.example/transit/dean?booking=booking-id',
  });
  assert.match(booking.subject, /action required/i);
  assert.match(booking.text, /B221020/);
  assert.match(booking.text, /authorized IIT Dharwad Google account/);
  assert.match(booking.text, /https:\/\/portal\.example\/transit\/dean\?booking=booking-id/);
  assert.match(booking.text, /does not approve or deny the request by itself/);

  const extension = extensionActionRequired({
    reviewer: 'Transit Facility Manager',
    studentName: 'Student',
    checkIn: '2026-10-10',
    currentCheckOut: '2026-10-12',
    requestedCheckOut: '2026-10-14',
    reason: 'Travel changed',
    actionUrl: 'https://portal.example/transit/manager?extension=extension-id',
  });
  assert.match(extension.text, /Requested check-out: 2026-10-14/);
  assert.match(extension.text, /https:\/\/portal\.example\/transit\/manager\?extension=extension-id/);
});

test('extension email skeletons include denial reason or new check-out date', () => {
  const denial = extensionDenied({ reviewer: 'Transit Manager', reason: 'Unavailable' });
  assert.match(denial.text, /denied by the Transit Manager/);
  assert.match(denial.text, /Unavailable/);

  const confirmation = extensionConfirmed({ requestedCheckOut: '2026-10-15' });
  assert.match(confirmation.text, /new check-out date is 2026-10-15/);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  isDateOnly,
  localMidnightUtc,
  isAtLeastHoursAhead,
  validateBookingInput,
  validateExtensionInput,
  validateDecision,
  validateRoomNumbers,
} = require('../src/validation');

test('date-only values must be real YYYY-MM-DD dates', () => {
  assert.equal(isDateOnly('2026-10-06'), true);
  assert.equal(isDateOnly('2026-02-29'), false);
  assert.equal(isDateOnly('06-10-2026'), false);
});

test('booking 48-hour rule uses project timezone and accepts exact boundary', () => {
  const checkIn = '2026-10-10';
  const localMidnight = localMidnightUtc(checkIn, 'Asia/Kolkata');
  assert.equal(localMidnight.toISOString(), '2026-10-09T18:30:00.000Z');
  assert.equal(
    isAtLeastHoursAhead(checkIn, 48, 'Asia/Kolkata', new Date('2026-10-07T18:30:00.000Z')),
    true,
  );
  assert.equal(
    isAtLeastHoursAhead(checkIn, 48, 'Asia/Kolkata', new Date('2026-10-07T18:30:00.001Z')),
    false,
  );
});

test('booking validation requires visitors, dates, phone, and current terms acceptance', () => {
  const valid = {
    contactPhone: '+91 98765 43210',
    visitors: [{ name: 'Visitor', relationship: 'Parent' }],
    checkIn: '2026-10-10',
    checkOut: '2026-10-12',
    termsAccepted: true,
    termsVersion: '2026-10',
  };
  assert.doesNotThrow(() => validateBookingInput(valid, '2026-10'));
  assert.throws(
    () => validateBookingInput({ ...valid, termsVersion: 'old' }, '2026-10'),
    /current terms/,
  );
  assert.throws(
    () => validateBookingInput({ ...valid, visitors: [] }, '2026-10'),
    /at least one visitor/,
  );
});

test('extension dates and decision reasons are validated', () => {
  assert.doesNotThrow(() => validateExtensionInput({
    requestedCheckOut: '2026-10-12',
    reason: 'Travel needs',
  }));
  assert.throws(() => validateExtensionInput({ requestedCheckOut: '2026-02-30', reason: 'Reason' }));
  assert.doesNotThrow(() => validateDecision({ decision: 'approve' }));
  assert.throws(() => validateDecision({ decision: 'deny' }), /denial reason/);
});

test('room allocation requires unique non-empty room names', () => {
  assert.deepEqual(validateRoomNumbers(['A-1', 'A-2']), ['A-1', 'A-2']);
  assert.throws(() => validateRoomNumbers(['A-1', 'a-1']), /duplicates/);
  assert.throws(() => validateRoomNumbers([]), /non-empty/);
});

const { HttpError } = require('./errors');

function isDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function isTimestamp(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|([+-])(\d{2}):(\d{2}))$/);
  if (!match || !isDateOnly(match[1])) return false;
  const [, , hours, minutes, seconds, , , offsetHours, offsetMinutes] = match;
  if (Number(hours) > 23 || Number(minutes) > 59 || Number(seconds) > 59) return false;
  if (offsetHours && (Number(offsetHours) > 23 || Number(offsetMinutes) > 59)) return false;
  return Number.isFinite(Date.parse(value));
}

function localMidnightUtc(value, timeZone) {
  if (!isDateOnly(value)) throw new HttpError(400, 'Dates must use the YYYY-MM-DD format.');
  const [year, month, day] = value.split('-').map(Number);
  const desiredWallTime = Date.UTC(year, month - 1, day);
  let timestamp = desiredWallTime;
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(timestamp))
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, Number(part.value)]),
    );
    const actualWallTime = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    const correction = desiredWallTime - actualWallTime;
    timestamp += correction;
    if (correction === 0) break;
  }

  return new Date(timestamp);
}

function isAtLeastHoursAhead(timestamp, hours, timeZone, now = new Date()) {
  const requestedTime = isTimestamp(timestamp)
    ? Date.parse(timestamp)
    : localMidnightUtc(timestamp, timeZone).getTime();
  return requestedTime >= now.getTime() + hours * 60 * 60 * 1000;
}

function validatePhone(phone) {
  return typeof phone === 'string'
    && phone.trim().length <= 30
    && /^\+?[0-9\s().-]{7,30}$/.test(phone.trim());
}

function validateBookingInput(body, termsVersion) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object.');
  }
  if (body.note !== undefined
    && (typeof body.note !== 'string' || body.note.length > 2000)) {
    throw new HttpError(400, 'note must be at most 2000 characters.');
  }
  if (!validatePhone(body.contactPhone)) {
    throw new HttpError(400, 'contactPhone must be a valid phone number.');
  }
  if (!Array.isArray(body.visitors) || body.visitors.length === 0) {
    throw new HttpError(400, 'Provide at least one visitor.');
  }
  for (const visitor of body.visitors) {
    if (!visitor || typeof visitor !== 'object' || Array.isArray(visitor)
      || typeof visitor.name !== 'string' || !visitor.name.trim()
      || visitor.name.trim().length > 200
      || typeof visitor.relationship !== 'string' || !visitor.relationship.trim()
      || visitor.relationship.trim().length > 100) {
      throw new HttpError(400, 'Each visitor needs a name and relationship.');
    }
  }
  if (!isTimestamp(body.checkIn) || !isTimestamp(body.checkOut)) {
    throw new HttpError(400, 'checkIn and checkOut must be ISO 8601 date-times with a timezone.');
  }
  if (Date.parse(body.checkOut) <= Date.parse(body.checkIn)) {
    throw new HttpError(400, 'checkOut must be after checkIn.');
  }
  if (body.termsAccepted !== true || body.termsVersion !== termsVersion) {
    throw new HttpError(400, 'Accept the current terms before submitting a booking.');
  }
}

function validateExtensionInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object.');
  }
  if (!isTimestamp(body.requestedCheckOut)) {
    throw new HttpError(400, 'requestedCheckOut must be an ISO 8601 date-time with a timezone.');
  }
  if (typeof body.reason !== 'string' || !body.reason.trim() || body.reason.trim().length > 2000) {
    throw new HttpError(400, 'reason is required and must be at most 2000 characters.');
  }
}

function validateDecision(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)
    || !['approve', 'deny'].includes(body.decision)) {
    throw new HttpError(400, 'decision must be "approve" or "deny".');
  }
  if (body.note !== undefined
    && (typeof body.note !== 'string' || body.note.length > 2000)) {
    throw new HttpError(400, 'note must be at most 2000 characters.');
  }
  if (body.decision === 'deny'
    && (typeof body.reason !== 'string' || !body.reason.trim() || body.reason.trim().length > 2000)) {
    throw new HttpError(400, 'A denial reason is required and must be at most 2000 characters.');
  }
}

function validateRoomNumbers(value) {
  if (!Array.isArray(value) || value.length === 0
    || value.some((room) => typeof room !== 'string' || !room.trim() || room.trim().length > 80)) {
    throw new HttpError(400, 'roomNumbers must be a non-empty list of room names or numbers.');
  }
  const rooms = value.map((room) => room.trim());
  if (new Set(rooms.map((room) => room.toLowerCase())).size !== rooms.length) {
    throw new HttpError(400, 'roomNumbers must not contain duplicates.');
  }
  return rooms;
}

function validateManagerConfirmation(body, visitorCount) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object.');
  }
  const submittedRooms = Array.isArray(body.roomAllocations) && body.roomAllocations.length
    ? body.roomAllocations
    : Array.isArray(body.roomNumbers)
      ? body.roomNumbers
      : null;
  if (!submittedRooms || submittedRooms.length === 0) {
    throw new HttpError(400, 'roomAllocations must contain at least one room.');
  }
  const roomAllocations = submittedRooms.map((submittedRoom, index) => {
    const room = typeof submittedRoom === 'string'
      ? {
        roomNumber: submittedRoom,
        facilityBlock: body.facilityBlock,
        occupancy: body.occupancy,
      }
      : submittedRoom;
    const roomNumber = room && (
      room.roomNumber
      || room.roomNo
      || room.number
      || room.name
    );
    if (typeof roomNumber !== 'string' || !roomNumber.trim() || roomNumber.trim().length > 80) {
      throw new HttpError(400, `Room ${index + 1} needs a room number or name.`);
    }
    const facilityBlock = room.facilityBlock || body.facilityBlock;
    const occupancy = room.occupancy || body.occupancy;
    if (!['mess', 'transit'].includes(facilityBlock)
      || !['single', 'double'].includes(occupancy)) {
      throw new HttpError(400, `Room ${index + 1} needs a valid facilityBlock and occupancy.`);
    }
    const dailyRate = {
      mess: { single: 1500, double: 2000 },
      transit: { single: 2000, double: 2500 },
    }[facilityBlock][occupancy];
    return {
      roomNumber: roomNumber.trim(),
      facilityBlock,
      occupancy,
      dailyRate,
    };
  });
  const roomNumbers = validateRoomNumbers(roomAllocations.map((room) => room.roomNumber));
  const peopleCount = visitorCount + 1;
  const minimumRoomCount = Math.ceil(peopleCount / 2);
  const totalCapacity = roomAllocations.reduce(
    (capacity, room) => capacity + (room.occupancy === 'single' ? 1 : 2),
    0,
  );
  if (roomAllocations.length < minimumRoomCount || totalCapacity < peopleCount) {
    throw new HttpError(400, `Assign at least ${minimumRoomCount} room(s) and enough occupancy for ${peopleCount} person(s).`);
  }
  if (body.note !== undefined
    && (typeof body.note !== 'string' || body.note.length > 2000)) {
    throw new HttpError(400, 'note must be at most 2000 characters.');
  }
  return {
    roomAllocations,
    roomNumbers,
    facilityBlock: roomAllocations.length === 1 ? roomAllocations[0].facilityBlock : null,
    occupancy: roomAllocations.length === 1 ? roomAllocations[0].occupancy : null,
    dailyRate: roomAllocations.reduce((total, room) => total + room.dailyRate, 0),
    note: (body.note || '').trim(),
  };
}

module.exports = {
  isDateOnly,
  isTimestamp,
  localMidnightUtc,
  isAtLeastHoursAhead,
  validateBookingInput,
  validateExtensionInput,
  validateDecision,
  validateRoomNumbers,
  validateManagerConfirmation,
};

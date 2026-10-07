function bookingDateLabel(checkIn) {
  const timestamp = Date.parse(checkIn);
  if (!Number.isFinite(timestamp)) return String(checkIn).slice(0, 10);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(timestamp);
}

function bookingDateTimeLabel(value) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return String(value);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(timestamp);
}

function bookingSubjectContext(checkIn, visitorCount) {
  const visitorLabel = visitorCount === 1 ? '1 visitor' : `${visitorCount} visitors`;
  return `${bookingDateLabel(checkIn)} - ${visitorLabel}`;
}

function bookingActionRequired({
  reviewer,
  studentName,
  rollNumber,
  checkIn,
  checkOut,
  visitorCount,
  mobileNumber,
  studentNote,
  reviewerNote,
  actionUrl,
}) {
  const details = [
    `Student: ${studentName} (${rollNumber})`,
    `Mobile: ${mobileNumber}`,
    `Visitors: ${visitorCount}`,
    `Check-in: ${bookingDateTimeLabel(checkIn)}`,
    `Check-out: ${bookingDateTimeLabel(checkOut)}`,
  ];
  return {
    subject: `Action required: Transit booking review - ${bookingSubjectContext(checkIn, visitorCount)} - ${studentName}`,
    text: [
      `A transit booking request is waiting for your review as ${reviewer}.`,
      '',
      'BOOKING DETAILS',
      ...details,
      ...(studentNote ? ['', 'STUDENT NOTE', studentNote] : []),
      ...(reviewerNote ? ['', 'ASSOCIATE DEAN NOTE FOR TRANSIT MANAGER', reviewerNote] : []),
      '',
      'Sign in with the authorized IIT Dharwad Google account to approve or deny this request:',
      actionUrl,
      '',
      'The link opens the protected review queue; it does not approve or deny the request by itself.',
    ].join('\n'),
  };
}

function bookingDenied({ reviewer, reason, checkIn, visitorCount, studentName }) {
  return {
    subject: `Transit booking denied: ${bookingSubjectContext(checkIn, visitorCount)} - ${studentName}`,
    text: [
      'Hello,',
      '',
      `Your transit booking request was denied by the ${reviewer}.`,
      '',
      `Check-in: ${bookingDateTimeLabel(checkIn)}`,
      `Visitors: ${visitorCount}`,
      `Reason: ${reason}`,
      '',
      'Please contact the Transit Facility team if you have questions.',
    ].join('\n'),
  };
}

function extensionActionRequired({ reviewer, studentName, checkIn, currentCheckOut, requestedCheckOut, reason, actionUrl }) {
  return {
    subject: `Action required: transit extension for ${studentName}`,
    text: [
      `A transit extension request is waiting for your review as ${reviewer}.`,
      '',
      `Student: ${studentName}`,
      `Current check-in: ${checkIn}`,
      `Current check-out: ${currentCheckOut}`,
      `Requested check-out: ${requestedCheckOut}`,
      `Reason: ${reason}`,
      '',
      'Sign in with the authorized IIT Dharwad Google account to approve or deny this request:',
      actionUrl,
      '',
      'The link opens the protected review queue; it does not approve or deny the request by itself.',
    ].join('\n'),
  };
}

function bookingConfirmed({
  studentName,
  checkIn,
  checkOut,
  visitorCount,
  roomNumbers,
  roomAllocations = [],
  dailyRate,
  studentNote,
  reviewerNote,
  managerNote,
}) {
  const roomLabel = roomNumbers.length === 1 ? 'room' : 'rooms';
  const assignedRoomLines = roomAllocations.length
    ? roomAllocations.map((room) => {
      const blockName = room.facilityBlock === 'mess' ? 'Mess Block' : 'Transit Facility';
      const occupancyName = room.occupancy === 'single' ? 'Single' : 'Double';
      return `Room ${room.roomNumber} - ${blockName}, ${occupancyName} occupancy: Rs. ${Number(room.dailyRate).toLocaleString('en-IN')} per day (24 hours), excluding food.`;
    })
    : roomNumbers.map((roomNumber) => `Room ${roomNumber}`);
  const dailyTotal = roomAllocations.length
    ? roomAllocations.reduce((total, room) => total + Number(room.dailyRate), 0)
    : Number(dailyRate);
  return {
    subject: `Transit booking confirmed: ${bookingSubjectContext(checkIn, visitorCount)} - ${studentName}`,
    text: [
      `Hello ${studentName},`,
      '',
      'BOOKING CONFIRMATION',
      `Your room booking is confirmed with ${roomLabel}.`,
      '',
      'STAY DETAILS',
      `Visitors: ${visitorCount}`,
      `Check-in: ${bookingDateTimeLabel(checkIn)}`,
      `Check-out: ${bookingDateTimeLabel(checkOut)}`,
      'ROOM ALLOCATION AND CHARGES',
      ...assignedRoomLines,
      `Total staying charges: Rs. ${dailyTotal.toLocaleString('en-IN')} per day (24 hours), excluding food.`,
      'Room charges will be collected at check-in.',
      ...(studentNote ? ['', 'YOUR NOTE', studentNote] : []),
      ...(reviewerNote ? ['', 'ASSOCIATE DEAN NOTE', reviewerNote] : []),
      ...(managerNote ? ['', 'TRANSIT MANAGER NOTE', managerNote] : []),
      '',
      'Please contact the Transit Facility team if you have questions.',
    ].join('\n'),
  };
}

function extensionDenied({ reviewer, reason }) {
  return {
    subject: 'Transit extension request update',
    text: [
      'Hello,',
      '',
      `Your transit extension request was denied by the ${reviewer}.`,
      '',
      `Reason: ${reason}`,
      '',
      'Please contact the Transit Facility team if you have questions.',
    ].join('\n'),
  };
}

function extensionConfirmed({ requestedCheckOut }) {
  return {
    subject: 'Transit extension confirmed',
    text: [
      'Hello,',
      '',
      'Your transit extension request has been confirmed.',
      `Your new check-out date is ${requestedCheckOut}.`,
      '',
      'Please contact the Transit Facility team if you have questions.',
    ].join('\n'),
  };
}

module.exports = {
  bookingActionRequired,
  bookingDenied,
  bookingConfirmed,
  extensionActionRequired,
  extensionDenied,
  extensionConfirmed,
};

function bookingActionRequired({ reviewer, studentName, rollNumber, checkIn, checkOut, visitorCount, mobileNumber, actionUrl }) {
  return {
    subject: `Action required: transit booking for ${studentName}`,
    text: [
      `A transit booking request is waiting for your review as ${reviewer}.`,
      '',
      `Student: ${studentName} (${rollNumber})`,
      `Mobile: ${mobileNumber}`,
      `Visitors: ${visitorCount}`,
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut}`,
      '',
      'Sign in with the authorized IIT Dharwad Google account to approve or deny this request:',
      actionUrl,
      '',
      'The link opens the protected review queue; it does not approve or deny the request by itself.',
    ].join('\n'),
  };
}

function bookingDenied({ reviewer, reason }) {
  return {
    subject: 'Transit booking request update',
    text: [
      'Hello,',
      '',
      `Your transit booking request was denied by the ${reviewer}.`,
      '',
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

function bookingConfirmed({ studentName, checkIn, checkOut, roomNumbers }) {
  return {
    subject: 'Transit booking confirmed',
    text: [
      `Hello ${studentName},`,
      '',
      'Your transit facility booking has been confirmed.',
      '',
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut}`,
      `Room(s): ${roomNumbers.join(', ')}`,
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

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
  bookingDenied,
  bookingConfirmed,
  extensionDenied,
  extensionConfirmed,
};

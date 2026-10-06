const API_BASE_URL = (
  process.env.REACT_APP_TRANSIT_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export const requestTransitApi = async (path, token, options = {}) => {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error("The Transit API returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(body.error || `Transit API request failed (${response.status}).`);
  }

  return body;
};

export const normalizeBooking = (booking) => ({
  id: booking.id,
  studentName: booking.student_name,
  rollNumber: booking.student_roll_number,
  studentEmail: booking.student_email,
  mobileNumber: booking.contact_phone,
  visitors: booking.visitors,
  visitorCount: booking.visitors.length,
  checkIn: booking.check_in,
  checkOut: booking.check_out,
  status: booking.status,
  assignedRoom: (booking.room_numbers || []).join(", "),
  submittedAt: booking.created_at,
});

export const normalizeExtension = (extension) => ({
  id: extension.id,
  bookingId: extension.booking_id,
  studentName: extension.student_name,
  studentEmail: extension.student_email,
  requestedCheckOut: extension.requested_check_out,
  reason: extension.reason,
  status: extension.status,
  checkIn: extension.check_in,
  checkOut: extension.check_out,
  roomNumbers: extension.room_numbers || [],
  submittedAt: extension.created_at,
});

const pad = (value) => String(value).padStart(2, "0");

export const getRelativeDateTime = (days, hours) => {
  const value = new Date();
  value.setDate(value.getDate() + days);
  value.setHours(hours, 0, 0, 0);
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
};

export const getMinBookingDate = () => {
  const now = new Date();
  return new Date(now.getTime() + 48 * 60 * 60 * 1000);
};

export const createBlankVisitor = () => ({ name: "", relationship: "" });

export const createInitialBookings = () => [
  {
    id: "TF-1001",
    studentName: "Aarav Sharma",
    rollNumber: "B221020",
    mobileNumber: "9876543210",
    visitorCount: 2,
    visitors: [
      { name: "Meera Sharma", relationship: "Mother" },
      { name: "Rohit Sharma", relationship: "Brother" },
    ],
    checkIn: getRelativeDateTime(3, 10),
    checkOut: getRelativeDateTime(3, 18),
    status: "Pending",
    submittedAt: new Date().toISOString(),
    assignedRoom: "",
    denialReason: "",
  },
  {
    id: "TF-1002",
    studentName: "Aarav Sharma",
    rollNumber: "B221020",
    mobileNumber: "9876543210",
    visitorCount: 1,
    visitors: [{ name: "Aditi Sharma", relationship: "Sister" }],
    checkIn: getRelativeDateTime(6, 9),
    checkOut: getRelativeDateTime(6, 17),
    status: "Approved",
    submittedAt: new Date().toISOString(),
    assignedRoom: "",
    denialReason: "",
  },
  {
    id: "TF-1003",
    studentName: "Aarav Sharma",
    rollNumber: "B221020",
    mobileNumber: "9876543210",
    visitorCount: 3,
    visitors: [
      { name: "Shivani Rao", relationship: "Mother" },
      { name: "Raghav Rao", relationship: "Father" },
      { name: "Nikhil Rao", relationship: "Brother" },
    ],
    checkIn: getRelativeDateTime(9, 12),
    checkOut: getRelativeDateTime(10, 12),
    status: "Allocated",
    submittedAt: new Date().toISOString(),
    assignedRoom: "D-214",
    denialReason: "",
  },
  {
    id: "TF-1004",
    studentName: "Ishita Nair",
    rollNumber: "B241015",
    mobileNumber: "8123456789",
    visitorCount: 1,
    visitors: [{ name: "Nirmal Nair", relationship: "Father" }],
    checkIn: getRelativeDateTime(12, 12),
    checkOut: getRelativeDateTime(12, 19),
    status: "Denied",
    submittedAt: new Date().toISOString(),
    assignedRoom: "",
    denialReason: "Quota exhausted for the requested period.",
  },
];

export const getInitialFormState = () => ({
  studentName: "Aarav Sharma",
  rollNumber: "B221020",
  mobileNumber: "9876543210",
  visitorCount: 2,
  visitors: [
    { name: "Meera Sharma", relationship: "Mother" },
    { name: "Rohit Sharma", relationship: "Brother" },
  ],
  checkInDate: "",
  checkInTime: "",
  checkOutDate: "",
  checkOutTime: "",
});

export const addBooking = (bookings, booking) => [booking, ...bookings];

export const updateBookingRecord = (bookings, bookingId, changes) =>
  bookings.map((booking) => (booking.id === bookingId ? { ...booking, ...changes } : booking));

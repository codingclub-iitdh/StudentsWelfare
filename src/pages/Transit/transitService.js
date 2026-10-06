const pad = (value) => String(value).padStart(2, "0");

export const getMinBookingDate = () => {
  const minimumDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
  return `${minimumDate.getFullYear()}-${pad(minimumDate.getMonth() + 1)}-${pad(minimumDate.getDate())}`;
};

export const getNextDate = (value) => {
  const nextDate = new Date(`${value}T12:00:00`);
  nextDate.setDate(nextDate.getDate() + 1);
  return `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())}`;
};

export const createBlankVisitor = () => ({ name: "", relationship: "" });

export const getInitialFormState = () => ({
  studentName: "",
  rollNumber: "",
  contactPhone: "",
  visitors: [createBlankVisitor()],
  checkInDate: "",
  checkInTime: "",
  checkOutDate: "",
  checkOutTime: "",
  termsAccepted: false,
});

export const formatTransitDate = (value, options = {}) => {
  if (!value) return "—";
  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(String(value))
    ? `${value}T12:00:00`
    : value;
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
    ...options,
  }).format(parsed);
};

export const formatTransitDateTime = (value) => formatTransitDate(value, {
  hour: "2-digit",
  minute: "2-digit",
});

export const toLocalDateTimeInput = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const getStatusLabel = (status) => ({
  pending_dean: "Pending Associate Dean",
  pending_manager: "Pending Transit Manager",
  denied_by_dean: "Denied by Associate Dean",
  denied_by_manager: "Denied by Transit Manager",
  confirmed: "Confirmed",
}[status] || status);

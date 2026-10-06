import React, { useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  createBlankVisitor,
  createInitialBookings,
  getInitialFormState,
  getMinBookingDate,
} from "./transitService";
import "./TransitPortal.css";

const pad = (value) => String(value).padStart(2, "0");

const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "status-pill status-pending";
    case "Approved":
      return "status-pill status-approved";
    case "Allocated":
      return "status-pill status-allocated";
    case "Denied":
      return "status-pill status-denied";
    default:
      return "status-pill";
  }
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
};

const formatDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const validateBooking = (values) => {
  const errors = {};

  if (!values.studentName || !values.studentName.trim()) {
    errors.studentName = "Student name is required.";
  }

  if (!values.rollNumber || !values.rollNumber.trim()) {
    errors.rollNumber = "Roll number is required.";
  }

  if (!values.mobileNumber || !/^\d{10}$/.test(values.mobileNumber.trim())) {
    errors.mobileNumber = "Enter a valid 10-digit mobile number.";
  }

  if (!values.visitorCount || Number(values.visitorCount) < 1) {
    errors.visitorCount = "At least one visitor is required.";
  }

  const visitorList = Array.from({ length: Number(values.visitorCount || 0) }, (_, index) => values.visitors[index] || createBlankVisitor());
  visitorList.forEach((visitor, index) => {
    if (!visitor.name || !visitor.name.trim()) {
      errors[`visitorName-${index}`] = "Visitor name is required.";
    }
    if (!visitor.relationship || !visitor.relationship.trim()) {
      errors[`visitorRelationship-${index}`] = "Relationship is required.";
    }
  });

  if (!values.checkInDate) {
    errors.checkInDate = "Check-in date is required.";
  }
  if (!values.checkInTime) {
    errors.checkInTime = "Check-in time is required.";
  }
  if (!values.checkOutDate) {
    errors.checkOutDate = "Check-out date is required.";
  }
  if (!values.checkOutTime) {
    errors.checkOutTime = "Check-out time is required.";
  }

  if (values.checkInDate && values.checkInTime && values.checkOutDate && values.checkOutTime) {
    const checkIn = new Date(`${values.checkInDate}T${values.checkInTime}`);
    const checkOut = new Date(`${values.checkOutDate}T${values.checkOutTime}`);
    const minimumAllowed = getMinBookingDate();

    if (checkIn < minimumAllowed) {
      errors.checkInDate = "Booking cannot be requested within 48 hours from now.";
      errors.checkInTime = "Booking cannot be requested within 48 hours from now.";
    }

    if (checkOut <= checkIn) {
      errors.checkOutDate = "Check-out must be after check-in.";
    }
  }

  return { ...errors, visitorList };
};

const StudentDashboard = () => {
  const [bookings, setBookings] = useState(createInitialBookings);
  const [selectedBookingId, setSelectedBookingId] = useState("TF-1001");
  const [showExtension, setShowExtension] = useState(false);
  const [extensionDetails, setExtensionDetails] = useState({
    newCheckOutDate: "",
    newCheckOutTime: "",
    reason: "",
  });
  const [extensionError, setExtensionError] = useState("");

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.id === selectedBookingId) || bookings[0],
    [bookings, selectedBookingId]
  );

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((booking) => booking.status === "Pending").length;
  const approvedBookings = bookings.filter((booking) => booking.status === "Approved").length;
  const activeBookings = bookings.filter((booking) => booking.status === "Allocated").length;

  const handleExtensionSubmit = () => {
    if (!selectedBooking || selectedBooking.status !== "Allocated") {
      setExtensionError("Only allocated bookings can be extended.");
      return;
    }

    if (!extensionDetails.newCheckOutDate || !extensionDetails.newCheckOutTime) {
      setExtensionError("Please select the new check-out date and time.");
      return;
    }

    const currentCheckOut = new Date(`${selectedBooking.checkOut.substring(0, 10)}T${selectedBooking.checkOut.substring(11, 16)}`);
    const requestedExtension = new Date(`${extensionDetails.newCheckOutDate}T${extensionDetails.newCheckOutTime}`);

    if (requestedExtension <= currentCheckOut) {
      setExtensionError("The requested extension must be later than the current check-out time.");
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === selectedBooking.id
          ? {
              ...booking,
              status: "Approved",
              checkOut: `${extensionDetails.newCheckOutDate}T${extensionDetails.newCheckOutTime}`,
              extensionRequest: {
                newCheckOutDate: extensionDetails.newCheckOutDate,
                newCheckOutTime: extensionDetails.newCheckOutTime,
                reason: extensionDetails.reason,
              },
            }
          : booking
      )
    );

    setShowExtension(false);
    setExtensionDetails({ newCheckOutDate: "", newCheckOutTime: "", reason: "" });
    setExtensionError("");
  };

  return (
    <div className="transit-dashboard">
      <div className="section-head mb-4">
        <div>
          <span className="eyebrow">Student Portal</span>
          <h2>Transit Facility Dashboard</h2>
        </div>
        <NavLink to="/transit/student/booking" className="btn btn-primary btn-portal">
          New Booking
        </NavLink>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <span>Total bookings</span>
          <strong>{totalBookings}</strong>
        </div>
        <div className="overview-card accent-warn">
          <span>Pending</span>
          <strong>{pendingBookings}</strong>
        </div>
        <div className="overview-card accent-success">
          <span>Approved</span>
          <strong>{approvedBookings}</strong>
        </div>
        <div className="overview-card accent-info">
          <span>Active / allocated</span>
          <strong>{activeBookings}</strong>
        </div>
      </div>

      <div className="booking-layout">
        <div className="booking-list-panel">
          <div className="panel-header">
            <h3>My bookings</h3>
          </div>
          <div className="booking-list">
            {bookings.map((booking) => (
              <button
                type="button"
                key={booking.id}
                className={`booking-list-item ${selectedBookingId === booking.id ? "selected" : ""}`}
                onClick={() => setSelectedBookingId(booking.id)}
              >
                <div className="booking-item-top">
                  <span>{booking.id}</span>
                  <span className={getStatusClass(booking.status)}>{booking.status}</span>
                </div>
                <p>
                  {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                </p>
                <small>{booking.visitorCount} visitors</small>
              </button>
            ))}
          </div>
        </div>

        <div className="booking-detail-panel">
          <div className="panel-header details-header">
            <h3>Booking details</h3>
            {selectedBooking && selectedBooking.status === "Allocated" ? (
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowExtension((current) => !current)}>
                Apply for Extension
              </button>
            ) : null}
          </div>

          {selectedBooking ? (
            <>
              <div className="detail-grid">
                <div>
                  <label>Booking ID</label>
                  <p>{selectedBooking.id}</p>
                </div>
                <div>
                  <label>Status</label>
                  <p>
                    <span className={getStatusClass(selectedBooking.status)}>{selectedBooking.status}</span>
                  </p>
                </div>
                <div>
                  <label>Check-in</label>
                  <p>{formatDateTime(selectedBooking.checkIn)}</p>
                </div>
                <div>
                  <label>Check-out</label>
                  <p>{formatDateTime(selectedBooking.checkOut)}</p>
                </div>
                <div>
                  <label>Visitors</label>
                  <p>{selectedBooking.visitorCount}</p>
                </div>
                <div>
                  <label>Assigned room</label>
                  <p>{selectedBooking.assignedRoom || "Pending allocation"}</p>
                </div>
              </div>

              <div className="visitor-list-box">
                <h4>Visitors</h4>
                <ul>
                  {selectedBooking.visitors.map((visitor, index) => (
                    <li key={`${selectedBooking.id}-${index}`}>
                      <strong>{visitor.name}</strong>
                      <span>{visitor.relationship}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {showExtension && (
                <div className="extension-panel">
                  <h4>Extension request</h4>
                  <p className="muted-text">
                    This request will be routed for Associate Dean and Transit Manager approval.
                  </p>
                  <div className="row g-3 mt-1">
                    <div className="col-md-6">
                      <label className="form-label">New check-out date</label>
                      <input
                        className="form-control"
                        type="date"
                        min={selectedBooking.checkOut ? selectedBooking.checkOut.substring(0, 10) : ""}
                        value={extensionDetails.newCheckOutDate}
                        onChange={(event) => setExtensionDetails((current) => ({ ...current, newCheckOutDate: event.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">New check-out time</label>
                      <input
                        className="form-control"
                        type="time"
                        value={extensionDetails.newCheckOutTime}
                        onChange={(event) => setExtensionDetails((current) => ({ ...current, newCheckOutTime: event.target.value }))}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Reason for extension</label>
                      <textarea
                        className="form-control"
                        value={extensionDetails.reason}
                        onChange={(event) => setExtensionDetails((current) => ({ ...current, reason: event.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>
                  {extensionError ? <p className="field-error mt-2">{extensionError}</p> : null}
                  <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-primary" type="button" onClick={handleExtensionSubmit}>
                      Submit extension
                    </button>
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setShowExtension(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">No booking selected.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssociateDeanDashboard = () => {
  const [bookings, setBookings] = useState(createInitialBookings);
  const [confirmingId, setConfirmingId] = useState("" );
  const [denialReason, setDenialReason] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingBookings = bookings.filter((booking) => booking.status === "Pending");

  const handleDecision = (bookingId, status) => {
    if (status === "Denied") {
      const booking = bookings.find((item) => item.id === bookingId);
      if (!booking) return;

      if (!denialReason.trim() && confirmingId === bookingId) {
        setError("Please provide a denial reason or confirm the rejection.");
        return;
      }

      setConfirmingId("");
      setError("");
    }

    setIsProcessing(true);
    setTimeout(() => {
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status,
                denialReason: status === "Denied" ? denialReason || "Booking request not approved." : "",
              }
            : booking
        )
      );
      setIsProcessing(false);
      setDenialReason("");
    }, 500);
  };

  return (
    <div className="transit-dashboard admin-dashboard">
      <div className="section-head mb-4">
        <div>
          <span className="eyebrow">Associate Dean</span>
          <h2>Approval queue</h2>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table transit-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll</th>
              <th>Visitors</th>
              <th>Dates</th>
              <th>Details</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingBookings.length ? (
              pendingBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className="table-identity">
                      <strong>{booking.studentName}</strong>
                      <span>{booking.mobileNumber}</span>
                    </div>
                  </td>
                  <td>{booking.rollNumber}</td>
                  <td>{booking.visitorCount}</td>
                  <td>
                    <div className="split-date">
                      <span>{formatDate(booking.checkIn)}</span>
                      <span>{formatDate(booking.checkOut)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="visitor-mini-list">
                      {booking.visitors.map((visitor, index) => (
                        <div key={`${booking.id}-visit-${index}`}>
                          <strong>{visitor.name}</strong>
                          <small>{visitor.relationship}</small>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={getStatusClass(booking.status)}>{booking.status}</span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button type="button" className="btn btn-success btn-sm" disabled={isProcessing} onClick={() => handleDecision(booking.id, "Approved")}>
                        Approve
                      </button>
                      <button type="button" className="btn btn-outline-danger btn-sm" disabled={isProcessing} onClick={() => setConfirmingId(booking.id)}>
                        Deny
                      </button>
                    </div>
                    {confirmingId === booking.id ? (
                      <div className="deny-box mt-2">
                        <label className="form-label">Denial reason</label>
                        <textarea
                          className="form-control form-control-sm"
                          rows={3}
                          value={denialReason}
                          onChange={(event) => setDenialReason(event.target.value)}
                          placeholder="Provide a reason for denial"
                        />
                        <div className="d-flex gap-2 mt-2">
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDecision(booking.id, "Denied")}>
                            Confirm deny
                          </button>
                          <button type="button" className="btn btn-link btn-sm" onClick={() => { setConfirmingId(""); setError(""); }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state-cell">
                  No pending bookings require review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error ? <div className="alert alert-warning mt-3">{error}</div> : null}
    </div>
  );
};

const ManagerDashboard = () => {
  const [bookings, setBookings] = useState(createInitialBookings);
  const [roomInputs, setRoomInputs] = useState({});

  const approvedBookings = bookings.filter((booking) => booking.status === "Approved");

  const handleAllocation = (bookingId) => {
    const nextRoom = roomInputs[bookingId]?.trim();
    if (!nextRoom) {
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "Allocated",
              assignedRoom: nextRoom,
            }
          : booking
      )
    );
  };

  return (
    <div className="transit-dashboard manager-dashboard">
      <div className="section-head mb-4">
        <div>
          <span className="eyebrow">Transit Manager</span>
          <h2>Approved booking queue</h2>
        </div>
      </div>

      <div className="manager-layout">
        {approvedBookings.length ? (
          approvedBookings.map((booking) => (
            <div className="manager-card" key={booking.id}>
              <div className="manager-card-header">
                <div>
                  <strong>{booking.id}</strong>
                  <p>{booking.studentName}</p>
                </div>
                <span className={getStatusClass(booking.status)}>{booking.status}</span>
              </div>

              <div className="manager-meta">
                <span>Roll no: {booking.rollNumber}</span>
                <span>Visitors: {booking.visitorCount}</span>
              </div>

              <div className="booking-mini-grid">
                <div>
                  <label>Check-in</label>
                  <p>{formatDateTime(booking.checkIn)}</p>
                </div>
                <div>
                  <label>Check-out</label>
                  <p>{formatDateTime(booking.checkOut)}</p>
                </div>
              </div>

              <div className="visitor-mini-list compact-list">
                {booking.visitors.map((visitor, index) => (
                  <div key={`${booking.id}-man-${index}`}>
                    <strong>{visitor.name}</strong>
                    <small>{visitor.relationship}</small>
                  </div>
                ))}
              </div>

              <div className="allocation-box">
                <label className="form-label">Assigned room number(s)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., D-214 or Room 12"
                  value={roomInputs[booking.id] || ""}
                  onChange={(event) => setRoomInputs((current) => ({ ...current, [booking.id]: event.target.value }))}
                />
                <button type="button" className="btn btn-primary mt-3" onClick={() => handleAllocation(booking.id)}>
                  Confirm allocation
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No approved bookings are waiting for room assignment.</div>
        )}
      </div>
    </div>
  );
};

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="transit-terms">
      <div className="terms-card">
        <span className="eyebrow">Transit Facility</span>
        <h2>Terms & Conditions</h2>

        <div className="terms-content">
          <ul>
            <li>Visitor identity must be verified at the Transit Office before check-in.</li>
            <li>Payment for facility booking is offline and must be completed at the Transit Office as per the specified process.</li>
            <li>Bookings are subject to administrative approval and priority rules set by the Students&apos; Welfare and Transit Facility team.</li>
            <li>Only valid IIT Dharwad student records and authenticated student information should be used while creating a request.</li>
            <li>Admissions, visitor eligibility, and room allocation are governed by the operational rules and availability ledger maintained offline by the Transit Facility team.</li>
            <li>No online payment gateway, Aadhaar upload, or government ID upload is part of this portal.</li>
          </ul>
        </div>

        <div className="form-check terms-checkbox">
          <input
            id="acceptTerms"
            className="form-check-input"
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="acceptTerms">
            I have read and agree to the Terms & Conditions.
          </label>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-portal"
          disabled={!accepted}
          onClick={() => navigate("/transit/student/booking")}
        >
          Continue to Booking
        </button>
      </div>
    </div>
  );
};

const BookingForm = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  const minimumCheckInDate = getMinBookingDate();
  const minDateValue = `${minimumCheckInDate.getFullYear()}-${pad(minimumCheckInDate.getMonth() + 1)}-${pad(minimumCheckInDate.getDate())}`;

  const handleVisitorCountChange = (event) => {
    const nextCount = Number(event.target.value || 0);
    setFormValues((current) => {
      const nextVisitors = Array.from({ length: nextCount }, (_, index) => current.visitors[index] || createBlankVisitor());
      return { ...current, visitorCount: nextCount, visitors: nextVisitors };
    });
  };

  const handleVisitorInput = (index, field, value) => {
    setFormValues((current) => ({
      ...current,
      visitors: current.visitors.map((visitor, visitorIndex) =>
        visitorIndex === index ? { ...visitor, [field]: value } : visitor
      ),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateBooking(formValues);

    const filteredErrors = { ...validation };
    delete filteredErrors.visitorList;
    setErrors(filteredErrors);

    if (Object.keys(filteredErrors).length > 0) {
      setServerMessage("Please correct the highlighted fields before submitting the request.");
      return;
    }

    const booking = {
      id: `TF-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: formValues.studentName.trim(),
      rollNumber: formValues.rollNumber.trim(),
      mobileNumber: formValues.mobileNumber.trim(),
      visitorCount: Number(formValues.visitorCount),
      visitors: formValues.visitors.slice(0, Number(formValues.visitorCount)),
      checkIn: `${formValues.checkInDate}T${formValues.checkInTime}`,
      checkOut: `${formValues.checkOutDate}T${formValues.checkOutTime}`,
      status: "Pending",
      submittedAt: new Date().toISOString(),
      assignedRoom: "",
      denialReason: "",
    };

    setServerMessage(`Booking ${booking.id} submitted successfully and is pending review.`);
    setFormValues(getInitialFormState());
    setErrors({});

    setTimeout(() => navigate("/transit/student-dashboard"), 700);
  };

  return (
    <div className="transit-booking">
      <div className="section-head mb-4">
        <div>
          <span className="eyebrow">Student booking</span>
          <h2>Book Transit Facility</h2>
        </div>
      </div>

      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <div className="form-section">
          <h3>Student information</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Student Name</label>
              <input
                className={`form-control ${errors.studentName ? "is-invalid" : ""}`}
                value={formValues.studentName}
                onChange={(event) => setFormValues((current) => ({ ...current, studentName: event.target.value }))}
              />
              {errors.studentName ? <div className="field-error">{errors.studentName}</div> : null}
            </div>
            <div className="col-md-4">
              <label className="form-label">Roll Number</label>
              <input
                className={`form-control ${errors.rollNumber ? "is-invalid" : ""}`}
                value={formValues.rollNumber}
                onChange={(event) => setFormValues((current) => ({ ...current, rollNumber: event.target.value }))}
              />
              {errors.rollNumber ? <div className="field-error">{errors.rollNumber}</div> : null}
            </div>
            <div className="col-md-4">
              <label className="form-label">Mobile Number</label>
              <input
                className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
                value={formValues.mobileNumber}
                onChange={(event) => setFormValues((current) => ({ ...current, mobileNumber: event.target.value }))}
              />
              {errors.mobileNumber ? <div className="field-error">{errors.mobileNumber}</div> : null}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Visitor information</h3>
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label">Number of visitors</label>
              <input
                type="number"
                min="1"
                className={`form-control ${errors.visitorCount ? "is-invalid" : ""}`}
                value={formValues.visitorCount}
                onChange={handleVisitorCountChange}
              />
              {errors.visitorCount ? <div className="field-error">{errors.visitorCount}</div> : null}
            </div>
          </div>

          <div className="visitor-stack">
            {Array.from({ length: Number(formValues.visitorCount || 0) }, (_, index) => (
              <div className="visitor-card" key={`visitor-${index}`}>
                <h4>Visitor {index + 1}</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      className={`form-control ${errors[`visitorName-${index}`] ? "is-invalid" : ""}`}
                      value={formValues.visitors[index]?.name || ""}
                      onChange={(event) => handleVisitorInput(index, "name", event.target.value)}
                    />
                    {errors[`visitorName-${index}`] ? <div className="field-error">{errors[`visitorName-${index}`]}</div> : null}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Relationship</label>
                    <input
                      className={`form-control ${errors[`visitorRelationship-${index}`] ? "is-invalid" : ""}`}
                      value={formValues.visitors[index]?.relationship || ""}
                      onChange={(event) => handleVisitorInput(index, "relationship", event.target.value)}
                    />
                    {errors[`visitorRelationship-${index}`] ? <div className="field-error">{errors[`visitorRelationship-${index}`]}</div> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Booking dates</h3>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Check-in date</label>
              <input
                type="date"
                min={minDateValue}
                className={`form-control ${errors.checkInDate ? "is-invalid" : ""}`}
                value={formValues.checkInDate}
                onChange={(event) => setFormValues((current) => ({ ...current, checkInDate: event.target.value }))}
              />
              {errors.checkInDate ? <div className="field-error">{errors.checkInDate}</div> : null}
            </div>
            <div className="col-md-3">
              <label className="form-label">Check-in time</label>
              <input
                type="time"
                className={`form-control ${errors.checkInTime ? "is-invalid" : ""}`}
                value={formValues.checkInTime}
                onChange={(event) => setFormValues((current) => ({ ...current, checkInTime: event.target.value }))}
              />
              {errors.checkInTime ? <div className="field-error">{errors.checkInTime}</div> : null}
            </div>
            <div className="col-md-3">
              <label className="form-label">Check-out date</label>
              <input
                type="date"
                min={formValues.checkInDate || minDateValue}
                className={`form-control ${errors.checkOutDate ? "is-invalid" : ""}`}
                value={formValues.checkOutDate}
                onChange={(event) => setFormValues((current) => ({ ...current, checkOutDate: event.target.value }))}
              />
              {errors.checkOutDate ? <div className="field-error">{errors.checkOutDate}</div> : null}
            </div>
            <div className="col-md-3">
              <label className="form-label">Check-out time</label>
              <input
                type="time"
                className={`form-control ${errors.checkOutTime ? "is-invalid" : ""}`}
                value={formValues.checkOutTime}
                onChange={(event) => setFormValues((current) => ({ ...current, checkOutTime: event.target.value }))}
              />
              {errors.checkOutTime ? <div className="field-error">{errors.checkOutTime}</div> : null}
            </div>
          </div>

          <div className="booking-rule-note mt-3">
            <strong>48-hour booking rule:</strong> A booking request cannot be made within the next 48 hours from the current system time.
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center form-actions">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/transit/terms")}>
            Back to terms
          </button>
          <button type="submit" className="btn btn-primary btn-portal">
            Submit booking
          </button>
        </div>

        {serverMessage ? <div className="alert alert-success mt-3">{serverMessage}</div> : null}
      </form>
    </div>
  );
};

const TransitLanding = () => (
  <div className="transit-landing">
    <div className="landing-hero">
      <span className="eyebrow">IIT Dharwad Students&apos; Welfare</span>
      <h1>Transit Facility Booking Portal</h1>
      <p>
        Manage student bookings, approvals, and room allocation in a role-based workflow designed to match the existing SW website.
      </p>
      <div className="landing-actions">
        <NavLink to="/transit/terms" className="btn btn-primary btn-portal">
          Student login
        </NavLink>
        <NavLink to="/transit/dean" className="btn btn-outline-primary btn-portal">
          Associate Dean
        </NavLink>
        <NavLink to="/transit/manager" className="btn btn-outline-primary btn-portal">
          Transit Manager
        </NavLink>
      </div>
    </div>

    <div className="feature-grid">
      <div className="info-card">
        <h3>Student flow</h3>
        <p>Read and accept the T&amp;C, complete booking form, and track status updates.</p>
      </div>
      <div className="info-card">
        <h3>Dean review</h3>
        <p>Review pending requests, confirm visitor details, and approve or deny requests.</p>
      </div>
      <div className="info-card">
        <h3>Manager allocation</h3>
        <p>Assign rooms to approved bookings and keep check-in information ready.</p>
      </div>
    </div>
  </div>
);

const TransitPortal = () => (
  <Routes>
    <Route path="/" element={<TransitLanding />} />
    <Route path="/terms" element={<TermsAndConditions />} />
    <Route path="/student" element={<StudentDashboard />} />
    <Route path="/student-dashboard" element={<StudentDashboard />} />
    <Route path="/student/booking" element={<BookingForm />} />
    <Route path="/dean" element={<AssociateDeanDashboard />} />
    <Route path="/manager" element={<ManagerDashboard />} />
    <Route path="*" element={<Navigate to="/transit" replace />} />
  </Routes>
);

export default TransitPortal;

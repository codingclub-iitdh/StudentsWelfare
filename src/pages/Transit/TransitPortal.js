import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  formatTransitDate,
  formatTransitDateTime,
  getInitialFormState,
  getMinBookingDate,
  getStatusLabel,
  createBlankVisitor,
  toLocalDateTimeInput,
} from "./transitService";
import {
  normalizeBooking,
  normalizeExtension,
  requestTransitApi,
} from "./transitApi";
import { TransitAuthProvider, useTransitAuth } from "./TransitAuth";
import "./TransitPortal.css";

const rolePaths = {
  student: "/transit/student",
  associate_dean: "/transit/dean",
  transit_manager: "/transit/manager",
};

const getStatusClass = (status) => {
  if (status === "confirmed") return "status-pill status-allocated";
  if (status.startsWith("denied")) return "status-pill status-denied";
  if (status === "pending_manager") return "status-pill status-approved";
  return "status-pill status-pending";
};

const BookingProgress = ({ booking }) => {
  const isDeniedByDean = booking.status === "denied_by_dean";
  const isDeniedByManager = booking.status === "denied_by_manager";
  const isDenied = isDeniedByDean || isDeniedByManager;
  const isApproved = ["pending_manager", "denied_by_manager", "confirmed"].includes(booking.status);
  const approvalState = isDeniedByDean
    ? "denied"
    : booking.status === "pending_dean"
      ? "current"
      : isApproved
        ? "complete"
        : "upcoming";
  const allocationState = isDeniedByManager
    ? "denied"
    : booking.status === "confirmed"
      ? "complete"
      : booking.status === "pending_manager"
        ? "current"
        : "upcoming";
  const nextAction = {
    pending_dean: "Next: Your request is waiting for Associate Dean review.",
    pending_manager: "Next: The Transit Manager needs to assign your room.",
    confirmed: booking.assignedRoom
      ? `Your room is assigned: ${booking.assignedRoom}.`
      : "Your booking is confirmed.",
    denied_by_dean: "Your request was denied by the Associate Dean. Contact the Transit Office if you have questions.",
    denied_by_manager: "Your request was denied by the Transit Manager. Contact the Transit Office if you have questions.",
  }[booking.status];

  const steps = [
    { label: "Submitted", state: "complete" },
    { label: "Approved", state: approvalState },
    { label: "Room allocated", state: allocationState },
  ];

  return (
    <section className="booking-progress" aria-label={`Booking progress: ${getStatusLabel(booking.status)}`}>
      <h4>Request progress</h4>
      <ol className="booking-progress-steps">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className={`booking-progress-step is-${step.state}`}
            aria-current={step.state === "current" ? "step" : undefined}
          >
            <span className="booking-progress-marker" aria-hidden="true">
              {step.state === "denied" ? "!" : index + 1}
            </span>
            <span>{step.label}</span>
          </li>
        ))}
      </ol>
      <p className={`booking-next-action${isDenied ? " is-denied" : ""}`}>
        {nextAction || getStatusLabel(booking.status)}
      </p>
      {isDenied ? (
        <p className="booking-denial-reason">
          <strong>Reason:</strong> {booking.denialReason || "Denial details are not available in this booking response."}
        </p>
      ) : null}
    </section>
  );
};

const Status = ({ status }) => (
  <span className={getStatusClass(status)}>{getStatusLabel(status)}</span>
);

const Alert = ({ error, success }) => {
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;
  if (success) return <div className="alert alert-success" role="status">{success}</div>;
  return null;
};

const GoogleSignInButton = () => {
  const buttonRef = useRef(null);
  const [error, setError] = useState("");
  const { signIn, isSigningIn, signInError, user } = useTransitAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleCredential = useCallback(async (response) => {
    if (!response.credential) {
      setError("Google did not return an ID token. Please try signing in again.");
      return;
    }
    try {
      const authenticatedUser = await signIn(response.credential);
      const rolePath = rolePaths[authenticatedUser.role] || "/transit";
      const requestedPath = new URLSearchParams(location.search).get("returnTo");
      const destination = requestedPath
        && (requestedPath === rolePath
          || requestedPath.startsWith(`${rolePath}?`)
          || requestedPath.startsWith(`${rolePath}/`))
        ? requestedPath
        : rolePath;
      navigate(destination, { replace: true });
    } catch {
      // The authentication provider exposes the API error in its sign-in state.
    }
  }, [location.search, navigate, signIn]);

  useEffect(() => {
    if (user) return undefined;
    if (!clientId) {
      setError("Set REACT_APP_GOOGLE_CLIENT_ID to the same OAuth client ID used by the backend.");
      return undefined;
    }

    let active = true;
    let poll;
    const initializeButton = () => {
      if (!active || !buttonRef.current || !window.google?.accounts?.id) return false;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 260,
      });
      setError("");
      return true;
    };

    const startedAt = Date.now();
    const waitForGoogle = () => {
      if (initializeButton()) return;
      if (!active) return;
      if (Date.now() - startedAt > 10000) {
        setError("Google sign-in could not load. Check your connection and reload the page.");
        return;
      }
      poll = window.setTimeout(waitForGoogle, 100);
    };
    waitForGoogle();

    return () => {
      active = false;
      window.clearTimeout(poll);
    };
  }, [clientId, handleCredential, user]);

  if (user) return null;
  return (
    <div>
      <div ref={buttonRef} aria-label="Sign in with Google" />
      {(error || signInError) ? (
        <p className="field-error mt-2" role="alert">{error || signInError}</p>
      ) : null}
      {isSigningIn ? <p className="muted-text mt-2">Verifying your account…</p> : null}
    </div>
  );
};

const TransitHeader = () => {
  const { user, signOut } = useTransitAuth();
  return (
    <div className="transit-auth-bar">
      {user ? (
        <div className="transit-auth-user">
          <span className="muted-text">{user.name} ({user.email})</span>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={signOut}>
            Sign out
          </button>
        </div>
      ) : <GoogleSignInButton />}
    </div>
  );
};

const RequireRole = ({ role, children }) => {
  const { user } = useTransitAuth();
  const location = useLocation();
  if (!user) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/transit?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }
  if (user.role !== role) return <Navigate to={rolePaths[user.role] || "/transit"} replace />;
  return children;
};

const TransitLanding = () => {
  const { user } = useTransitAuth();
  return (
    <div className="transit-landing">
      <div className="landing-hero">
        <span className="eyebrow">IIT Dharwad Students&apos; Welfare</span>
        <h1>Transit Facility Booking Portal</h1>
        <p>
          Submit and track transit bookings, review student requests, and manage room allocation through the authenticated portal.
        </p>
        {user ? (
          <div className="landing-actions">
            <NavLink to={rolePaths[user.role] || "/transit"} className="btn btn-primary btn-portal">
              Open {user.role === "associate_dean" ? "Associate Dean" : user.role === "transit_manager" ? "Transit Manager" : "Student"} portal
            </NavLink>
          </div>
        ) : (
          <div className="landing-actions">
            <p className="muted-text">Sign in with your authorized IIT Dharwad Google account using the button above.</p>
          </div>
        )}
      </div>
      <div className="feature-grid">
        <div className="info-card">
          <h3>Student flow</h3>
          <p>Accept the current terms, submit a booking, and track its approval status.</p>
        </div>
        <div className="info-card">
          <h3>Associate Dean review</h3>
          <p>Review booking and extension requests and approve or deny them.</p>
        </div>
        <div className="info-card">
          <h3>Transit Manager allocation</h3>
          <p>Allocate rooms, confirm bookings, and make final extension decisions.</p>
        </div>
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
        <h2>Terms &amp; Conditions</h2>
        <div className="terms-content">
          <ul>
            <li>Visitor identity must be verified at the Transit Office before check-in.</li>
            <li>Payment for facility booking is offline and must be completed at the Transit Office as per the specified process.</li>
            <li>Bookings are subject to administrative approval and priority rules set by the Students&apos; Welfare and Transit Facility team.</li>
            <li>Only authenticated IIT Dharwad student information may be used when creating a request.</li>
            <li>Room availability and allocation are managed offline by the Transit Facility team.</li>
            <li>No online payment gateway or government ID upload is part of this portal.</li>
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
            I have read and agree to the Terms &amp; Conditions.
          </label>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-portal"
          disabled={!accepted}
          onClick={() => navigate("/transit/student/booking", { state: { acceptedTerms: true } })}
        >
          Continue to Booking
        </button>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { token } = useTransitAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [extensions, setExtensions] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [extension, setExtension] = useState({ dateTime: "", reason: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(() => location.state?.successMessage || "");
  const [refresh, setRefresh] = useState(0);
  const [submittingExtension, setSubmittingExtension] = useState(false);

  useEffect(() => {
    if (!location.state?.successMessage) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      requestTransitApi("/bookings", token),
      requestTransitApi("/extensions", token),
    ]).then(([bookingResult, extensionResult]) => {
      if (!active) return;
      const nextBookings = bookingResult.bookings.map(normalizeBooking);
      setBookings(nextBookings);
      setExtensions(extensionResult.extensions.map(normalizeExtension));
      setSelectedId((current) => nextBookings.some((booking) => booking.id === current)
        ? current
        : nextBookings[0]?.id || "");
      setError("");
    }).catch((requestError) => {
      if (active) setError(requestError.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [token, refresh]);

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.id === selectedId),
    [bookings, selectedId],
  );
  const selectedExtensions = extensions.filter((item) => item.bookingId === selectedId);
  const pendingCount = bookings.filter((booking) => booking.status.startsWith("pending")).length;
  const confirmedCount = bookings.filter((booking) => booking.status === "confirmed").length;

  const submitExtension = async (event) => {
    event.preventDefault();
    if (!selectedBooking || !extension.dateTime || !extension.reason.trim()) {
      setError("Choose a new check-out date and time and provide a reason.");
      return;
    }
    setSubmittingExtension(true);
    setError("");
    setMessage("");
    try {
      const result = await requestTransitApi(`/bookings/${selectedBooking.id}/extensions`, token, {
        method: "POST",
        body: JSON.stringify({
          requestedCheckOut: new Date(extension.dateTime).toISOString(),
          reason: extension.reason.trim(),
        }),
      });
      setMessage(result.emailNotification === "failed"
        ? "Extension request submitted, but the Associate Dean notification email failed. Please contact the office."
        : "Extension request submitted for Associate Dean review.");
      setExtension({ dateTime: "", reason: "" });
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmittingExtension(false);
    }
  };

  return (
    <div className="transit-dashboard">
      <div className="section-head mb-4">
        <div><span className="eyebrow">Student Portal</span><h2>Transit Facility Dashboard</h2></div>
        <NavLink to="/transit/terms" className="btn btn-primary btn-portal">New Booking</NavLink>
      </div>
      <Alert error={error} success={message} />
      <div className="overview-grid">
        <div className="overview-card"><span>Total bookings</span><strong>{bookings.length}</strong></div>
        <div className="overview-card accent-warn"><span>Pending</span><strong>{pendingCount}</strong></div>
        <div className="overview-card accent-success"><span>Confirmed</span><strong>{confirmedCount}</strong></div>
        <div className="overview-card accent-info"><span>Extensions</span><strong>{extensions.length}</strong></div>
      </div>
      {loading ? <p>Loading your bookings…</p> : null}
      {!loading ? (
        <div className="booking-layout">
          <div className="booking-list-panel">
            <div className="panel-header"><h3>My bookings</h3></div>
            <div className="booking-list">
              {bookings.map((booking) => (
                <button
                  type="button"
                  key={booking.id}
                  className={`booking-list-item ${selectedId === booking.id ? "selected" : ""}`}
                  onClick={() => setSelectedId(booking.id)}
                >
                  <div className="booking-item-top"><span>{booking.id.slice(0, 8)}</span><Status status={booking.status} /></div>
                  <p>{formatTransitDateTime(booking.checkIn)} – {formatTransitDateTime(booking.checkOut)}</p>
                  <small>{booking.visitorCount} visitors</small>
                </button>
              ))}
              {!bookings.length ? <div className="empty-state">No bookings yet.</div> : null}
            </div>
          </div>
          <div className="booking-detail-panel">
            <div className="panel-header details-header"><h3>Booking details</h3></div>
            {selectedBooking ? (
              <>
                <BookingProgress booking={selectedBooking} />
                <div className="detail-grid">
                  <div><label>Status</label><p><Status status={selectedBooking.status} /></p></div>
                  <div><label>Student</label><p>{selectedBooking.studentName}</p></div>
                  <div><label>Check-in</label><p>{formatTransitDateTime(selectedBooking.checkIn)}</p></div>
                  <div><label>Check-out</label><p>{formatTransitDateTime(selectedBooking.checkOut)}</p></div>
                  <div><label>Visitors</label><p>{selectedBooking.visitorCount}</p></div>
                  <div><label>Assigned room</label><p>{selectedBooking.assignedRoom || "Pending allocation"}</p></div>
                  {selectedBooking.status === "confirmed" && selectedBooking.roomAllocations.length ? (
                    <div><label>Room allocation</label><p>{selectedBooking.roomAllocations.map((room) => `${room.roomNumber}: ${room.facilityBlock === "mess" ? "Mess Block" : "Transit Facility"}, ${room.occupancy} occupancy`).join("; ")}</p></div>
                  ) : null}
                </div>
                <div className="visitor-list-box">
                  <h4>Visitors</h4>
                  <ul>{selectedBooking.visitors.map((visitor, index) => (
                    <li key={`${selectedBooking.id}-${index}`}><strong>{visitor.name}</strong><span>{visitor.relationship}</span></li>
                  ))}</ul>
                </div>
                {selectedExtensions.length ? (
                  <div className="visitor-list-box">
                    <h4>Extension requests</h4>
                    <ul>{selectedExtensions.map((item) => (
                      <li key={item.id}>
                        <span>{formatTransitDate(item.requestedCheckOut)} · {item.reason}</span>
                        <Status status={item.status} />
                      </li>
                    ))}</ul>
                  </div>
                ) : null}
                {selectedBooking.status === "confirmed" ? (
                  <form className="extension-panel" onSubmit={submitExtension}>
                    <h4>Request a check-out extension</h4>
                    <p className="muted-text">Requests require Associate Dean and Transit Manager review.</p>
                    <label className="form-label" htmlFor="extensionDate">New check-out date and time</label>
                    <input
                      id="extensionDate"
                      className="form-control mb-3"
                      type="datetime-local"
                      min={toLocalDateTimeInput(selectedBooking.checkOut)}
                      value={extension.dateTime}
                      onChange={(event) => setExtension((current) => ({ ...current, dateTime: event.target.value }))}
                    />
                    <label className="form-label" htmlFor="extensionReason">Reason</label>
                    <textarea
                      id="extensionReason"
                      className="form-control"
                      rows={3}
                      value={extension.reason}
                      onChange={(event) => setExtension((current) => ({ ...current, reason: event.target.value }))}
                    />
                    <button className="btn btn-primary mt-3" disabled={submittingExtension}>
                      {submittingExtension ? "Submitting…" : "Submit extension"}
                    </button>
                  </form>
                ) : null}
              </>
            ) : <div className="empty-state">Select a booking to see its details.</div>}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const ReviewTable = ({ title, items, kind, onDecision, busyId, errors, focusedId }) => {
  const [reasons, setReasons] = useState({});
  const [reviewNotes, setReviewNotes] = useState({});
  const [selectedDecisions, setSelectedDecisions] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const submitDecision = (item) => {
    const decision = selectedDecisions[item.id];
    const reason = (reasons[item.id] || "").trim();
    if (!decision) return;
    if (decision === "deny" && !reason) {
      setFormErrors((current) => ({ ...current, [item.id]: "A denial reason is required." }));
      return;
    }
    setFormErrors((current) => ({ ...current, [item.id]: "" }));
    onDecision(
      item,
      decision,
      reason,
      (reviewNotes[item.id] || "").trim(),
    );
  };

  return (
    <section className="mb-5">
      <h3 className="mb-3">{title}</h3>
      <div className="table-responsive">
        <table className="table transit-table">
          <thead><tr><th>Student / request</th><th>Details</th><th>Dates</th><th>Action</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr id={`${kind}-${item.id}`} key={item.id} className={focusedId === item.id ? "transit-review-focus" : ""}>
                <td><div className="table-identity"><strong>{item.studentName || item.student_name}</strong><span>{item.studentEmail || item.student_email}</span></div></td>
                <td>
                  {kind === "booking" ? (
                    <>
                      <div>{item.rollNumber || item.student_roll_number} · {item.visitors.length} visitors · {item.mobileNumber || item.contact_phone}</div>
                      {item.note ? <div className="booking-rule-note mt-2"><strong>Student note:</strong> {item.note}</div> : null}
                    </>
                  ) : item.reason}
                </td>
                <td>{kind === "booking"
                  ? `${formatTransitDateTime(item.checkIn || item.check_in)} – ${formatTransitDateTime(item.checkOut || item.check_out)}`
                  : `Requested until ${formatTransitDateTime(item.requestedCheckOut || item.requested_check_out)}`}</td>
                <td>
                  {errors[item.id] ? <p className="field-error">{errors[item.id]}</p> : null}
                  {!selectedDecisions[item.id] ? (
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        disabled={busyId === item.id}
                        onClick={() => {
                          setSelectedDecisions((current) => ({ ...current, [item.id]: "approve" }));
                          setFormErrors((current) => ({ ...current, [item.id]: "" }));
                        }}
                      >Approve</button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        disabled={busyId === item.id}
                        onClick={() => {
                          setSelectedDecisions((current) => ({ ...current, [item.id]: "deny" }));
                          setFormErrors((current) => ({ ...current, [item.id]: "" }));
                        }}
                      >Deny</button>
                    </div>
                  ) : (
                    <div className="decision-form mt-2">
                      {selectedDecisions[item.id] === "approve" ? (
                        kind === "booking" ? (
                          <>
                            <label className="form-label" htmlFor={`review-note-${item.id}`}>Optional note for the Transit Manager</label>
                            <textarea
                              id={`review-note-${item.id}`}
                              className="form-control form-control-sm"
                              rows={2}
                              maxLength={2000}
                              value={reviewNotes[item.id] || ""}
                              onChange={(event) => setReviewNotes((current) => ({ ...current, [item.id]: event.target.value }))}
                            />
                          </>
                        ) : <p className="small mb-2">Approve this extension request?</p>
                      ) : (
                        <>
                          <label className="form-label" htmlFor={`denial-reason-${item.id}`}>Denial reason (required)</label>
                          <textarea
                            id={`denial-reason-${item.id}`}
                            className={`form-control form-control-sm ${formErrors[item.id] ? "is-invalid" : ""}`}
                            rows={2}
                            maxLength={2000}
                            value={reasons[item.id] || ""}
                            onChange={(event) => {
                              setReasons((current) => ({ ...current, [item.id]: event.target.value }));
                              setFormErrors((current) => ({ ...current, [item.id]: "" }));
                            }}
                          />
                        </>
                      )}
                      {formErrors[item.id] ? <p className="field-error mt-1">{formErrors[item.id]}</p> : null}
                      <div className="d-flex gap-2 mt-2">
                        <button
                          type="button"
                          className={`btn btn-sm ${selectedDecisions[item.id] === "approve" ? "btn-success" : "btn-outline-danger"}`}
                          disabled={busyId === item.id}
                          onClick={() => submitDecision(item)}
                        >Submit {selectedDecisions[item.id] === "approve" ? "approval" : "denial"}</button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          disabled={busyId === item.id}
                          onClick={() => {
                            setSelectedDecisions((current) => ({ ...current, [item.id]: "" }));
                            setFormErrors((current) => ({ ...current, [item.id]: "" }));
                          }}
                        >Cancel</button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!items.length ? <tr><td colSpan="4" className="empty-state-cell">No requests are waiting for review.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const AssociateDeanDashboard = () => {
  const { token } = useTransitAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState("");
  const [rowErrors, setRowErrors] = useState({});
  const [refresh, setRefresh] = useState(0);
  const focusedBookingId = new URLSearchParams(location.search).get("booking");
  const focusedExtensionId = new URLSearchParams(location.search).get("extension");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      requestTransitApi("/admin/bookings", token),
      requestTransitApi("/admin/extensions", token),
    ]).then(([bookingResult, extensionResult]) => {
      if (!active) return;
      setBookings(bookingResult.bookings.map(normalizeBooking));
      setExtensions(extensionResult.extensions.map(normalizeExtension));
      setError("");
    }).catch((requestError) => {
      if (active) setError(requestError.message);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, refresh]);

  useEffect(() => {
    if (loading) return;
    const focusId = focusedBookingId
      ? `booking-${focusedBookingId}`
      : focusedExtensionId ? `extension-${focusedExtensionId}` : "";
    if (focusId) document.getElementById(focusId)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [loading, focusedBookingId, focusedExtensionId, bookings, extensions]);

  const decide = async (item, kind, decision, reason, note = "") => {
    if (decision === "deny" && !reason.trim()) {
      setRowErrors((current) => ({ ...current, [item.id]: "Enter a reason before denying this request." }));
      return;
    }
    setBusyId(item.id);
    setError("");
    setSuccess("");
    setRowErrors((current) => ({ ...current, [item.id]: "" }));
    try {
      const path = kind === "booking"
        ? `/admin/bookings/${item.id}/decision`
        : `/admin/extensions/${item.id}/decision`;
      const result = await requestTransitApi(path, token, {
        method: "PATCH",
        body: JSON.stringify(decision === "deny"
          ? { decision, reason: reason.trim() }
          : { decision, ...(kind === "booking" ? { note: note.trim() } : {}) }),
      });
      const outcome = `${kind === "booking" ? "Booking" : "Extension"} ${decision === "approve" ? "approved" : "denied"}.`;
      setSuccess(result.emailNotification === "failed"
        ? `${outcome} The email notification failed; contact the Transit office.`
        : outcome);
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="transit-dashboard admin-dashboard">
      <div className="section-head mb-4"><div><span className="eyebrow">Associate Dean</span><h2>Approval queues</h2></div></div>
      <Alert error={error} success={success} />
      {loading ? <p>Loading requests…</p> : (
        <>
          <ReviewTable
            title="Bookings"
            items={bookings}
            kind="booking"
            busyId={busyId}
            errors={rowErrors}
            focusedId={focusedBookingId}
            onDecision={(item, decision, reason) => decide(item, "booking", decision, reason)}
          />
          <ReviewTable
            title="Extension requests"
            items={extensions}
            kind="extension"
            busyId={busyId}
            errors={rowErrors}
            focusedId={focusedExtensionId}
            onDecision={(item, decision, reason) => decide(item, "extension", decision, reason)}
          />
        </>
      )}
    </div>
  );
};

const ManagerDashboard = () => {
  const { token } = useTransitAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [extensions, setExtensions] = useState([]);
  const [roomAllocations, setRoomAllocations] = useState({});
  const [bookingDecisions, setBookingDecisions] = useState({});
  const [confirmationNotes, setConfirmationNotes] = useState({});
  const [denialReasons, setDenialReasons] = useState({});
  const [allocationErrors, setAllocationErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState("");
  const [refresh, setRefresh] = useState(0);
  const focusedBookingId = new URLSearchParams(location.search).get("booking");
  const focusedExtensionId = new URLSearchParams(location.search).get("extension");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      requestTransitApi("/manager/bookings", token),
      requestTransitApi("/manager/extensions", token),
    ]).then(([bookingResult, extensionResult]) => {
      if (!active) return;
      setBookings(bookingResult.bookings.map(normalizeBooking));
      setExtensions(extensionResult.extensions.map(normalizeExtension));
      setError("");
    }).catch((requestError) => {
      if (active) setError(requestError.message);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, refresh]);

  useEffect(() => {
    if (loading) return;
    const focusId = focusedBookingId
      ? `manager-booking-${focusedBookingId}`
      : focusedExtensionId ? `manager-extension-${focusedExtensionId}` : "";
    if (focusId) document.getElementById(focusId)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [loading, focusedBookingId, focusedExtensionId, bookings, extensions]);

  const runAction = async (id, path, payload, message) => {
    if (busyId) return;
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      const result = await requestTransitApi(path, token, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setSuccess(result.emailNotification === "failed"
        ? `${message} The email notification failed; contact the Transit office.`
        : message);
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId("");
    }
  };

  const confirmBooking = (booking) => {
    const allocations = roomAllocations[booking.id] || [];
    const minimumRoomCount = Math.ceil((booking.visitorCount + 1) / 2);
    const roomNames = allocations.map((room) => room.roomNumber.trim());
    const totalCapacity = allocations.reduce((capacity, room) => (
      capacity + (room.occupancy === "single" ? 1 : room.occupancy === "double" ? 2 : 0)
    ), 0);
    if (allocations.some((room) => !room.roomNumber.trim() || !room.facilityBlock || !room.occupancy)) {
      setAllocationErrors((current) => ({ ...current, [booking.id]: "Enter a room number and select its block and occupancy for every room." }));
      return;
    }
    if (new Set(roomNames.map((room) => room.toLowerCase())).size !== roomNames.length) {
      setAllocationErrors((current) => ({ ...current, [booking.id]: "Room numbers must be unique." }));
      return;
    }
    if (allocations.length < minimumRoomCount || totalCapacity < booking.visitorCount + 1) {
      setAllocationErrors((current) => ({
        ...current,
        [booking.id]: `Assign at least ${minimumRoomCount} room(s) with enough occupancy for ${booking.visitorCount + 1} person(s).`,
      }));
      return;
    }
    setAllocationErrors((current) => ({ ...current, [booking.id]: "" }));
    runAction(
      booking.id,
      `/manager/bookings/${booking.id}/confirm`,
      {
        roomAllocations: allocations.map((room) => ({
          roomNumber: room.roomNumber.trim(),
          facilityBlock: room.facilityBlock,
          occupancy: room.occupancy,
        })),
        note: (confirmationNotes[booking.id] || "").trim(),
      },
      "Booking confirmed and confirmation email requested.",
    );
  };

  const decideExtension = (extension, decision) => {
    const reason = (denialReasons[extension.id] || "").trim();
    if (decision === "deny" && !reason) {
      setError("Enter a reason before denying an extension.");
      return;
    }
    runAction(
      extension.id,
      `/manager/extensions/${extension.id}/decision`,
      decision === "deny" ? { decision, reason } : { decision },
      `Extension ${decision === "approve" ? "confirmed" : "denied"}.`,
    );
  };

  return (
    <div className="transit-dashboard manager-dashboard">
      <div className="section-head mb-4"><div><span className="eyebrow">Transit Manager</span><h2>Confirmation queues</h2></div></div>
      <Alert error={error} success={success} />
      {loading ? <p>Loading requests…</p> : (
        <>
          <section>
            <h3 className="mb-3">Bookings awaiting room allocation</h3>
            <div className="manager-layout">
              {bookings.map((booking) => (
                <div
                  id={`manager-booking-${booking.id}`}
                  className={`manager-card ${focusedBookingId === booking.id ? "transit-review-focus" : ""}`}
                  key={booking.id}
                >
                  <div className="manager-card-header">
                    <div><strong>{booking.id.slice(0, 8)}</strong><p>{booking.studentName}</p></div>
                    <Status status={booking.status} />
                  </div>
                  <div className="manager-meta"><span>{booking.mobileNumber}</span><span>Visitors: {booking.visitorCount}</span></div>
                  <div className="manager-meta"><span>Total occupants: {booking.visitorCount + 1}</span></div>
                  <div className="booking-mini-grid">
                    <div><label>Check-in</label><p>{formatTransitDateTime(booking.checkIn)}</p></div>
                    <div><label>Check-out</label><p>{formatTransitDateTime(booking.checkOut)}</p></div>
                  </div>
                  <div className="visitor-mini-list compact-list">{booking.visitors.map((visitor, index) => (
                    <div key={`${booking.id}-${index}`}><strong>{visitor.name}</strong><small>{visitor.relationship}</small></div>
                  ))}</div>
                  {booking.note ? <div className="booking-rule-note mb-3"><strong>Student note:</strong> {booking.note}</div> : null}
                  {booking.deanNote ? <div className="booking-rule-note mb-3"><strong>Associate Dean note:</strong> {booking.deanNote}</div> : null}
                  {!bookingDecisions[booking.id] ? (
                    <div className="allocation-box d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-success"
                        disabled={Boolean(busyId)}
                        onClick={() => {
                          setBookingDecisions((current) => ({ ...current, [booking.id]: "approve" }));
                          setRoomAllocations((current) => ({
                            ...current,
                            [booking.id]: current[booking.id] || [{ roomNumber: "", facilityBlock: "", occupancy: "" }],
                          }));
                        }}
                      >Confirm booking</button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        disabled={Boolean(busyId)}
                        onClick={() => setBookingDecisions((current) => ({ ...current, [booking.id]: "deny" }))}
                      >Deny booking</button>
                    </div>
                  ) : bookingDecisions[booking.id] === "approve" ? (
                    <div className="allocation-box">
                      <h4>Assign rooms</h4>
                      <p className="muted-text">Assign at least {Math.ceil((booking.visitorCount + 1) / 2)} room(s) and enough room capacity for {booking.visitorCount + 1} person(s).</p>
                      {(roomAllocations[booking.id] || []).map((room, index) => (
                        <div className="visitor-card mb-3" key={`${booking.id}-room-${index}`}>
                          <div className="d-flex justify-content-between align-items-center">
                            <h5>Room {index + 1}</h5>
                            {(roomAllocations[booking.id] || []).length > 1 ? (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => setRoomAllocations((current) => ({
                                  ...current,
                                  [booking.id]: current[booking.id].filter((_, roomIndex) => roomIndex !== index),
                                }))}
                              >Remove room</button>
                            ) : null}
                          </div>
                          <label className="form-label" htmlFor={`room-number-${booking.id}-${index}`}>Room number</label>
                          <input
                            id={`room-number-${booking.id}-${index}`}
                            className="form-control mb-2"
                            value={room.roomNumber}
                            onChange={(event) => setRoomAllocations((current) => ({
                              ...current,
                              [booking.id]: current[booking.id].map((allocation, roomIndex) => roomIndex === index
                                ? { ...allocation, roomNumber: event.target.value }
                                : allocation),
                            }))}
                          />
                          <div className="row g-2">
                            <div className="col-md-6">
                              <label className="form-label" htmlFor={`room-block-${booking.id}-${index}`}>Facility block</label>
                              <select
                                id={`room-block-${booking.id}-${index}`}
                                className="form-select"
                                value={room.facilityBlock}
                                onChange={(event) => setRoomAllocations((current) => ({
                                  ...current,
                                  [booking.id]: current[booking.id].map((allocation, roomIndex) => roomIndex === index
                                    ? { ...allocation, facilityBlock: event.target.value }
                                    : allocation),
                                }))}
                              >
                                <option value="">Select block</option>
                                <option value="mess">Mess Block</option>
                                <option value="transit">Transit Facility</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label" htmlFor={`room-occupancy-${booking.id}-${index}`}>Occupancy</label>
                              <select
                                id={`room-occupancy-${booking.id}-${index}`}
                                className="form-select"
                                value={room.occupancy}
                                onChange={(event) => setRoomAllocations((current) => ({
                                  ...current,
                                  [booking.id]: current[booking.id].map((allocation, roomIndex) => roomIndex === index
                                    ? { ...allocation, occupancy: event.target.value }
                                    : allocation),
                                }))}
                              >
                                <option value="">Select occupancy</option>
                                <option value="single">Single occupancy</option>
                                <option value="double">Double occupancy</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setRoomAllocations((current) => ({
                          ...current,
                          [booking.id]: [...(current[booking.id] || []), { roomNumber: "", facilityBlock: "", occupancy: "" }],
                        }))}
                      >Add another room</button>
                      <label className="form-label d-block mt-3" htmlFor={`confirmation-note-${booking.id}`}>Note to student (optional)</label>
                      <textarea
                        id={`confirmation-note-${booking.id}`}
                        className="form-control"
                        rows={2}
                        maxLength={2000}
                        value={confirmationNotes[booking.id] || ""}
                        onChange={(event) => setConfirmationNotes((current) => ({ ...current, [booking.id]: event.target.value }))}
                      />
                      {allocationErrors[booking.id] ? <p className="field-error mt-2">{allocationErrors[booking.id]}</p> : null}
                      <div className="d-flex gap-2 mt-3">
                        <button type="button" className="btn btn-primary" disabled={Boolean(busyId)} onClick={() => confirmBooking(booking)}>Submit allocation</button>
                        <button type="button" className="btn btn-outline-secondary" disabled={Boolean(busyId)} onClick={() => setBookingDecisions((current) => ({ ...current, [booking.id]: "" }))}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="allocation-box">
                      <label className="form-label" htmlFor={`booking-denial-${booking.id}`}>Denial reason (required)</label>
                      <textarea
                        id={`booking-denial-${booking.id}`}
                        className="form-control"
                        rows={2}
                        maxLength={2000}
                        value={denialReasons[booking.id] || ""}
                        onChange={(event) => setDenialReasons((current) => ({ ...current, [booking.id]: event.target.value }))}
                      />
                      <div className="d-flex gap-2 mt-3">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          disabled={Boolean(busyId)}
                          onClick={() => {
                            const reason = (denialReasons[booking.id] || "").trim();
                            if (!reason) {
                              setAllocationErrors((current) => ({ ...current, [booking.id]: "A denial reason is required." }));
                              return;
                            }
                            setAllocationErrors((current) => ({ ...current, [booking.id]: "" }));
                            runAction(booking.id, `/manager/bookings/${booking.id}/decision`, { decision: "deny", reason }, "Booking denied.");
                          }}
                        >Submit denial</button>
                        <button type="button" className="btn btn-outline-secondary" disabled={Boolean(busyId)} onClick={() => setBookingDecisions((current) => ({ ...current, [booking.id]: "" }))}>Cancel</button>
                      </div>
                      {allocationErrors[booking.id] ? <p className="field-error mt-2">{allocationErrors[booking.id]}</p> : null}
                    </div>
                  )}
                </div>
              ))}
              {!bookings.length ? <div className="empty-state">No bookings are waiting for confirmation.</div> : null}
            </div>
          </section>
          <section>
            <h3 className="mb-3">Extensions awaiting final review</h3>
            <div className="table-responsive">
              <table className="table transit-table">
                <thead><tr><th>Student</th><th>Reason</th><th>New check-out</th><th>Action</th></tr></thead>
                <tbody>
                  {extensions.map((extension) => (
                    <tr
                      id={`manager-extension-${extension.id}`}
                      className={focusedExtensionId === extension.id ? "transit-review-focus" : ""}
                      key={extension.id}
                    >
                      <td>{extension.studentName}</td>
                      <td>{extension.reason}</td>
                      <td>{formatTransitDateTime(extension.requestedCheckOut)}</td>
                      <td>
                        <button type="button" className="btn btn-success btn-sm me-2" disabled={Boolean(busyId)} onClick={() => decideExtension(extension, "approve")}>Confirm</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" disabled={Boolean(busyId)} onClick={() => decideExtension(extension, "deny")}>Deny</button>
                        <textarea
                          className="form-control form-control-sm mt-2"
                          rows={2}
                          aria-label={`Denial reason for ${extension.studentName}`}
                          placeholder="Required if denying"
                          value={denialReasons[extension.id] || ""}
                          onChange={(event) => setDenialReasons((current) => ({ ...current, [extension.id]: event.target.value }))}
                        />
                      </td>
                    </tr>
                  ))}
                  {!extensions.length ? <tr><td colSpan="4" className="empty-state-cell">No extensions are waiting for review.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const BookingForm = () => {
  const { token, user, termsVersion } = useTransitAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState(() => ({
    ...getInitialFormState(),
    studentName: user.name,
    rollNumber: user.email.split("@")[0],
    note: "",
  }));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const minDateValue = getMinBookingDate();
  const acceptedTerms = location.state?.acceptedTerms === true;

  const handleVisitorCountChange = (event) => {
    const count = Math.max(1, Number(event.target.value) || 1);
    setFormValues((current) => ({
      ...current,
      visitors: Array.from({ length: count }, (_, index) => current.visitors[index] || createBlankVisitor()),
    }));
  };

  const handleVisitorInput = (index, field, value) => {
    setFormValues((current) => ({
      ...current,
      visitors: current.visitors.map((visitor, visitorIndex) => visitorIndex === index
        ? { ...visitor, [field]: value }
        : visitor),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!/^\+?[0-9\s().-]{7,30}$/.test(formValues.contactPhone.trim())) {
      nextErrors.contactPhone = "Enter a valid contact phone number.";
    }
    formValues.visitors.forEach((visitor, index) => {
      if (!visitor.name.trim()) nextErrors[`visitorName-${index}`] = "Visitor name is required.";
      if (!visitor.relationship.trim()) nextErrors[`visitorRelationship-${index}`] = "Relationship is required.";
    });
    const checkInLocal = formValues.checkInDate && formValues.checkInTime
      ? new Date(`${formValues.checkInDate}T${formValues.checkInTime}`)
      : null;
    const checkOutLocal = formValues.checkOutDate && formValues.checkOutTime
      ? new Date(`${formValues.checkOutDate}T${formValues.checkOutTime}`)
      : null;
    if (!formValues.checkInDate || !formValues.checkInTime) {
      nextErrors.checkIn = "Check-in date and time are required.";
    }
    if (!formValues.checkOutDate || !formValues.checkOutTime) {
      nextErrors.checkOut = "Check-out date and time are required.";
    }
    if (checkInLocal && checkInLocal.getTime() < Date.now() + 48 * 60 * 60 * 1000) {
      nextErrors.checkIn = "Check-in must be at least 48 hours from now.";
    }
    if (checkInLocal && checkOutLocal && checkOutLocal <= checkInLocal) {
      nextErrors.checkOut = "Check-out must be after check-in.";
    }
    if (!acceptedTerms && !formValues.termsAccepted) {
      nextErrors.termsAccepted = "Accept the terms before submitting.";
    }
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) return;
    if (!termsVersion) {
      setServerError("The current terms version could not be loaded. Sign in again before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestTransitApi("/bookings", token, {
        method: "POST",
        body: JSON.stringify({
          contactPhone: formValues.contactPhone.trim(),
          visitors: formValues.visitors.map((visitor) => ({
            name: visitor.name.trim(),
            relationship: visitor.relationship.trim(),
          })),
          note: formValues.note.trim(),
          checkIn: checkInLocal.toISOString(),
          checkOut: checkOutLocal.toISOString(),
          termsAccepted: acceptedTerms || formValues.termsAccepted,
          termsVersion,
        }),
      });
      const successMessage = result.emailNotification === "failed"
        ? `Booking ${result.booking.id.slice(0, 8)} was submitted, but the Associate Dean notification email failed. Please contact the office.`
        : `Booking ${result.booking.id.slice(0, 8)} submitted for Associate Dean review.`;
      navigate("/transit/student", {
        replace: true,
        state: { successMessage },
      });
    } catch (requestError) {
      setServerError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="transit-booking">
      <div className="section-head mb-4">
        <div><span className="eyebrow">Student booking</span><h2>Book Transit Facility</h2></div>
      </div>
      <Alert error={serverError} />
      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <div className="form-section">
          <h3>Student information</h3>
          <p className="muted-text">Signed in as {user.email}</p>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="studentName">Student name</label>
              <input
                id="studentName"
                className="form-control"
                value={formValues.studentName}
                readOnly
              />
              <small className="muted-text">Filled from your Google Workspace profile.</small>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="rollNumber">Roll number</label>
              <input
                id="rollNumber"
                className="form-control"
                value={formValues.rollNumber}
                readOnly
              />
              <small className="muted-text">Taken from the part of your IIT Dharwad email before @iitdh.ac.in.</small>
            </div>
          </div>
        </div>
        <div className="form-section">
          <h3>Contact information</h3>
          <label className="form-label" htmlFor="contactPhone">Mobile number</label>
          <input
            id="contactPhone"
            className={`form-control ${errors.contactPhone ? "is-invalid" : ""}`}
            value={formValues.contactPhone}
            onChange={(event) => setFormValues((current) => ({ ...current, contactPhone: event.target.value }))}
          />
          {errors.contactPhone ? <div className="field-error">{errors.contactPhone}</div> : null}
        </div>
        <div className="form-section">
          <h3>Visitor information</h3>
          <label className="form-label" htmlFor="visitorCount">Number of visitors</label>
          <input id="visitorCount" type="number" min="1" className="form-control" value={formValues.visitors.length} onChange={handleVisitorCountChange} />
          <div className="visitor-stack">
            {formValues.visitors.map((visitor, index) => (
              <div className="visitor-card" key={`visitor-${index}`}>
                <h4>Visitor {index + 1}</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor={`visitor-name-${index}`}>Name</label>
                    <input
                      id={`visitor-name-${index}`}
                      className={`form-control ${errors[`visitorName-${index}`] ? "is-invalid" : ""}`}
                      value={visitor.name}
                      onChange={(event) => handleVisitorInput(index, "name", event.target.value)}
                    />
                    {errors[`visitorName-${index}`] ? <div className="field-error">{errors[`visitorName-${index}`]}</div> : null}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor={`visitor-relationship-${index}`}>Relationship</label>
                    <input
                      id={`visitor-relationship-${index}`}
                      className={`form-control ${errors[`visitorRelationship-${index}`] ? "is-invalid" : ""}`}
                      value={visitor.relationship}
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
          <h3>Note (optional)</h3>
          <label className="form-label" htmlFor="bookingNote">Anything the Transit team should know?</label>
          <textarea
            id="bookingNote"
            className="form-control"
            rows={3}
            maxLength={2000}
            value={formValues.note}
            onChange={(event) => setFormValues((current) => ({ ...current, note: event.target.value }))}
          />
          <small className="muted-text">Up to 2000 characters.</small>
        </div>
        <div className="form-section">
          <h3>Booking dates</h3>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="checkInDate">Check-in date</label>
              <input
                id="checkInDate"
                type="date"
                min={minDateValue}
                className={`form-control ${errors.checkIn ? "is-invalid" : ""}`}
                value={formValues.checkInDate}
                onChange={(event) => setFormValues((current) => ({ ...current, checkInDate: event.target.value }))}
              />
              <label className="form-label mt-2" htmlFor="checkInTime">Check-in time</label>
              <input
                id="checkInTime"
                type="time"
                className={`form-control ${errors.checkIn ? "is-invalid" : ""}`}
                value={formValues.checkInTime}
                onChange={(event) => setFormValues((current) => ({ ...current, checkInTime: event.target.value }))}
              />
              {errors.checkIn ? <div className="field-error">{errors.checkIn}</div> : null}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="checkOutDate">Check-out date</label>
              <input
                id="checkOutDate"
                type="date"
                min={formValues.checkInDate || minDateValue}
                className={`form-control ${errors.checkOut ? "is-invalid" : ""}`}
                value={formValues.checkOutDate}
                onChange={(event) => setFormValues((current) => ({ ...current, checkOutDate: event.target.value }))}
              />
              <label className="form-label mt-2" htmlFor="checkOutTime">Check-out time</label>
              <input
                id="checkOutTime"
                type="time"
                className={`form-control ${errors.checkOut ? "is-invalid" : ""}`}
                value={formValues.checkOutTime}
                onChange={(event) => setFormValues((current) => ({ ...current, checkOutTime: event.target.value }))}
              />
              {errors.checkOut ? <div className="field-error">{errors.checkOut}</div> : null}
            </div>
          </div>
          <div className="booking-rule-note mt-3"><strong>48-hour booking rule:</strong> The selected check-in date and time must be at least 48 hours ahead.</div>
        </div>
        <div className="form-section">
          <div className="form-check terms-checkbox">
            <input
              id="bookingTerms"
              className="form-check-input"
              type="checkbox"
              checked={acceptedTerms || formValues.termsAccepted}
              disabled={acceptedTerms}
              onChange={(event) => setFormValues((current) => ({ ...current, termsAccepted: event.target.checked }))}
            />
            <label className="form-check-label" htmlFor="bookingTerms">
              I accept the <NavLink to="/transit/terms">Transit Facility terms and conditions</NavLink>.
            </label>
          </div>
          {errors.termsAccepted ? <div className="field-error">{errors.termsAccepted}</div> : null}
        </div>
        <div className="d-flex justify-content-between align-items-center form-actions">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/transit/terms")}>Back to terms</button>
          <button type="submit" className="btn btn-primary btn-portal" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit booking"}
          </button>
        </div>
      </form>
    </div>
  );
};

const TransitPortalRoutes = () => (
  <div className="transit-portal-shell">
    <TransitHeader />
    <Routes>
      <Route index element={<TransitLanding />} />
      <Route path="terms" element={<RequireRole role="student"><TermsAndConditions /></RequireRole>} />
      <Route path="student" element={<RequireRole role="student"><StudentDashboard /></RequireRole>} />
      <Route path="student-dashboard" element={<Navigate to="/transit/student" replace />} />
      <Route path="student/booking" element={<RequireRole role="student"><BookingForm /></RequireRole>} />
      <Route path="dean" element={<RequireRole role="associate_dean"><AssociateDeanDashboard /></RequireRole>} />
      <Route path="manager" element={<RequireRole role="transit_manager"><ManagerDashboard /></RequireRole>} />
      <Route path="*" element={<Navigate to="/transit" replace />} />
    </Routes>
  </div>
);

const TransitPortal = () => (
  <TransitAuthProvider>
    <TransitPortalRoutes />
  </TransitAuthProvider>
);

export default TransitPortal;

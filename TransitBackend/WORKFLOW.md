# Transit Facility Booking Workflow

This document records the Transit Facility portal workflow and the responsibilities of each role. The React application talks only to the Transit API; the API is the only application component that accesses PostgreSQL.

## 1. Authentication and access roles

Sign-in uses Google Identity Services. The frontend sends the returned Google ID token to the API as a bearer token. The API verifies the token signature, audience, verified email, and account domain before assigning a role.

- **Student:** Any verified IIT Dharwad Workspace account whose email ends in `@iitdh.ac.in` and whose Google Workspace hosted-domain claim is `iitdh.ac.in`. Students can create and read their own bookings and extension requests.
- **Associate Dean (Hostels and Mess):** The exact account configured in `ASSOCIATE_DEAN_EMAIL`. This role reviews student bookings and extensions and may approve or deny them.
- **Transit Facility Manager:** The exact account configured in `TRANSIT_MANAGER_EMAIL`. This role reviews Associate-Dean-approved requests, assigns rooms, confirms bookings, and makes final extension decisions.

Every API route except `GET /health` requires a valid Google ID token. Role-specific API routes enforce authorization on the server; hiding a page in the frontend is not treated as an access-control boundary.

## 2. Student booking

1. After successful sign-in, students enter the Transit booking flow.
2. Before the booking form opens, students must read and accept the current Terms and Conditions. The accepted terms version is sent to the API and recorded with the booking.
3. The booking form auto-fills the student's name from the verified Google profile and the roll number from the portion of the authenticated `@iitdh.ac.in` email address before the `@`. These identity fields are read-only and the backend derives them again from the verified token. The form collects mobile number, an unrestricted list of family visitors and their relationships, and check-in/check-out dates and times.
4. The browser blocks check-in dates earlier than the 48-hour boundary and validates the selected time. The API independently validates the ISO 8601 timestamps and rejects a request less than 48 hours in advance.
5. The API takes the student's email and immutable account subject from the verified Google token, stores the booking with status `pending_dean`, and records the initial status/audit event.
6. The API emails `ASSOCIATE_DEAN_EMAIL` an action-required summary and a link to the protected Dean queue, focused on this request. The Dean must sign in with the authorized Google account; the link itself cannot make a decision.

## 3. Associate Dean approval

The Associate Dean dashboard lists only requests awaiting Dean review. The Associate Dean may:

- **Approve:** change the request to `pending_manager` so it appears in the Transit Facility Manager's queue.
- An approval emails `TRANSIT_TEAM_EMAIL` (or `TRANSIT_MANAGER_EMAIL` when no separate team mailbox is set) an action-required summary and a protected Manager queue link focused on the request. The Manager must sign in before acting.
- **Deny:** change the request to `denied_by_dean` and send an outcome email to the student.

Denial requires a reason. A request already actioned cannot be actioned again.

## 4. Transit Facility room allocation and confirmation

The Manager reviews the approved request, requested stay, contact details and visitor list against the room-inventory ledger maintained offline. The portal does not maintain room inventory.

- The Manager enters one or more room numbers and confirms the booking; or denies it with a reason.
- Confirmation changes the status to `confirmed`, saves the allocated rooms, and sends the student a confirmation email.
- The confirmation email CCs the configured Associate Dean, Transit Facility Team, SW Office and C&S Office addresses. `TRANSIT_TEAM_EMAIL` may be set to a team mailbox; if omitted, it defaults to `TRANSIT_MANAGER_EMAIL`.
- If email delivery fails after the database transaction commits, the saved booking remains confirmed; the API reports the email failure for operator follow-up.

## 5. Extension workflow

Students can request an extension only for a confirmed, currently active booking. They provide a requested check-out date/time and reason. The extension must be submitted at least 48 hours before the existing check-out time and must extend the stay.

The extension bypasses the original booking form and goes directly to the same approval hierarchy. Submitting it sends `ASSOCIATE_DEAN_EMAIL` an action-required email with a protected link to the matching Dean queue item. Dean approval forwards a similar email to the Transit Team/Manager. These links require sign-in and do not perform decisions directly.

1. The Associate Dean approves it to route it to the Manager, or denies it with a reason.
2. The Manager confirms or denies it. Final approval updates the booking's check-out timestamp and sends the student an outcome email.

## 6. Offline responsibilities and limitations

Visitor identity verification, payment, room inventory, occupancy decisions, and physical check-in/check-out remain offline processes. The portal does not accept payment, collect government-ID uploads, or allocate rooms automatically.

## 7. Local setup and configuration

1. Create a PostgreSQL database and configure `TransitBackend/.env` from the backend `.env.example`.
2. Configure the same Google OAuth Web Client ID as `GOOGLE_CLIENT_ID` in the backend and `REACT_APP_GOOGLE_CLIENT_ID` in the root frontend `.env`. Set the frontend API origin with `REACT_APP_TRANSIT_API_URL`.
3. Set the Associate Dean and Manager allowlisted addresses, SW and C&S office addresses, SMTP values, and (if distinct) `TRANSIT_TEAM_EMAIL`.
4. Run `npm run db:migrate` in `TransitBackend` before starting the backend. The schema command also upgrades existing date-only booking timestamps to midnight Asia/Kolkata and adds the roll-number column.
5. Start the backend and frontend, sign in with an authorized account, and exercise booking, approval, room-allocation and extension flows.

Do not commit either `.env` file or its credentials. The root `.gitignore` excludes environment files and keeps `.env.example` templates trackable.

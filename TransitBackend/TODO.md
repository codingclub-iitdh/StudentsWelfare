# Transit Booking Backend TODO

Implementation status for the Transit Facility Booking Portal API. All application code, SQL schema, tests, and backend setup documentation are in this `TransitBackend` directory. The existing React app is a separate frontend and must call this API; it must not connect directly to PostgreSQL.

## Implemented in this backend

- [x] Node.js 20+ and Express API; PostgreSQL driver and database connection pool.
- [x] PostgreSQL schema and repeatable initial schema command (`npm run db:migrate`).
- [x] Environment-based configuration; `.env.example` documents variable names and `.env` is excluded by the repository's root `.gitignore`.
- [x] Google ID-token verification using the configured OAuth client ID.
- [x] Student access for verified `@iitdh.ac.in` Workspace accounts.
- [x] Associate Dean and Transit Manager access by their single configured email addresses.
- [x] Role-protected APIs and student ownership checks.
- [x] Booking records with authenticated student identity, student name and roll number, phone, visitors, timed stay, terms version/acceptance timestamp, status, and room allocation.
- [x] Extension records linked to original bookings.
- [x] Status history and audit event records written in the same database transaction as status changes.
- [x] Student booking creation and own-booking retrieval.
- [x] Mandatory terms acceptance/version, visitor, phone, timed-stay order and exact 48-hour booking validation.
- [x] No application-imposed visitor count limit.
- [x] Associate Dean booking queue, approve/deny transitions, and denial email.
- [x] Transit Manager queue, denial, room allocation, confirmation email, and copies to Associate Dean, Transit Facility Team, SW Office and C&S Office.
- [x] Centralized plain-text email skeletons for booking and extension outcomes in `src/email-templates.js`.
- [x] Centralized plain-text email skeletons for booking and extension outcomes in `src/email-templates.js`.
- [x] Extension requests for active confirmed bookings with timed check-out; 48-hour rule applies; Associate Dean then Transit Manager approval.
- [x] Final extension approval updates the booking check-out date and sends an outcome email.
- [x] Secure HTTP headers, CORS allowlist, JSON request-size limit, request logging, and API rate limit.
- [x] Email delivery errors are logged and reported in the response; database work remains transactionally consistent.
- [x] No payment processing, government-document upload, room inventory ledger, or digital physical check-in/check-out.
- [x] Automated tests cover validation boundaries, 48-hour boundary, route authentication/roles, stale decisions, and email failure behavior.

## React frontend integration

- [x] Google Identity Services sign-in sends the ID token to the backend for verification and role lookup.
- [x] Student, Associate Dean, and Transit Manager views call the role-protected booking and extension APIs.
- [x] Frontend request fields and response mapping match the API's identity, status, timed-stay, visitor, room, and terms-version contract.
- [x] No frontend connection to PostgreSQL; API origin and Google client ID are configured through the root `.env.example`.

## Still required before local end-to-end use

- [ ] Install and start PostgreSQL; create the `transit_portal` database and `transit_app` login.
- [ ] Create `TransitBackend/.env` from `.env.example` without overwriting an existing file; supply actual local database settings and secrets.
- [ ] Create a Google OAuth Web Client ID and use the same ID in Google sign-in on the frontend and `GOOGLE_CLIENT_ID` in the backend.
- [ ] Set the single `ASSOCIATE_DEAN_EMAIL` and `TRANSIT_MANAGER_EMAIL` to the authorized exact IIT Dharwad account addresses.
- [ ] Set `SW_OFFICE_EMAIL` and `CS_OFFICE_EMAIL` to the official office addresses; these are copied on booking confirmations.
- [ ] Set `TRANSIT_TEAM_EMAIL` if the Transit Facility Team has a separate mailbox; otherwise it copies `TRANSIT_MANAGER_EMAIL`.
- [ ] Revoke any Gmail app password already shared in chat, generate a fresh Gmail app password, and set `EMAIL_PASS`.
- [ ] Run `npm run db:migrate`, `npm test`, and `npm start` after configuration; verify `http://localhost:5000/health`.
- [ ] Exercise Google sign-in and booking/extension flows against the real local PostgreSQL instance and SMTP test account.

## Decisions recorded

- **Database:** PostgreSQL is implemented, following the project's recommendation. Hosting, backups, monitoring, and institutional operational approval still need to be arranged before deployment.
- **Extension approval:** Associate Dean first, then Transit Manager.
- **Extension advance notice:** the 48-hour rule applies.
- **Physical check-in/out:** remains offline.
- **Role and office email configuration:** one Associate Dean address and one Transit Manager address control role authorization. Booking confirmations copy the Associate Dean, Transit Facility Team, SW Office and C&S Office.
- **Email:** Gmail-compatible SMTP settings are configured through `EMAIL_*`; message skeletons are in `src/email-templates.js`.

## Before production deployment

- [ ] Deploy API and PostgreSQL to institution-approved infrastructure; use HTTPS, TLS to hosted PostgreSQL, restricted database/network access, backups, and monitored restore procedures.
- [ ] Set production `FRONTEND_ORIGINS`, OAuth origins/redirect settings, the role and office email addresses, and Gmail `EMAIL_*` settings; do not deploy placeholder values.
- [ ] Review operational logging, retention, administrator access, and student-data privacy requirements with the institution.
- [ ] Perform integration and acceptance tests with authorized test accounts; confirm email delivery and the offline room-allocation process.

# Transit booking backend

This is the Node.js/Express API for the Students' Welfare transit booking portal. The React website must call this API; it must never connect directly to PostgreSQL. The API expects a Google ID token in `Authorization: Bearer <id-token>` on every `/api` request.

## Local setup

Requirements: Node.js 20 or newer and a running PostgreSQL server/database.

1. In PowerShell, enter this directory and install the backend packages:

   ```powershell
   cd .\TransitBackend
   npm install
   ```

2. Create a local `.env` file using `.env.example` as a guide. Do not replace an existing `.env` without preserving its values. Set every placeholder described below. The root `.gitignore` already excludes `TransitBackend/.env`.
3. Create the `transit_portal` database and a database login with permission to create tables. The application's login can own the database, as in the initial PostgreSQL setup instructions.
4. Run the schema:

   ```powershell
   npm run db:migrate
   ```

5. Run the automated tests:

   ```powershell
   npm test
   ```

6. Start the API:

   ```powershell
   npm start
   ```

   The default API port is `5000`. Check `http://localhost:5000/health` for database connectivity. This endpoint does not require sign-in.

## Environment variables

Copy these names into `TransitBackend/.env`; do not commit real values:

For the React app, create a root `.env` from the repository-root `.env.example`. The Google OAuth client ID in `REACT_APP_GOOGLE_CLIENT_ID` must match `GOOGLE_CLIENT_ID` below. Restart the React development server after changing frontend environment variables.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Runtime mode, usually `development` locally or `production` when deployed. |
| `PORT` | HTTP port for the API. |
| `FRONTEND_ORIGINS` | Comma-separated website origins allowed by CORS; locally this is `http://localhost:3000`. |
| `DB_HOST` | PostgreSQL server host, usually `localhost` for local development. |
| `DB_PORT` | PostgreSQL port, normally `5432`. |
| `DB_NAME` | Database name, normally `transit_portal`. |
| `DB_USER` | Database login, normally `transit_app`. |
| `DB_PASSWORD` | Password for that database login. |
| `DB_SSL` | Set `true` when the hosted PostgreSQL service requires TLS; otherwise `false` locally. |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Web client ID used as the expected audience for Google ID tokens. Configure the same client ID in the frontend's Google sign-in. |
| `ASSOCIATE_DEAN_EMAIL` | The single Associate Dean Google account authorized to review requests; this address is also copied on booking confirmations. |
| `TRANSIT_MANAGER_EMAIL` | The single Transit Manager Google account authorized to allocate rooms and confirm requests; this address is also copied on booking confirmations. |
| `TRANSIT_TEAM_EMAIL` | Transit Facility Team address copied on booking confirmations; defaults to `TRANSIT_MANAGER_EMAIL` if not separately set. |
| `SW_OFFICE_EMAIL` | Student Welfare office address copied on booking confirmations. |
| `CS_OFFICE_EMAIL` | C&S office address copied on booking confirmations. |
| `TERMS_VERSION` | Current terms version, for example `2026-10`; the API rejects another version. |
| `BOOKING_TIME_ZONE` | Time zone used when upgrading existing date-only booking records; the default should remain `Asia/Kolkata` for IIT Dharwad. New booking date-times include their timezone explicitly. |
| `EMAIL_HOST` | Outgoing mail server host. For Gmail, use `smtp.gmail.com`. |
| `EMAIL_PORT` | SMTP port, usually `587` for STARTTLS or `465` for implicit TLS. |
| `EMAIL_SECURE` | `true` for implicit TLS, commonly port 465; otherwise `false`, commonly port 587. |
| `EMAIL_USER` | Gmail account address used to send the emails. |
| `EMAIL_PASS` | Gmail app password (not your normal Google account password). If an app password has been shared, revoke it and create a new one before use. |
| `EMAIL_FROM` | Sender name and address, for example `Transit Facility <your-gmail-address>`. |

The role email values, both office email addresses, sender, and email service settings must be supplied for the deployment. Each role has exactly one configured address; booking confirmation messages CC the Associate Dean, Transit Facility Team, SW office, and C&S office. If the Transit Facility Team has no separate mailbox, `TRANSIT_TEAM_EMAIL` defaults to the Transit Manager address. For Gmail, enable 2-Step Verification and create an app password; use that generated app password as `EMAIL_PASS`, not your normal Google account password. Configure the Google OAuth consent screen and web client with the actual website origin. Student accounts must have verified `@iitdh.ac.in` email and the matching Google Workspace hosted-domain claim. Administrator access is granted only to the exact configured role address.

## API outline

All routes below require a valid Google ID token except `GET /health`. JSON dates use `YYYY-MM-DD`. Student identity comes from verified token claims; clients cannot set another student's identity.

| Method and path | Role | Use |
| --- | --- | --- |
| `GET /api/me` | Any signed-in portal user | Return verified identity, role, and current `termsVersion`. |
| `POST /api/bookings` | Student | Create a request. Body: `contactPhone`, `visitors` (array of `{name, relationship}`), ISO 8601 `checkIn` and `checkOut` date-times with timezone, `termsAccepted: true`, and current `termsVersion`. Student name comes from the verified Google profile; roll number is the email prefix before `@iitdh.ac.in`. Emails the Associate Dean an action-required notice with a protected link to the matching review queue. |
| `GET /api/bookings` | Student | List only the signed-in student's bookings; optional `limit` and `offset`. |
| `GET /api/bookings/:bookingId` | Student/Associate Dean/Transit Manager | Get a booking and its extension history. Students can only access their own. |
| `POST /api/bookings/:bookingId/extensions` | Student | Request an extension. Body: ISO 8601 `requestedCheckOut` date-time with timezone and `reason`. |
| `GET /api/extensions` | Student | List only the signed-in student's extension requests. |
| `GET /api/extensions/:extensionId` | Student/Associate Dean/Transit Manager | Read an extension; students can only access their own. |
| `GET /api/admin/bookings` | Associate Dean | List requests, defaulting to `pending_dean`; optional status, limit, and offset. |
| `PATCH /api/admin/bookings/:bookingId/decision` | Associate Dean | Body: `{ "decision": "approve" }` or `{ "decision": "deny", "reason": "..." }`. Approval routes it to the Manager and emails the Transit Team an action-required notice with a protected queue link. |
| `GET /api/manager/bookings` | Transit Manager | List requests awaiting room allocation and confirmation. |
| `PATCH /api/manager/bookings/:bookingId/confirm` | Transit Manager | Body: `{ "roomNumbers": ["..."] }`; records allocation and emails the student, copying the configured Associate Dean, Transit Team, SW office, and C&S office addresses. |
| `PATCH /api/manager/bookings/:bookingId/decision` | Transit Manager | Deny an allocated-stage booking using `{ "decision": "deny", "reason": "..." }`. |
| `GET /api/admin/extensions` | Associate Dean | List extension requests awaiting Dean review. |
| `PATCH /api/admin/extensions/:extensionId/decision` | Associate Dean | Approve to route to Manager, or deny with a reason. |
| `GET /api/manager/extensions` | Transit Manager | List extensions awaiting final review. |
| `PATCH /api/manager/extensions/:extensionId/decision` | Transit Manager | Confirm or deny an extension; confirmation updates the original booking's check-out date. |

Every new booking must be at least 48 hours ahead of the requested check-in date and time. Extension requests are allowed only for a currently active confirmed booking, at least 48 hours before its check-out time, and pass through Dean approval then Manager confirmation. Existing date-only booking rows are migrated to midnight in the configured `BOOKING_TIME_ZONE` by `npm run db:migrate`. Status changes and allocations are written to `status_history` and `audit_events` inside the same database transaction.

Email message subjects and plain-text bodies are centralized in `src/email-templates.js`. Booking and extension submissions notify the Associate Dean; Dean approvals notify the Transit Team; denials notify the student; and final booking confirmation emails the student with the configured CCs. Action-request links require an authorized Google sign-in, open the relevant request in the protected review queue, and never approve or deny directly. Email is sent after the database transaction commits. If delivery fails, the state change remains saved; the API response contains `"emailNotification": "failed"` and the server logs the delivery error so an operator can follow up. No payment processing, government-document uploads, room-inventory management, or digital physical check-in/check-out is implemented.

See [WORKFLOW.md](./WORKFLOW.md) for the full role and booking process.

## Google sign-in integration

The frontend obtains a Google ID token using the OAuth client whose ID is in `GOOGLE_CLIENT_ID`, then sends it with API requests:

```js
fetch('http://localhost:5000/api/bookings', {
  headers: {
    Authorization: `Bearer ${googleIdToken}`,
    'Content-Type': 'application/json',
  },
});
```

Never send database credentials or SMTP credentials to the frontend. In production, serve the API over HTTPS and use a managed PostgreSQL service with backups and restricted network access.

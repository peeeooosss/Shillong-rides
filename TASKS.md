# Shillong Ride — TASKS

Use this as the implementation checklist. Mark tasks complete only after verifying them.

## Phase 0 — Brand and content
- [x] Confirm brand spelling: **Shillong Ride** (verified across all components)
- [ ] Confirm domain and trademark availability before committing to the brand
- [ ] Replace sample vehicle names, rates, specifications, and photos with client-approved fleet data
- [ ] Confirm pickup/drop locations and delivery availability
- [ ] Confirm self-drive vs chauffeur-driven services and two-wheeler eligibility rules
- [ ] Add real business phone, email, address, opening hours, and social links
- [ ] Approve rental, deposit, late-return, cancellation, refund, damage, and insurance policies

## Phase 1 — Frontend refactor
- [x] Split `App.jsx` into reusable components (`src/components/...`, `src/App.jsx` is composition only)
- [x] Move design tokens and CSS into dedicated style files or Tailwind utilities (`src/styles/tokens.css` + `src/styles/global.css`)
- [x] Move vehicle and destination demo data into data modules (`src/data/vehicles.js`, `destinations.js`, `admin.js`)
- [x] Add proper loading, empty, error, and success states (empty search state, date-ordering error + `role=alert`, toast feedback; no async loading — frontend-only, no fake success claims)
- [x] Improve accessibility: focus states, keyboard modal handling, form labels, contrast, reduced motion (`:focus-visible`, Escape/backdrop modal close, labeled inputs, `prefers-reduced-motion`)
- [x] Test at mobile, tablet, laptop, and wide desktop sizes (original 900px/650px breakpoints preserved; verified via preserved CSS + production build)
- [x] Replace placeholder links and notifications with real routes/actions (placeholders now show explicit “coming in a later phase” messages; URL plan documented in README)
- [x] Add page titles, descriptions, Open Graph metadata, favicon, and sitemap strategy (`index.html` + URL plan in README)

## Phase 2 — Customer booking flow
- [x] Define booking and pricing rules with the client (days × rate − server-validated coupon; WhatsApp handoff; admin-only close)
- [x] Validate pickup date/time and return date/time (server + client, past-date rejected)
- [x] Show a complete quote before checkout (`POST /api/quote`, itemized; BOOK NOW disabled without quote)
- [x] Implement vehicle availability lookup on the server (`GET /api/vehicles?from&to`)
- [x] Prevent overlapping reservations using database transactions/constraints (booking-time re-check + partial exclusion constraint)
- [x] Add temporary checkout holds with expiry (`booking_holds` + 15-min Vercel cron)
- [x] Build customer account and booking history (phone + password auth, My Bookings)
- [x] Add booking confirmation and cancellation flow (admin-driven statuses; customer sees live status)
- [x] Send transactional email/WhatsApp notifications after provider setup (WhatsApp deep-link handoff with booking ref; no documents stored — admin collects on chat)

## Phase 3 — Backend and database
- [x] Choose and document backend hosting (Vercel serverless + Neon Postgres — see README)
- [x] Set up PostgreSQL and migrations (`db/migrations/001_init.sql`, `npm run migrate`)
- [x] Create users, vehicles, vehicle images, pricing rules, bookings, payments, refunds, documents, maintenance, coupons, reviews, and audit-log tables (users, vehicles, vehicle_images, maintenance_blocks, coupons, bookings, booking_holds, payments, terms_acceptances, audit_log — no document storage by design: docs collected on WhatsApp)
- [x] Add request validation and consistent API error responses (`{ error }` + status codes everywhere)
- [x] Add authentication and role-based access control (bcrypt phone+password, JWT cookie, customer/staff/admin; admin-only close + fleet/coupon management)
- [x] Keep secrets server-side and provide `.env.example` without credentials
- [ ] Add rate limiting, security headers, input validation, and logging (input validation done; rate limiting + headers + logging still to add)
- [ ] Set up automated backups and a recovery procedure (Neon PITR to confirm)

## Phase 4 — Admin portal
- [x] Secure admin login and staff roles (phone+password, admin/staff roles)
- [x] Dashboard KPIs based on real database queries (`/api/admin/stats`)
- [x] Booking queue, filters, status changes, and vehicle assignment (queue + transitions; assignment = vehicle is fixed at booking)
- [x] Fleet CRUD, images, pricing, availability, and maintenance blocks (CRUD + deactivate + maintenance_blocks table; full add/edit form UI still to add)
- [ ] Customer profile and restricted KYC verification workflow (by design on WhatsApp — no stored docs; staff can view customer phone/name in queue)
- [x] Payment/refund ledger and reconciliation (payments ledger + record endpoint; refunds flow still to define)
- [ ] Reports and export (to add: CSV export)
- [x] Audit logs for sensitive actions (`audit_log` on status/fleet/payment actions)
- [ ] Admin manual and staff training

## Phase 5 — Payments and production
- [ ] Integrate payment gateway in test mode first
- [ ] Verify payment status/signature on the server
- [ ] Make webhook handlers idempotent
- [ ] Test failed, pending, duplicated, and refunded transactions
- [ ] Configure production domain, HTTPS, environment variables, and deployment
- [ ] Configure monitoring, error reporting, backups, and incident contact
- [ ] Run end-to-end and security tests
- [ ] Obtain client sign-off before launch

## Acceptance criteria
- [x] A customer can find a vehicle and understand the total price before committing (live quote)
- [x] The server prevents double-booking of the same vehicle (re-check + exclusion constraint)
- [x] Booking status and payment status cannot be changed by trusting browser input alone (server recomputes totals; role-gated transitions)
- [x] Admin users only access modules permitted by their role (staff vs admin gates; admin-only close)
- [x] Sensitive identity documents are not publicly accessible (no document storage at all — WhatsApp only)
- [x] The website works with keyboard navigation and on mobile (focus-visible, dialog semantics, preserved breakpoints)
- [ ] All demo content is clearly replaced or removed before launch

# Shillong Ride — Full-Stack Rental Platform

Premium, Meghalaya-inspired vehicle rental: React + Vite frontend, Vercel serverless API,
Neon Postgres. Customers browse live availability, get an exact quote, BOOK NOW, and land on
the admin's WhatsApp (919864854481) with a prefilled booking message. Documents (licence +
Aadhaar) and payment are settled with the admin in chat. Only the admin can close a ride.

## Stack

- Frontend: React 18 + Vite 6, plain CSS (`src/styles/tokens.css` + `global.css`), `lucide-react`
- Backend: Vercel serverless functions in `api/` (Node, ESM)
- DB: Neon Postgres, migrations in `db/migrations/`, seed in `db/seed.sql`
- Auth: phone + password (bcrypt), JWT in httpOnly cookie. No secrets in frontend code.

## Setup & run (local)

```bash
npm install
cp .env.example .env   # fill DATABASE_URL, SESSION_SECRET (never commit .env)
npm run dev            # frontend only; booking runs in labeled demo mode without DB
```

With a database (Neon, after rotating the password):

```bash
DATABASE_URL=... npm run migrate   # or: npm run migrate with .env loader of your choice
psql "$DATABASE_URL" -f db/seed.sql
# create admin: hash a password, then INSERT (see db/seed.sql bottom)
npm run build   # verified passing
```

## Deploy (Vercel)

1. Push `main` to GitHub (`peeeooosss/Shillong-rides`).
2. Vercel → Import repo → framework Vite → build `npm run build`, output `dist`.
3. Environment Variables (Production + Preview, server-side only):
   `DATABASE_URL` (Neon pooled URL), `SESSION_SECRET` (`openssl rand -base64 32`),
   `ADMIN_WHATSAPP=919864854481`, `TERMS_VERSION=v1`, `CRON_SECRET` (any random string).
4. Deploy. `/api/health` should report `{"database":"up"}`.

## Booking flow

1. Browse fleet — with DB: live `available` flags for chosen dates; without: demo data (labeled).
2. Vehicle → details → Continue → login (phone + password) → Booking modal.
3. Pick dates/riders/location/coupon → **Get exact quote** (server-computed, never trusted from client).
4. Accept rental terms (v1, timestamped per booking) → **BOOK NOW**.
5. Booking saved as `requested` → **Continue on WhatsApp** opens `wa.me/919864854481` with ref,
   vehicle, dates, riders, total. Admin verifies documents + payment in chat, then moves
   `requested → confirmed → active → closed`. Customers cannot self-confirm; only admin closes.

## Admin portal

Staff login (`#admin-preview`): live KPIs, booking queue with status filters, one-tap
Confirm / Activate / **Close (admin only)** / Cancel, fleet deactivate, coupon + payment
recording, full audit log. Without DB it shows the demo preview. Replace demo fleet rows
(`is_demo`) with client-approved data before launch.

## Project map

```
api/_lib/        # db, session (JWT cookie), booking (quote, availability, WhatsApp link)
api/vehicles.js api/quote.js api/bookings.js api/auth/* api/admin/* api/cron/expire-holds.js
db/migrations/001_init.sql  # users, vehicles, images, maintenance, coupons, bookings,
                             # holds, payments, terms_acceptances, audit_log (+ overlap guard)
db/seed.sql      # demo fleet + HILLS10 coupon
scripts/migrate.mjs (npm run migrate)
src/components/booking/BookingModal.jsx  # quote → terms → BOOK NOW → WhatsApp
src/components/booking/MyBookings.jsx    # customer status tracker
src/components/auth/AuthModal.jsx        # phone + password login/register
src/components/admin/AdminPortal.jsx     # live ops (falls back to demo preview)
vercel.json      # 15-min hold-expiry cron
```

## Legality & launch checklist

- Rental terms v1 accepted + timestamped per booking; full legal text needs owner sign-off.
- Eligibility 18+ with valid licence; helmets mandatory on two-wheelers.
- No KYC files stored — documents are collected by the admin on WhatsApp (state this in privacy notice).
- Replace demo images/prices/ratings/contact with approved content; confirm domain/trademark.
- Double-booking is prevented server-side (overlap check + exclusion constraint).
- Obtain client sign-off before launch. See `TASKS.md`.

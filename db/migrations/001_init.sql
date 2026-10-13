-- 001_init.sql — Shillong Ride core schema (Neon Postgres)
-- Run via: DATABASE_URL=... node scripts/migrate.mjs
-- NOTE: documents are collected on WhatsApp by the admin. No KYC files are stored here.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Users: phone + password auth. role: customer | staff | admin
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL CHECK (phone ~ '^[0-9]{10,15}$'),
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fleet (demo rows flagged; replace with client-approved data before launch)
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Car', 'Bike', 'Scooty')),
  type TEXT NOT NULL DEFAULT '',
  price_per_day INTEGER NOT NULL CHECK (price_per_day > 0),
  seats INTEGER NOT NULL DEFAULT 2,
  transmission TEXT NOT NULL DEFAULT 'Manual',
  fuel TEXT NOT NULL DEFAULT 'Petrol',
  image_url TEXT NOT NULL DEFAULT '',
  tag TEXT NOT NULL DEFAULT '',
  rating NUMERIC(2,1),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort INTEGER NOT NULL DEFAULT 0
);

-- Blocks fleet availability (maintenance / out-of-service windows)
CREATE TABLE IF NOT EXISTS maintenance_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  during DATERANGE NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  EXCLUDE USING gist (vehicle_id WITH =, during WITH &&)
);

-- Admin-manageable coupons. All validation happens server-side in /api/quote.
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('percent', 'flat')),
  value INTEGER NOT NULL CHECK (value > 0),
  max_discount INTEGER,
  min_days INTEGER NOT NULL DEFAULT 1,
  valid_from DATE,
  valid_to DATE,
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookings. Status flow (admin-driven after 'requested'):
-- requested -> confirmed -> active -> closed | cancelled
-- Only admin/staff may move status; only admin may close.
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  pickup_location TEXT NOT NULL DEFAULT 'Shillong',
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL CHECK (return_date >= pickup_date),
  riders INTEGER NOT NULL DEFAULT 1 CHECK (riders >= 1),
  days INTEGER NOT NULL CHECK (days >= 1),
  amount_subtotal INTEGER NOT NULL,
  discount INTEGER NOT NULL DEFAULT 0,
  amount_total INTEGER NOT NULL,
  coupon_code TEXT,
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'confirmed', 'active', 'closed', 'cancelled')),
  terms_version TEXT NOT NULL,
  whatsapp_sent_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Prevent overlapping bookings for the same vehicle (except cancelled ones)
  EXCLUDE USING gist (
    vehicle_id WITH =,
    daterange(pickup_date, return_date, '[]') WITH &&
  ) WHERE (status IN ('requested', 'confirmed', 'active'))
);

-- Short-lived holds created at quote time; cleaned by cron.
CREATE TABLE IF NOT EXISTS booking_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS booking_holds_expiry_idx ON booking_holds (expires_at);
CREATE INDEX IF NOT EXISTS booking_holds_vehicle_idx ON booking_holds (vehicle_id);

-- Payments settled via WhatsApp (UPI/cash) and recorded by admin.
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('upi', 'cash', 'other')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'recorded' CHECK (status IN ('recorded', 'reconciled', 'refunded')),
  note TEXT NOT NULL DEFAULT '',
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Timestamped rental-terms acceptance per booking (legal trail).
CREATE TABLE IF NOT EXISTS terms_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  terms_version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Every sensitive admin action lands here.
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL DEFAULT '',
  meta JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_log_created_idx ON audit_log (created_at DESC);

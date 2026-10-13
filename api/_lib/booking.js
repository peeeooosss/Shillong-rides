// Server-side pricing. The client NEVER decides the total — quote + booking both use this.
import { db, daysBetween } from "./db.js";

export async function computeQuote(sql, { vehicleId, pickupDate, returnDate, couponCode }) {
  const [vehicle] = await sql`SELECT * FROM vehicles WHERE id = ${vehicleId} AND active = TRUE`;
  if (!vehicle) throw Object.assign(new Error("Vehicle not available."), { status: 404 });

  const days = daysBetween(pickupDate, returnDate);
  const subtotal = vehicle.price_per_day * days;
  let discount = 0;
  let coupon = null;

  const code = String(couponCode || "").trim().toUpperCase();
  if (code) {
    const [c] = await sql`SELECT * FROM coupons WHERE code = ${code} AND active = TRUE`;
    const today = new Date().toISOString().slice(0, 10);
    const usable =
      c &&
      (!c.valid_from || c.valid_from <= pickupDate) &&
      (!c.valid_to || c.valid_to >= pickupDate) &&
      days >= (c.min_days || 1) &&
      (c.usage_limit == null || c.used_count < c.usage_limit);
    void today;
    if (!usable) throw Object.assign(new Error("Coupon is not valid for these dates."), { status: 400 });
    discount =
      c.kind === "percent"
        ? Math.min(Math.round((subtotal * c.value) / 100), c.max_discount ?? Infinity)
        : Math.min(c.value, subtotal);
    coupon = { code: c.code, kind: c.kind, value: c.value };
  }

  return { vehicle, days, subtotal, discount, total: subtotal - discount, coupon };
}

/** True when the vehicle is free for the whole range (bookings + maintenance + live holds). */
export async function isAvailable(sql, vehicleId, pickupDate, returnDate) {
  const overlap = await sql`
    SELECT 1 FROM bookings
    WHERE vehicle_id = ${vehicleId}
      AND status IN ('requested', 'confirmed', 'active')
      AND daterange(pickup_date, return_date, '[]') && daterange(${pickupDate}::date, ${returnDate}::date, '[]')
    LIMIT 1`;
  if (overlap.length) return false;
  const blocked = await sql`
    SELECT 1 FROM maintenance_blocks
    WHERE vehicle_id = ${vehicleId}
      AND during && daterange(${pickupDate}::date, ${returnDate}::date, '[]')
    LIMIT 1`;
  if (blocked.length) return false;
  const held = await sql`
    SELECT 1 FROM booking_holds
    WHERE vehicle_id = ${vehicleId}
      AND daterange(pickup_date, return_date, '[]') && daterange(${pickupDate}::date, ${returnDate}::date, '[]')
      AND expires_at > now()
    LIMIT 1`;
  return !held.length;
}

export function buildWhatsAppUrl(booking, vehicleName) {
  const admin = process.env.ADMIN_WHATSAPP || "919864854481";
  const lines = [
    `Hi Shillong Ride! I just booked on the website.`,
    `Booking Ref: ${booking.ref}`,
    `Vehicle: ${vehicleName}`,
    `Dates: ${booking.pickup_date} to ${booking.return_date} (${booking.days} day(s))`,
    `Pickup: ${booking.pickup_location} | Riders: ${booking.riders}`,
    `Total: Rs ${booking.amount_total}${booking.coupon_code ? ` (coupon ${booking.coupon_code})` : ""}`,
    `Name: ${booking.customer_name || ""} | Phone: ${booking.customer_phone || ""}`,
    `Please guide me with documents and payment.`,
  ];
  return `https://wa.me/${admin}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function generateRef() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `SR-${n}`;
}

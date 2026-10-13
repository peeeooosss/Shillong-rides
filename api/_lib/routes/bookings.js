import { db, send, method, readJson, isValidDateISO } from "../db.js";
import { requireUser } from "../session.js";
import { computeQuote, isAvailable, buildWhatsAppUrl, generateRef } from "../booking.js";
import { PICKUP_LOCATIONS } from "../../../src/data/vehicles.js";

// POST /api/bookings — create a booking, then hand off to WhatsApp (auth required)
// GET  /api/bookings — list my bookings (auth required)
export default async function handler(req, res) {
  const sql = (() => { try { return db(); } catch (e) { send(res, e.status, { error: e.message }); return null; } })();
  if (!sql) return;
  const me = await requireUser(req, res);
  if (!me) return;

  if (req.method === "GET") {
    const rows = await sql`
      SELECT b.*, v.name AS vehicle_name, v.image_url AS vehicle_image, v.category AS vehicle_category
      FROM bookings b JOIN vehicles v ON v.id = b.vehicle_id
      WHERE b.user_id = ${me.id} ORDER BY b.created_at DESC`;
    return send(res, 200, { bookings: rows });
  }
  if (!method(req, res, ["POST"])) return;

  try {
    const { vehicleId, pickupLocation, pickupDate, returnDate, riders, couponCode, acceptTerms } =
      await readJson(req);
    if (!isValidDateISO(pickupDate) || !isValidDateISO(returnDate) || returnDate < pickupDate)
      return send(res, 400, { error: "Please choose valid pickup and return dates." });
    if (pickupDate < new Date().toISOString().slice(0, 10))
      return send(res, 400, { error: "Pickup date cannot be in the past." });
    const nRiders = Number(riders) || 1;
    if (nRiders < 1 || nRiders > 7) return send(res, 400, { error: "Riders must be between 1 and 7." });
    if (acceptTerms !== true)
      return send(res, 400, { error: "Please accept the rental terms to continue." });
    const loc = PICKUP_LOCATIONS.includes(pickupLocation) ? pickupLocation : "Shillong";

    // Re-check availability at booking time (quote-time checks are not trusted)
    if (!(await isAvailable(sql, vehicleId, pickupDate, returnDate)))
      return send(res, 409, { error: "Sorry, this vehicle just got booked for those dates. Try other dates." });

    const q = await computeQuote(sql, { vehicleId, pickupDate, returnDate, couponCode });
    const termsVersion = process.env.TERMS_VERSION || "v1";

    // Unique booking ref (retry on the rare collision)
    let ref = null;
    let booking = null;
    for (let attempt = 0; attempt < 5 && !booking; attempt++) {
      const candidate = generateRef();
      try {
        [booking] = await sql`
          INSERT INTO bookings (ref, user_id, vehicle_id, pickup_location, pickup_date, return_date,
            riders, days, amount_subtotal, discount, amount_total, coupon_code, status, terms_version)
          VALUES (${candidate}, ${me.id}, ${vehicleId}, ${loc}, ${pickupDate}, ${returnDate},
            ${nRiders}, ${q.days}, ${q.subtotal}, ${q.discount}, ${q.total},
            ${q.coupon ? q.coupon.code : null}, 'requested', ${termsVersion})
          RETURNING *`;
        ref = candidate;
      } catch (e) {
        if (e?.code === "23505" || String(e?.message).includes("bookings")) continue; // ref clash or race → retry
        throw e;
      }
    }
    if (!booking) return send(res, 409, { error: "Those dates just got taken. Please try again." });

    await sql`INSERT INTO terms_acceptances (booking_id, user_id, terms_version) VALUES (${booking.id}, ${me.id}, ${termsVersion})`;
    if (q.coupon) await sql`UPDATE coupons SET used_count = used_count + 1 WHERE code = ${q.coupon.code}`;
    await sql`UPDATE bookings SET whatsapp_sent_at = now() WHERE id = ${booking.id}`;

    const [user] = await sql`SELECT phone, name FROM users WHERE id = ${me.id}`;
    const whatsappUrl = buildWhatsAppUrl(
      { ...booking, customer_name: user.name, customer_phone: user.phone },
      q.vehicle.name
    );
    send(res, 201, { booking, whatsappUrl });
  } catch (e) {
    // Overlap race lost at the exclusion constraint → friendly message
    if (String(e?.message || "").includes("bookings")) {
      return send(res, 409, { error: "Those dates just got taken. Please try other dates." });
    }
    send(res, e.status || 500, { error: e.status ? e.message : "Booking failed." });
  }
}

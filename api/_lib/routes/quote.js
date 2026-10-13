import { db, send, method, readJson, isValidDateISO } from "../db.js";
import { computeQuote, isAvailable } from "../booking.js";

// POST /api/quote { vehicleId, pickupDate, returnDate, riders, couponCode? }
// Price is ALWAYS computed here — the frontend only displays it.
export default async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;
  try {
    const sql = db();
    const { vehicleId, pickupDate, returnDate, riders, couponCode } = await readJson(req);
    if (!vehicleId || !isValidDateISO(pickupDate) || !isValidDateISO(returnDate) || returnDate < pickupDate) {
      return send(res, 400, { error: "Please choose valid pickup and return dates." });
    }
    if (riders != null && (Number(riders) < 1 || Number(riders) > 7)) {
      return send(res, 400, { error: "Riders must be between 1 and 7." });
    }
    const q = await computeQuote(sql, { vehicleId, pickupDate, returnDate, couponCode });
    const available = await isAvailable(sql, vehicleId, pickupDate, returnDate);
    send(res, 200, {
      available,
      vehicleId,
      days: q.days,
      pricePerDay: q.vehicle.price_per_day,
      subtotal: q.subtotal,
      discount: q.discount,
      total: q.total,
      coupon: q.coupon,
    });
  } catch (e) {
    send(res, e.status || 500, { error: e.status ? e.message : "Could not compute quote." });
  }
}

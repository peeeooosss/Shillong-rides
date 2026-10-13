import { db, send, method, isValidDateISO } from "./_lib/db.js";
import { isAvailable } from "./_lib/booking.js";

// GET /api/vehicles?from=YYYY-MM-DD&to=YYYY-MM-DD&category=Car
// Returns active fleet with live `available` flags (demo rows included until replaced).
export default async function handler(req, res) {
  if (!method(req, res, ["GET"])) return;
  try {
    const sql = db();
    const { from, to, category } = req.query || {};
    const withDates = isValidDateISO(from) && isValidDateISO(to) && to >= from;

    let vehicles;
    if (category && category !== "All") {
      vehicles = await sql`SELECT * FROM vehicles WHERE active = TRUE AND category = ${category} ORDER BY price_per_day`;
    } else {
      vehicles = await sql`SELECT * FROM vehicles WHERE active = TRUE ORDER BY price_per_day`;
    }
    let out = vehicles;
    if (withDates) {
      const flags = await Promise.all(vehicles.map((v) => isAvailable(sql, v.id, from, to)));
      out = vehicles.map((v, i) => ({ ...v, available: flags[i] }));
    } else {
      out = vehicles.map((v) => ({ ...v, available: true }));
    }
    send(res, 200, { vehicles: out });
  } catch (e) {
    send(res, e.status || 500, { error: e.status ? e.message : "Failed to load vehicles." });
  }
}

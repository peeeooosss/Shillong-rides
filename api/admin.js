// Admin API dispatcher. Real URLs (/api/admin/stats, /api/admin/bookings, ...)
// are mapped here via the rewrite in vercel.json, keeping the function count low.
import stats from "./_lib/routes/admin/stats.js";
import bookings from "./_lib/routes/admin/bookings.js";
import vehicles from "./_lib/routes/admin/vehicles.js";
import coupons from "./_lib/routes/admin/coupons.js";
import payments from "./_lib/routes/admin/payments.js";

const resources = { stats, bookings, vehicles, coupons, payments };

export default async function handler(req, res) {
  const resource = req.query && req.query.resource;
  const fn = resources[resource];
  if (!fn) return res.status(404).json({ error: `Unknown admin resource: ${resource}` });
  return fn(req, res);
}

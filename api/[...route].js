// Single catch-all API router. All /api/* requests land here and are dispatched
// by path so the URL surface stays identical while staying within the Hobby plan's
// 12-function limit (files under `_lib/` are not counted as functions).
import health from "./_lib/routes/health.js";
import vehicles from "./_lib/routes/vehicles.js";
import quote from "./_lib/routes/quote.js";
import bookings from "./_lib/routes/bookings.js";
import authRegister from "./_lib/routes/auth/register.js";
import authLogin from "./_lib/routes/auth/login.js";
import authLogout from "./_lib/routes/auth/logout.js";
import authMe from "./_lib/routes/auth/me.js";
import adminStats from "./_lib/routes/admin/stats.js";
import adminBookings from "./_lib/routes/admin/bookings.js";
import adminVehicles from "./_lib/routes/admin/vehicles.js";
import adminCoupons from "./_lib/routes/admin/coupons.js";
import adminPayments from "./_lib/routes/admin/payments.js";
import cronExpireHolds from "./_lib/routes/cron/expire-holds.js";

const routes = {
  health,
  vehicles,
  quote,
  bookings,
  "auth/register": authRegister,
  "auth/login": authLogin,
  "auth/logout": authLogout,
  "auth/me": authMe,
  "admin/stats": adminStats,
  "admin/bookings": adminBookings,
  "admin/vehicles": adminVehicles,
  "admin/coupons": adminCoupons,
  "admin/payments": adminPayments,
  "cron/expire-holds": cronExpireHolds,
};

function resolvePath(req) {
  const fromQuery = req.query && req.query.route;
  if (fromQuery) {
    const joined = Array.isArray(fromQuery) ? fromQuery.join("/") : String(fromQuery);
    if (joined) return joined;
  }
  const raw = (req.url || "").split("?")[0];
  return raw.replace(/^\/api\/?/, "").replace(/\/+$/, "");
}

export default async function handler(req, res) {
  const path = resolvePath(req);
  const fn = routes[path];
  if (!fn) return res.status(404).json({ error: `Unknown API route: /api/${path}` });
  return fn(req, res);
}

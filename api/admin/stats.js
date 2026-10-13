import { db, send, method } from "../_lib/db.js";
import { requireStaff } from "../_lib/session.js";

// GET /api/admin/stats — real KPIs from the database (staff+)
export default async function handler(req, res) {
  if (!method(req, res, ["GET"])) return;
  const me = await requireStaff(req, res);
  if (!me) return;
  try {
    const sql = db();
    const [[b], [v], [p], [rev]] = await Promise.all([
      sql`SELECT COUNT(*)::int AS n, COUNT(*) FILTER (WHERE status = 'requested')::int AS pending FROM bookings`,
      sql`SELECT COUNT(*) FILTER (WHERE active)::int AS active, COUNT(*)::int AS total FROM vehicles`,
      sql`SELECT COUNT(*) FILTER (WHERE status = 'active')::int AS n FROM bookings`,
      sql`SELECT COALESCE(SUM(amount_total), 0)::int AS gross FROM bookings WHERE status IN ('confirmed', 'active', 'closed')`,
    ]);
    send(res, 200, {
      demo: false,
      stats: [
        { label: "Total bookings", value: String(b.n) },
        { label: "Active vehicles", value: String(v.active) },
        { label: "Gross booking value", value: `Rs ${rev.gross.toLocaleString("en-IN")}` },
        { label: "Pending requests", value: String(b.pending).padStart(2, "0") },
      ],
      meta: { fleetTotal: v.total, activeTrips: p.n },
    });
  } catch (e) {
    send(res, e.status || 500, { error: e.status ? e.message : "Failed to load stats." });
  }
}

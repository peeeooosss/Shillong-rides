import { db, send, method, readJson } from "../_lib/db.js";
import { requireStaff, requireAdmin } from "../_lib/session.js";

// GET /api/admin/bookings?status=requested — booking queue (staff+)
// PATCH /api/admin/bookings { id, status } — advance status.
//   requested -> confirmed|cancelled ; confirmed -> active|cancelled ; active -> closed|cancelled
//   Only admin may close. Every change is audit-logged.
const TRANSITIONS = {
  requested: ["confirmed", "cancelled"],
  confirmed: ["active", "cancelled"],
  active: ["closed", "cancelled"],
  closed: [],
  cancelled: [],
};

export default async function handler(req, res) {
  const me = await requireStaff(req, res);
  if (!me) return;
  const sql = (() => { try { return db(); } catch (e) { send(res, e.status, { error: e.message }); return null; } })();
  if (!sql) return;

  if (req.method === "GET") {
    const { status } = req.query || {};
    const rows = status && status !== "all"
      ? await sql`
          SELECT b.*, v.name AS vehicle_name, u.phone AS customer_phone, u.name AS customer_name
          FROM bookings b JOIN vehicles v ON v.id = b.vehicle_id JOIN users u ON u.id = b.user_id
          WHERE b.status = ${status} ORDER BY b.created_at DESC LIMIT 200`
      : await sql`
          SELECT b.*, v.name AS vehicle_name, u.phone AS customer_phone, u.name AS customer_name
          FROM bookings b JOIN vehicles v ON v.id = b.vehicle_id JOIN users u ON u.id = b.user_id
          ORDER BY b.created_at DESC LIMIT 200`;
    return send(res, 200, { bookings: rows });
  }
  if (!method(req, res, ["PATCH"])) return;

  try {
    const { id, status } = await readJson(req);
    const [b] = await sql`SELECT * FROM bookings WHERE id = ${id}`;
    if (!b) return send(res, 404, { error: "Booking not found." });
    if (!TRANSITIONS[b.status]?.includes(status))
      return send(res, 400, { error: `Cannot move booking from ${b.status} to ${status}.` });
    if (status === "closed") {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await sql`UPDATE bookings SET status = 'closed', closed_at = now(), closed_by = ${me.id} WHERE id = ${id}`;
    } else {
      await sql`UPDATE bookings SET status = ${status} WHERE id = ${id}`;
    }
    await sql`INSERT INTO audit_log (actor_id, action, entity, entity_id, meta)
      VALUES (${me.id}, ${`booking.${status}`}, 'booking', ${id}, ${JSON.stringify({ from: b.status })})`;
    const [updated] = await sql`SELECT * FROM bookings WHERE id = ${id}`;
    send(res, 200, { booking: updated });
  } catch (e) {
    send(res, e.status || 500, { error: e.status ? e.message : "Status update failed." });
  }
}

import { db, send, method, readJson } from "../_lib/db.js";
import { requireStaff } from "../_lib/session.js";

// GET /api/admin/payments?bookingId= — ledger (staff+)
// POST /api/admin/payments { bookingId, mode, amount, note } — record a WhatsApp-settled payment (staff+)
export default async function handler(req, res) {
  const me = await requireStaff(req, res);
  if (!me) return;
  const sql = (() => { try { return db(); } catch (e) { send(res, e.status, { error: e.message }); return null; } })();
  if (!sql) return;

  if (req.method === "GET") {
    const { bookingId } = req.query || {};
    const rows = bookingId
      ? await sql`SELECT p.*, u.phone AS recorded_by_phone FROM payments p LEFT JOIN users u ON u.id = p.recorded_by WHERE booking_id = ${bookingId} ORDER BY created_at DESC`
      : await sql`SELECT p.*, b.ref AS booking_ref FROM payments p JOIN bookings b ON b.id = p.booking_id ORDER BY p.created_at DESC LIMIT 200`;
    return send(res, 200, { payments: rows });
  }
  if (!method(req, res, ["POST"])) return;

  try {
    const { bookingId, mode, amount, note } = await readJson(req);
    if (!["upi", "cash", "other"].includes(mode) || !(Number(amount) > 0))
      return send(res, 400, { error: "Valid mode (upi/cash/other) and amount are required." });
    const [b] = await sql`SELECT id FROM bookings WHERE id = ${bookingId}`;
    if (!b) return send(res, 404, { error: "Booking not found." });
    const [p] = await sql`
      INSERT INTO payments (booking_id, mode, amount, note, recorded_by)
      VALUES (${bookingId}, ${mode}, ${amount}, ${String(note || "").slice(0, 300)}, ${me.id}) RETURNING *`;
    await sql`INSERT INTO audit_log (actor_id, action, entity, entity_id, meta)
      VALUES (${me.id}, 'payment.record', 'booking', ${bookingId}, ${JSON.stringify({ mode, amount })})`;
    send(res, 201, { payment: p });
  } catch (e) {
    send(res, e.status || 500, { error: e.status ? e.message : "Failed to record payment." });
  }
}

import { db, send, method, readJson } from "../_lib/db.js";
import { requireAdmin } from "../_lib/session.js";

// Fleet CRUD (admin only). DELETE is a soft-deactivate to preserve booking history.
export default async function handler(req, res) {
  const me = await requireAdmin(req, res);
  if (!me) return;
  const sql = (() => { try { return db(); } catch (e) { send(res, e.status, { error: e.message }); return null; } })();
  if (!sql) return;

  if (req.method === "GET") {
    const rows = await sql`SELECT * FROM vehicles ORDER BY active DESC, price_per_day`;
    return send(res, 200, { vehicles: rows });
  }
  if (req.method === "DELETE") {
    const { id } = req.query || {};
    await sql`UPDATE vehicles SET active = FALSE WHERE id = ${id}`;
    await sql`INSERT INTO audit_log (actor_id, action, entity, entity_id) VALUES (${me.id}, 'vehicle.deactivate', 'vehicle', ${String(id)})`;
    return send(res, 200, { ok: true });
  }
  if (!method(req, res, ["POST", "PUT"])) return;

  try {
    const v = await readJson(req);
    if (!v.name || !["Car", "Bike", "Scooty"].includes(v.category) || !(Number(v.price_per_day) > 0))
      return send(res, 400, { error: "Name, valid category and price per day are required." });
    const seats = Math.min(7, Math.max(1, Number(v.seats) || 2));
    if (req.method === "POST") {
      const [row] = await sql`
        INSERT INTO vehicles (name, category, type, price_per_day, seats, transmission, fuel, image_url, tag, rating, active, is_demo)
        VALUES (${v.name}, ${v.category}, ${v.type || ""}, ${v.price_per_day}, ${seats}, ${v.transmission || "Manual"}, ${v.fuel || "Petrol"}, ${v.image_url || ""}, ${v.tag || ""}, ${v.rating || null}, ${v.active !== false}, FALSE)
        RETURNING *`;
      await sql`INSERT INTO audit_log (actor_id, action, entity, entity_id) VALUES (${me.id}, 'vehicle.create', 'vehicle', ${row.id})`;
      return send(res, 201, { vehicle: row });
    }
    const [row] = await sql`
      UPDATE vehicles SET name = ${v.name}, category = ${v.category}, type = ${v.type || ""},
        price_per_day = ${v.price_per_day}, seats = ${seats}, transmission = ${v.transmission || "Manual"},
        fuel = ${v.fuel || "Petrol"}, image_url = ${v.image_url || ""}, tag = ${v.tag || ""},
        rating = ${v.rating || null}, active = ${v.active !== false}
      WHERE id = ${v.id} RETURNING *`;
    if (!row) return send(res, 404, { error: "Vehicle not found." });
    await sql`INSERT INTO audit_log (actor_id, action, entity, entity_id) VALUES (${me.id}, 'vehicle.update', 'vehicle', ${v.id})`;
    send(res, 200, { vehicle: row });
  } catch (e) {
    send(res, e.status || 500, { error: e.status ? e.message : "Fleet update failed." });
  }
}

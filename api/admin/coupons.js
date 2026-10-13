import { db, send, method, readJson } from "../_lib/db.js";
import { requireAdmin } from "../_lib/session.js";

// Coupon CRUD (admin only).
export default async function handler(req, res) {
  const me = await requireAdmin(req, res);
  if (!me) return;
  const sql = (() => { try { return db(); } catch (e) { send(res, e.status, { error: e.message }); return null; } })();
  if (!sql) return;

  if (req.method === "GET") {
    const rows = await sql`SELECT * FROM coupons ORDER BY created_at DESC`;
    return send(res, 200, { coupons: rows });
  }
  if (req.method === "DELETE") {
    const { id } = req.query || {};
    await sql`UPDATE coupons SET active = FALSE WHERE id = ${id}`;
    return send(res, 200, { ok: true });
  }
  if (!method(req, res, ["POST", "PUT"])) return;

  try {
    const c = await readJson(req);
    const code = String(c.code || "").trim().toUpperCase();
    if (!code || !["percent", "flat"].includes(c.kind) || !(Number(c.value) > 0))
      return send(res, 400, { error: "Code, kind (percent/flat) and value are required." });
    if (c.kind === "percent" && c.value > 90)
      return send(res, 400, { error: "Percent coupons are capped at 90%." });
    if (req.method === "POST") {
      const [row] = await sql`
        INSERT INTO coupons (code, kind, value, max_discount, min_days, valid_from, valid_to, usage_limit, active)
        VALUES (${code}, ${c.kind}, ${c.value}, ${c.max_discount || null}, ${c.min_days || 1}, ${c.valid_from || null}, ${c.valid_to || null}, ${c.usage_limit || null}, ${c.active !== false})
        RETURNING *`;
      return send(res, 201, { coupon: row });
    }
    const [row] = await sql`
      UPDATE coupons SET code = ${code}, kind = ${c.kind}, value = ${c.value},
        max_discount = ${c.max_discount || null}, min_days = ${c.min_days || 1},
        valid_from = ${c.valid_from || null}, valid_to = ${c.valid_to || null},
        usage_limit = ${c.usage_limit || null}, active = ${c.active !== false}
      WHERE id = ${c.id} RETURNING *`;
    if (!row) return send(res, 404, { error: "Coupon not found." });
    send(res, 200, { coupon: row });
  } catch (e) {
    if (String(e?.message || "").includes("coupons_code_key"))
      return send(res, 409, { error: "That coupon code already exists." });
    send(res, e.status || 500, { error: e.status ? e.message : "Coupon update failed." });
  }
}

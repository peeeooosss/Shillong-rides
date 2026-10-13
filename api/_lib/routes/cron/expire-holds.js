import { db, send, method } from "../../db.js";

// GET /api/cron/expire-holds — called by Vercel Cron. Enforces CRON_SECRET when set.
export default async function handler(req, res) {
  if (!method(req, res, ["GET"])) return;
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const got = String(req.headers.authorization || "").replace(/^Bearer\s+/, "");
    if (got !== expected) return send(res, 401, { error: "Unauthorized." });
  }
  try {
    const sql = db();
    const rows = await sql`DELETE FROM booking_holds WHERE expires_at <= now() RETURNING id`;
    send(res, 200, { ok: true, expired: rows.length });
  } catch (e) {
    send(res, e.status || 500, { error: "Hold cleanup failed." });
  }
}

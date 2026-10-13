import { db, send, method } from "../../db.js";
import { getSession } from "../../session.js";

// GET /api/auth/me
export default async function handler(req, res) {
  if (!method(req, res, ["GET"])) return;
  try {
    const s = await getSession(req);
    if (!s) return send(res, 401, { error: "Not logged in." });
    const sql = db();
    const [user] = await sql`SELECT id, phone, name, role FROM users WHERE id = ${s.id}`;
    if (!user) return send(res, 401, { error: "Not logged in." });
    send(res, 200, { user });
  } catch (e) {
    send(res, e.status || 500, { error: "Failed to load session." });
  }
}

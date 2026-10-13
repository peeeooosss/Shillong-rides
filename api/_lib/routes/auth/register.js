import bcrypt from "bcryptjs";
import { db, send, method, readJson, normalizePhone } from "../../db.js";
import { signSession, setSessionCookie } from "../../session.js";

// POST /api/auth/register { phone, password, name }
export default async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;
  try {
    const sql = db();
    const { phone, password, name } = await readJson(req);
    const clean = normalizePhone(phone);
    if (!clean) return send(res, 400, { error: "Enter a valid 10-digit mobile number." });
    if (!password || String(password).length < 6)
      return send(res, 400, { error: "Password must be at least 6 characters." });

    const existing = await sql`SELECT id FROM users WHERE phone = ${clean}`;
    if (existing.length) return send(res, 409, { error: "This number is already registered. Please log in." });

    const hash = await bcrypt.hash(String(password), 10);
    const [user] = await sql`
      INSERT INTO users (phone, password_hash, name, role)
      VALUES (${clean}, ${hash}, ${String(name || "").slice(0, 80)}, 'customer')
      RETURNING id, phone, name, role`;
    setSessionCookie(res, await signSession(user));
    send(res, 201, { user });
  } catch (e) {
    send(res, e.status || 500, { error: e.status ? e.message : "Registration failed." });
  }
}

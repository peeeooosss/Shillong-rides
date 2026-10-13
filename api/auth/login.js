import bcrypt from "bcryptjs";
import { db, send, method, readJson, normalizePhone } from "../_lib/db.js";
import { signSession, setSessionCookie } from "../_lib/session.js";

// POST /api/auth/login { phone, password }
export default async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;
  try {
    const sql = db();
    const { phone, password } = await readJson(req);
    const clean = normalizePhone(phone);
    if (!clean || !password) return send(res, 400, { error: "Enter your mobile number and password." });

    const [user] = await sql`SELECT * FROM users WHERE phone = ${clean}`;
    if (!user) return send(res, 401, { error: "No account found for this number." });
    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) return send(res, 401, { error: "Incorrect password." });

    setSessionCookie(res, await signSession(user));
    send(res, 200, { user: { id: user.id, phone: user.phone, name: user.name, role: user.role } });
  } catch (e) {
    // Slow down credential guessing slightly
    await new Promise((r) => setTimeout(r, 400));
    send(res, e.status || 500, { error: e.status ? e.message : "Login failed." });
  }
}

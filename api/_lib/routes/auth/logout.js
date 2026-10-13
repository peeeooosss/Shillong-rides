import { send, method } from "../../db.js";
import { clearSessionCookie } from "../../session.js";

// POST /api/auth/logout
export default async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;
  clearSessionCookie(res);
  send(res, 200, { ok: true });
}

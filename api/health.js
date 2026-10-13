import { db, send, method } from "./_lib/db.js";

export default async function handler(req, res) {
  if (!method(req, res, ["GET"])) return;
  let database = "down";
  try {
    const sql = db();
    await sql`SELECT 1`;
    database = "up";
  } catch (e) {
    database = e.status === 503 ? "not-configured" : "down";
  }
  send(res, 200, { ok: true, time: new Date().toISOString(), database });
}

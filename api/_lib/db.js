// Shared Neon client. DATABASE_URL is server-side only — never import this in frontend code.
import { neon } from "@neondatabase/serverless";

export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw Object.assign(new Error("DATABASE_URL is not configured"), { status: 503 });
  return neon(url);
}

export function send(res, status, body) {
  res.status(status).json(body);
}

export function method(req, res, allowed) {
  if (!allowed.includes(req.method)) {
    res.setHeader("Allow", allowed.join(", "));
    send(res, 405, { error: `Method ${req.method} not allowed` });
    return false;
  }
  return true;
}

export async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

/** Normalize an Indian phone input to 10 digits. Returns null when invalid. */
export function normalizePhone(input) {
  const digits = String(input || "").replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local) ? local : null;
}

export const ACTIVE_BOOKING_STATUSES = ["requested", "confirmed", "active"];

export function daysBetween(fromISO, toISO) {
  const ms = new Date(toISO + "T00:00:00Z") - new Date(fromISO + "T00:00:00Z");
  return Math.round(ms / 86400000) + 1;
}

export function isValidDateISO(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s || "") && !Number.isNaN(Date.parse(s));
}

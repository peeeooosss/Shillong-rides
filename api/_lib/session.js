// Session handling: JWT in an httpOnly cookie. SESSION_SECRET is server-side only.
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "sr_session";

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw Object.assign(new Error("SESSION_SECRET is not configured"), { status: 503 });
  return new TextEncoder().encode(s);
}

export async function signSession(user) {
  return new SignJWT({ sub: user.id, role: user.role, phone: user.phone })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800${secure}`
  );
}

export function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
}

function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export async function getSession(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { id: payload.sub, role: payload.role, phone: payload.phone };
  } catch {
    return null;
  }
}

export async function requireUser(req, res) {
  const s = await getSession(req);
  if (!s) {
    res.status(401).json({ error: "Please log in first." });
    return null;
  }
  return s;
}

export async function requireStaff(req, res) {
  const s = await requireUser(req, res);
  if (!s) return null;
  if (s.role !== "staff" && s.role !== "admin") {
    res.status(403).json({ error: "Staff access required." });
    return null;
  }
  return s;
}

export async function requireAdmin(req, res) {
  const s = await requireUser(req, res);
  if (!s) return null;
  if (s.role !== "admin") {
    res.status(403).json({ error: "Admin access required." });
    return null;
  }
  return s;
}

// Tiny fetch wrapper. Same-origin /api calls with session cookies.
// Throws Error(message) from the server's { error } payload when status is not ok.
export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(path, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

/** Demo-mode fallback quote (used only when the API/database is unreachable). */
export function demoQuote(pricePerDay, from, to, couponCode) {
  const days = Math.round((new Date(to) - new Date(from)) / 86400000) + 1;
  const subtotal = pricePerDay * days;
  let discount = 0;
  const code = String(couponCode || "").trim().toUpperCase();
  if (code === "HILLS10" && days >= 2) discount = Math.min(Math.round(subtotal * 0.1), 500);
  else if (code) throw new Error("Coupon is not valid for these dates.");
  return { days, subtotal, discount, total: subtotal - discount };
}

export const ADMIN_WHATSAPP_FALLBACK = "919864854481";

export function demoWhatsAppUrl({ ref, vehicleName, from, to, days, location, riders, total, coupon, name, phone }) {
  const lines = [
    "Hi Shillong Ride! I just booked on the website.",
    `Booking Ref: ${ref}`,
    `Vehicle: ${vehicleName}`,
    `Dates: ${from} to ${to} (${days} day(s))`,
    `Pickup: ${location} | Riders: ${riders}`,
    `Total: Rs ${total}${coupon ? ` (coupon ${coupon})` : ""}`,
    `Name: ${name || ""} | Phone: ${phone || ""}`,
    "Please guide me with documents and payment.",
  ];
  return `https://wa.me/${ADMIN_WHATSAPP_FALLBACK}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function inr(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

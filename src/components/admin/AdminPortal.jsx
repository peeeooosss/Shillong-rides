import { useEffect, useState } from "react";
import { ArrowUpRight, Settings2 } from "lucide-react";
import { api, inr } from "../../lib/api";
import AdminPreview from "./AdminPreview";

const NEXT = { requested: ["confirmed", "cancelled"], confirmed: ["active", "cancelled"], active: ["closed", "cancelled"] };

// Real admin portal. Falls back to the demo preview when the backend is unreachable,
// and gates everything behind staff/admin login otherwise.
export default function AdminPortal({ user, apiDown, onLoginClick, notify }) {
  const [tab, setTab] = useState("queue");
  const [filter, setFilter] = useState("requested");
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [fleet, setFleet] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");
  const [showGate, setShowGate] = useState(true);
  const [payForm, setPayForm] = useState({ bookingId: "", mode: "upi", amount: "", note: "" });

  const isStaff = user && (user.role === "staff" || user.role === "admin");
  const isAdmin = user && user.role === "admin";

  const load = async () => {
    setError("");
    try {
      const [s, b] = await Promise.all([
        api("/api/admin/stats"),
        api(`/api/admin/bookings?status=${filter === "all" ? "all" : filter}`),
      ]);
      setStats(s.stats);
      setBookings(b.bookings);
      if (tab === "fleet") setFleet((await api("/api/admin/vehicles")).vehicles);
      if (tab === "coupons") setCoupons((await api("/api/admin/coupons")).coupons);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (isStaff && !apiDown) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStaff, filter, tab]);

  if (apiDown || !isStaff) {
    return (
      <section className="admin-preview" id="admin-preview" aria-labelledby="admin-heading">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="kicker"><Settings2 size={14} aria-hidden="true" /> Built for the business too</div>
              <h2 id="admin-heading">One view of the whole fleet.</h2>
              <p className="section-sub">
                {apiDown
                  ? "Backend not connected — showing the demo preview. Deploy with DATABASE_URL for live data."
                  : "Staff login required for live operations. The preview below is demo data."}
              </p>
            </div>
            {!apiDown && !isStaff && (
              <button className="btn btn-primary" onClick={onLoginClick}>
                Staff log in <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            )}
          </div>
          {showGate && <AdminPreview open onToggle={() => setShowGate(false)} />}
        </div>
      </section>
    );
  }

  const advance = async (id, status) => {
    try {
      await api("/api/admin/bookings", { method: "PATCH", body: { id, status } });
      notify(`Booking ${status}.`);
      load();
    } catch (e) {
      notify(e.message);
    }
  };

  const deactivateVehicle = async (id) => {
    if (!window.confirm("Deactivate this vehicle? Existing bookings are kept.")) return;
    await api(`/api/admin/vehicles?id=${id}`, { method: "DELETE" });
    load();
  };

  const recordPayment = async (e) => {
    e.preventDefault();
    try {
      await api("/api/admin/payments", {
        method: "POST",
        body: { bookingId: payForm.bookingId, mode: payForm.mode, amount: Number(payForm.amount), note: payForm.note },
      });
      notify("Payment recorded.");
      setPayForm({ bookingId: "", mode: "upi", amount: "", note: "" });
    } catch (err) {
      notify(err.message);
    }
  };

  return (
    <section className="admin-preview" id="admin-preview" aria-labelledby="admin-live-heading">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker"><Settings2 size={14} aria-hidden="true" /> Live operations</div>
            <h2 id="admin-live-heading">Admin portal.</h2>
            <p className="section-sub">Signed in as {user.name || user.phone} ({user.role}). {isAdmin ? "You can close rides." : "Only admins can close rides."}</p>
          </div>
          <div className="fleet-tools">
            {["queue", "fleet", "coupons", "payments"].map((t) => (
              <button key={t} className={`chip ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="field-error" role="alert">{error}</p>}
        {stats && (
          <div className="admin-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, margin: "0 0 18px" }}>
            {stats.map((s) => (
              <div className="admin-stat" key={s.label} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 13, background: "#fffefa" }}>
                <small style={{ fontSize: 10, color: "var(--muted)" }}>{s.label}</small>
                <strong style={{ display: "block", fontSize: 20, marginTop: 6 }}>{s.value}</strong>
              </div>
            ))}
          </div>
        )}

        {tab === "queue" && (
          <div>
            <div className="fleet-tools" style={{ marginBottom: 12 }}>
              {["requested", "confirmed", "active", "closed", "cancelled", "all"].map((s) => (
                <button key={s} className={`chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
              ))}
            </div>
            <div className="table-wrap">
              <table className="admin-table">
                <thead><tr><th>Ref</th><th>Customer</th><th>Vehicle</th><th>Dates</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td><strong>{b.ref}</strong></td>
                      <td>{b.customer_name || ""}<br /><small>{b.customer_phone}</small></td>
                      <td>{b.vehicle_name}</td>
                      <td>{b.pickup_date} → {b.return_date}</td>
                      <td>{inr(b.amount_total)}</td>
                      <td><span className="status">{b.status}</span></td>
                      <td>
                        {(NEXT[b.status] || []).filter((s) => s !== "closed" || isAdmin).map((s) => (
                          <button key={s} className="chip" style={{ margin: "2px 4px 2px 0" }} onClick={() => advance(b.id, s)}>{s}</button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && <div className="empty-state">No bookings in this state.</div>}
            </div>
          </div>
        )}

        {tab === "fleet" && (
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Vehicle</th><th>Category</th><th>Per day</th><th>Active</th><th>Action</th></tr></thead>
              <tbody>
                {fleet.map((v) => (
                  <tr key={v.id}>
                    <td><strong>{v.name}</strong>{v.is_demo ? " (demo)" : ""}</td>
                    <td>{v.category}</td>
                    <td>{inr(v.price_per_day)}</td>
                    <td>{v.active ? "Yes" : "No"}</td>
                    <td>{v.active && <button className="chip" onClick={() => deactivateVehicle(v.id)}>Deactivate</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="section-sub" style={{ marginTop: 10 }}>Add/edit vehicles via the API for now — full fleet form is next. Replace demo rows with approved data before launch.</p>
          </div>
        )}

        {tab === "coupons" && (
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Code</th><th>Kind</th><th>Value</th><th>Used</th><th>Active</th></tr></thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.code}</strong></td>
                    <td>{c.kind}</td>
                    <td>{c.kind === "percent" ? `${c.value}%` : inr(c.value)}</td>
                    <td>{c.used_count}{c.usage_limit ? `/${c.usage_limit}` : ""}</td>
                    <td>{c.active ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="section-sub" style={{ marginTop: 10 }}>Create/edit coupons via the API for now — full coupon form is next.</p>
          </div>
        )}

        {tab === "payments" && (
          <form onSubmit={recordPayment}>
            <div className="booking-fields" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
              <div className="field"><label>Booking ID</label><input value={payForm.bookingId} onChange={(e) => setPayForm({ ...payForm, bookingId: e.target.value })} placeholder="UUID from queue" required /></div>
              <div className="field"><label>Mode</label>
                <select value={payForm.mode} onChange={(e) => setPayForm({ ...payForm, mode: e.target.value })}>
                  <option value="upi">UPI</option><option value="cash">Cash</option><option value="other">Other</option>
                </select>
              </div>
              <div className="field"><label>Amount (Rs)</label><input type="number" min={1} value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} required /></div>
              <div className="field"><label>Note</label><input value={payForm.note} onChange={(e) => setPayForm({ ...payForm, note: e.target.value })} placeholder="UPI ref / remark" /></div>
            </div>
            <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>Record payment</button>
          </form>
        )}
      </div>
    </section>
  );
}

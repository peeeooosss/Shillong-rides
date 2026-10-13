import { useEffect, useState } from "react";
import { MessageCircle, Receipt } from "lucide-react";
import { api, ADMIN_WHATSAPP_FALLBACK, inr } from "../../lib/api";

const STATUS_HINT = {
  requested: "Sent to admin — confirm details on WhatsApp.",
  confirmed: "Confirmed by admin. Get ready to ride.",
  active: "Ride in progress. Enjoy Meghalaya responsibly.",
  closed: "Trip complete. Thank you for riding with us.",
  cancelled: "This booking was cancelled.",
};

export default function MyBookings({ user, refreshKey, onLoginClick }) {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    api("/api/bookings")
      .then((d) => setBookings(d.bookings))
      .catch((e) => setError(e.message));
  }, [user, refreshKey]);

  if (!user) return null;

  return (
    <section className="section section-white" id="my-bookings" aria-labelledby="myb-heading">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker"><Receipt size={14} aria-hidden="true" /> Your trips</div>
            <h2 id="myb-heading">My bookings.</h2>
            <p className="section-sub">Track every request. Only the admin can confirm and close a ride.</p>
          </div>
          <a className="btn btn-light" href={`https://wa.me/${ADMIN_WHATSAPP_FALLBACK}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <MessageCircle size={15} aria-hidden="true" /> Chat with admin
          </a>
        </div>
        {error && <p className="field-error" role="alert">{error}</p>}
        {!bookings && !error && <p className="section-sub">Loading…</p>}
        {bookings && bookings.length === 0 && (
          <div className="empty-state" role="status">No bookings yet — pick a ride and tap BOOK NOW.</div>
        )}
        {bookings && bookings.length > 0 && (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th scope="col">Ref</th><th scope="col">Vehicle</th><th scope="col">Dates</th><th scope="col">Total</th><th scope="col">Status</th></tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.ref}</strong></td>
                    <td>{b.vehicle_name}</td>
                    <td>{b.pickup_date} → {b.return_date}</td>
                    <td>{inr(b.amount_total)}</td>
                    <td><span className="status">{b.status}</span><div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{STATUS_HINT[b.status]}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

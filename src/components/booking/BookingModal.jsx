import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, MapPin, MessageCircle, Users, X } from "lucide-react";
import { api, demoQuote, demoWhatsAppUrl, inr } from "../../lib/api";
import { PICKUP_LOCATIONS } from "../../data/vehicles";
import { TermsChecklist } from "./RentalTerms";
import { formatINR } from "../../utils/formatCurrency";

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

// Booking: dates + riders + coupon -> live server quote -> BOOK NOW -> WhatsApp handoff.
// When the backend is unreachable, runs in clearly-labeled demo mode.
export default function BookingModal({ vehicle, user, apiDown, onClose, onBooked, notify }) {
  const [from, setFrom] = useState(todayISO(0));
  const [to, setTo] = useState(todayISO(1));
  const [riders, setRiders] = useState(1);
  const [location, setLocation] = useState("Shillong");
  const [coupon, setCoupon] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [quote, setQuote] = useState(null);
  const [quoteBusy, setQuoteBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  const loadQuote = async () => {
    setError("");
    if (!from || !to || to < from) {
      setError("Return date must be the same as or after the pickup date.");
      setQuote(null);
      return;
    }
    setQuoteBusy(true);
    try {
      if (apiDown) {
        const q = demoQuote(vehicle.price, from, to, coupon);
        setQuote({ ...q, pricePerDay: vehicle.price, demo: true });
      } else {
        const q = await api("/api/quote", {
          method: "POST",
          body: { vehicleId: vehicle.backendId || vehicle.id, pickupDate: from, returnDate: to, riders, couponCode: coupon },
        });
        setQuote(q);
      }
    } catch (e) {
      setQuote(null);
      setError(e.message);
    } finally {
      setQuoteBusy(false);
    }
  };

  useEffect(() => {
    loadQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookNow = async () => {
    setError("");
    if (!acceptTerms) {
      setError("Please accept the rental terms to continue.");
      return;
    }
    setBusy(true);
    try {
      if (apiDown) {
        const q = demoQuote(vehicle.price, from, to, coupon);
        const ref = `SR-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
        setDone({
          demo: true,
          ref,
          total: q.total,
          whatsappUrl: demoWhatsAppUrl({
            ref, vehicleName: vehicle.name, from, to, days: q.days,
            location, riders, total: q.total, coupon: coupon.toUpperCase() || null,
            name: user?.name, phone: user?.phone,
          }),
        });
      } else {
        const d = await api("/api/bookings", {
          method: "POST",
          body: {
            vehicleId: vehicle.backendId || vehicle.id,
            pickupLocation: location, pickupDate: from, returnDate: to,
            riders, couponCode: coupon, acceptTerms: true,
          },
        });
        setDone({ demo: false, ref: d.booking.ref, total: d.booking.amount_total, whatsappUrl: d.whatsappUrl });
        onBooked?.();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="book-title">
        <img src={vehicle.image} alt={vehicle.name} />
        <div className="modal-body">
          <div className="modal-head">
            <div>
              <div className="vehicle-type">{vehicle.category} · {vehicle.type}</div>
              <h3 id="book-title">{done ? `Booking ${done.ref}` : `Book ${vehicle.name}`}</h3>
            </div>
            <button className="close-btn" aria-label="Close" onClick={onClose}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {done ? (
            <div>
              {done.demo && (
                <p className="field-error" role="note">
                  Demo mode — backend not connected. Your reference is for the WhatsApp chat only.
                </p>
              )}
              <div className="modal-summary">
                <span>Total payable (to be settled with admin)</span>
                <strong>{inr(done.total)}</strong>
              </div>
              <p className="modal-copy">
                Booking <strong>{done.ref}</strong> is saved as <strong>requested</strong>. Continue
                on WhatsApp — the admin will verify your licence + Aadhaar there, confirm payment,
                and close the ride after your trip.
              </p>
              <div className="modal-actions" style={{ marginTop: 14 }}>
                <button className="btn btn-light" onClick={onClose}>Done</button>
                <a className="btn btn-primary" href={done.whatsappUrl} target="_blank" rel="noreferrer"
                   style={{ textDecoration: "none" }} onClick={() => notify("Opening WhatsApp — send the prefilled message to confirm.")}>
                  <MessageCircle size={15} aria-hidden="true" /> Continue on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div>
              <div className="booking-fields" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 12 }}>
                <div className="field">
                  <label htmlFor="bk-from"><CalendarDays size={13} aria-hidden="true" /> Pickup date</label>
                  <input id="bk-from" type="date" min={todayISO(0)} value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="bk-to"><CalendarDays size={13} aria-hidden="true" /> Return date</label>
                  <input id="bk-to" type="date" min={from || todayISO(0)} value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="bk-riders"><Users size={13} aria-hidden="true" /> Riders</label>
                  <input id="bk-riders" type="number" min={1} max={7} value={riders} onChange={(e) => setRiders(Number(e.target.value))} />
                </div>
                <div className="field">
                  <label htmlFor="bk-loc"><MapPin size={13} aria-hidden="true" /> Pickup</label>
                  <select id="bk-loc" value={location} onChange={(e) => setLocation(e.target.value)}>
                    {PICKUP_LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label htmlFor="bk-coupon">Offer code (optional)</label>
                <input id="bk-coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="e.g. HILLS10" autoComplete="off" />
              </div>
              <button className="btn btn-light" onClick={loadQuote} disabled={quoteBusy} style={{ width: "100%", marginBottom: 12 }}>
                {quoteBusy ? "Checking…" : "Get exact quote"}
              </button>

              {quote && (
                <div className="modal-summary">
                  <span>
                    {quote.days} day(s) × {formatINR(quote.pricePerDay ?? vehicle.price)}
                    {quote.discount ? ` · Discount −${formatINR(quote.discount)}` : ""}
                    {quote.demo ? " · demo quote" : ""}
                  </span>
                  <strong>{formatINR(quote.total)}</strong>
                </div>
              )}

              <TermsChecklist checked={acceptTerms} onChange={setAcceptTerms} />
              {error && <p className="field-error" role="alert" style={{ marginTop: 10 }}>{error}</p>}

              <div className="modal-actions" style={{ marginTop: 14 }}>
                <button className="btn btn-light" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={bookNow} disabled={busy || !quote}>
                  {busy ? "Booking…" : <>BOOK NOW <ArrowRight size={15} aria-hidden="true" /></>}
                </button>
              </div>
              <p className="modal-copy" style={{ marginTop: 10 }}>
                No payment here — BOOK NOW saves your request and opens WhatsApp with the admin.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { CalendarDays, MapPin, Search, Sparkles } from "lucide-react";
import { PICKUP_LOCATIONS } from "../../data/vehicles";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingSearch({ onSearch }) {
  const [pickup, setPickup] = useState("Shillong");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (pickupDate && returnDate && returnDate < pickupDate) {
      setError("Return date must be the same as or after the pickup date.");
      return;
    }
    setError("");
    onSearch({ pickup, pickupDate, returnDate });
  };

  return (
    <div className="container booking-wrap" id="booking">
      <div className="booking-card">
        <div className="booking-head">
          <div>
            <h2>Where will the road take you?</h2>
            <p>Choose your pickup details and discover available rides.</p>
          </div>
          <span className="kicker">
            <Sparkles size={14} aria-hidden="true" /> Your next chapter
          </span>
        </div>
        <div className="booking-fields">
          <div className="field">
            <label htmlFor="pickup-location">
              <MapPin size={13} aria-hidden="true" /> Pickup location
            </label>
            <select id="pickup-location" value={pickup} onChange={(e) => setPickup(e.target.value)}>
              {PICKUP_LOCATIONS.map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="pickup-date">
              <CalendarDays size={13} aria-hidden="true" /> Pickup date
            </label>
            <input
              id="pickup-date"
              type="date"
              min={todayISO()}
              value={pickupDate}
              onChange={(e) => {
                setPickupDate(e.target.value);
                setError("");
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="return-date">
              <CalendarDays size={13} aria-hidden="true" /> Return date
            </label>
            <input
              id="return-date"
              type="date"
              min={pickupDate || todayISO()}
              value={returnDate}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "date-error" : undefined}
              onChange={(e) => {
                setReturnDate(e.target.value);
                setError("");
              }}
            />
            {error && (
              <p className="field-error" id="date-error" role="alert">
                {error}
              </p>
            )}
          </div>
          <button className="btn btn-primary" onClick={handleSearch}>
            <Search size={16} aria-hidden="true" /> Search rides
          </button>
        </div>
      </div>
    </div>
  );
}

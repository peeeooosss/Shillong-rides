import { useEffect, useRef } from "react";
import { ArrowRight, Fuel, Settings2, Users, X } from "lucide-react";
import { formatINR } from "../../utils/formatCurrency";

export default function VehicleDetailsModal({ vehicle, onClose, onContinue }) {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!vehicle) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [vehicle]);

  if (!vehicle) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <img src={vehicle.image} alt={vehicle.name} />
        <div className="modal-body">
          <div className="modal-head">
            <div>
              <div className="vehicle-type">
                {vehicle.category} · {vehicle.type}
              </div>
              <h3 id="modal-title">{vehicle.name}</h3>
            </div>
            <button ref={closeRef} className="close-btn" aria-label="Close details" onClick={onClose}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="modal-copy">
            Review this demo vehicle before continuing. Final availability, eligibility, deposit,
            insurance and rental terms must be confirmed by the rental operator.
          </p>
          <div className="specs">
            <span>
              <Users size={14} aria-hidden="true" />
              {vehicle.seats} seats
            </span>
            <span>
              <Settings2 size={14} aria-hidden="true" />
              {vehicle.transmission}
            </span>
            <span>
              <Fuel size={14} aria-hidden="true" />
              {vehicle.fuel}
            </span>
          </div>
          <div className="modal-summary">
            <span>Indicative demo rate · per day</span>
            <strong>{formatINR(vehicle.price)}</strong>
          </div>
          <div className="modal-actions">
            <button className="btn btn-light" onClick={onClose}>
              Keep exploring
            </button>
            <button className="btn btn-primary" onClick={onContinue}>
              Continue <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

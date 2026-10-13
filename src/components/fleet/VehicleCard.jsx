import { ArrowUpRight, Fuel, Heart, Settings2, Star, Users } from "lucide-react";
import { formatINR } from "../../utils/formatCurrency";

export default function VehicleCard({ vehicle, saved, onToggleSave, onView }) {
  const isSaved = saved.includes(vehicle.id);
  return (
    <article className="vehicle-card">
      <div className="vehicle-image">
        <img src={vehicle.image} alt={vehicle.name} loading="lazy" />
        <span className="vehicle-tag">{vehicle.tag}</span>
        <button
          className={`heart ${isSaved ? "saved" : ""}`}
          aria-label={isSaved ? `Remove ${vehicle.name} from favourites` : `Save ${vehicle.name} to favourites`}
          aria-pressed={isSaved}
          onClick={() => onToggleSave(vehicle.id)}
        >
          <Heart size={16} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>
      <div className="vehicle-body">
        <div className="vehicle-type">
          {vehicle.category} · {vehicle.type}
        </div>
        <div className="vehicle-title-row">
          <h3 className="vehicle-title">{vehicle.name}</h3>
          <span className="rating" aria-label={`Demo rating ${vehicle.rating} out of 5`}>
            <Star size={12} aria-hidden="true" />
            {vehicle.rating}
          </span>
        </div>
        <div className="specs">
          <span>
            <Users size={13} aria-hidden="true" />
            {vehicle.seats} seats
          </span>
          <span>
            <Settings2 size={13} aria-hidden="true" />
            {vehicle.transmission}
          </span>
          <span>
            <Fuel size={13} aria-hidden="true" />
            {vehicle.fuel}
          </span>
        </div>
        <div className="vehicle-bottom">
          <div className="price">
            {formatINR(vehicle.price)}
            <small> / day</small>
          </div>
          <button className="btn btn-primary" onClick={() => onView(vehicle)}>
            View ride <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

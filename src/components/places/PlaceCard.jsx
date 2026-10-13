import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { placeImage } from "../../data/places";

export default function PlaceCard({ place }) {
  return (
    <article className="place-card">
      <div className="place-media">
        <img
          src={placeImage(place.slug)}
          alt={place.name}
          loading="lazy"
          decoding="async"
          width="960"
          height="640"
        />
        <span className="place-tag">{place.category}</span>
      </div>
      <div className="place-body">
        <h3>{place.name}</h3>
        <div className="place-meta">
          <span>
            <Clock size={13} aria-hidden="true" /> {place.time}
          </span>
          <span>
            <CalendarDays size={13} aria-hidden="true" /> Best {place.best}
          </span>
        </div>
        <p>{place.note}</p>
        <a className="place-link" href="#booking">
          Plan a ride <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

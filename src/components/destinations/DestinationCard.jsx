import { ArrowUpRight } from "lucide-react";

export default function DestinationCard({ destination }) {
  return (
    <article
      className="destination-card"
      style={{ "--dest-img": `url("${destination.image}")` }}
    >
      <div className="destination-content">
        <small>{destination.time}</small>
        <h3>{destination.name}</h3>
        <p>{destination.note}</p>
        <a href="#booking" className="destination-link">
          Plan a ride <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

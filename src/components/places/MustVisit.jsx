import { useMemo, useState } from "react";
import {
  ArrowRight,
  Droplets,
  Landmark,
  MapPin,
  Mountain,
  SlidersHorizontal,
  Trees,
  Waves,
} from "lucide-react";
import { PLACES, PLACE_CATEGORIES } from "../../data/places";
import PlaceCard from "./PlaceCard";

const CATEGORY_ICONS = {
  All: SlidersHorizontal,
  Waterfalls: Waves,
  "Roots & Culture": Trees,
  "Lakes & Rivers": Droplets,
  Viewpoints: Mountain,
  Caves: Landmark,
};

export default function MustVisit({ onExplore }) {
  const [active, setActive] = useState("All");
  const places = useMemo(
    () => (active === "All" ? PLACES : PLACES.filter((place) => place.category === active)),
    [active]
  );

  return (
    <section className="section" id="places" aria-labelledby="places-heading">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker">
              <MapPin size={14} aria-hidden="true" /> Must-visit Meghalaya
            </div>
            <h2 id="places-heading">Places worth the detour.</h2>
            <p className="section-sub">
              Twelve of the spots travellers ask us about most — from thundering falls to glass-clear
              rivers. Times are approximate drives from Shillong.
            </p>
          </div>
          <button className="btn btn-light" onClick={onExplore}>
            Find a ride <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="category-row" role="group" aria-label="Filter places by type">
          {PLACE_CATEGORIES.map((label) => {
            const Icon = CATEGORY_ICONS[label];
            return (
              <button
                key={label}
                type="button"
                className={`chip ${active === label ? "active" : ""}`}
                aria-pressed={active === label}
                onClick={() => setActive(label)}
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>

        <div className="place-grid">
          {places.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>
      </div>
    </section>
  );
}

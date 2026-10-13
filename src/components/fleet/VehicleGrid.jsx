import { ArrowRight, Bike, CarFront, Gauge, Route, Search, SlidersHorizontal } from "lucide-react";
import VehicleCard from "./VehicleCard";
import TrustStrip from "../sections/TrustStrip";

const CATEGORY_ICONS = { All: SlidersHorizontal, Car: CarFront, Scooty: Gauge, Bike };

export default function VehicleGrid({
  vehicles,
  category,
  onCategoryChange,
  query,
  onQueryChange,
  saved,
  onToggleSave,
  onView,
  onReset,
}) {
  return (
    <section className="section" id="fleet" aria-labelledby="fleet-heading">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker">
              <Route size={14} aria-hidden="true" /> The right ride for your route
            </div>
            <h2 id="fleet-heading">Meet your next ride.</h2>
            <p className="section-sub">
              A quick city spin or a full-day escape into the hills. Find a ride that fits your pace.
            </p>
          </div>
          <button className="btn btn-light" onClick={onReset}>
            View all rides <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="fleet-tools">
          <div className="category-row" role="group" aria-label="Filter by vehicle category">
            {Object.keys(CATEGORY_ICONS).map((label) => {
              const Icon = CATEGORY_ICONS[label];
              const display = label === "All" ? "All rides" : label === "Scooty" ? "Scooties" : `${label}s`;
              return (
                <button
                  key={label}
                  className={`chip ${category === label ? "active" : ""}`}
                  aria-pressed={category === label}
                  onClick={() => onCategoryChange(label)}
                >
                  <Icon size={14} aria-hidden="true" />
                  {display}
                </button>
              );
            })}
          </div>
          <label className="searchbox">
            <Search size={15} color="#78867b" aria-hidden="true" />
            <span className="sr-only">Search vehicles</span>
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by vehicle name..."
              aria-label="Search vehicles"
              type="search"
            />
          </label>
        </div>
        {vehicles.length > 0 ? (
          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                saved={saved}
                onToggleSave={onToggleSave}
                onView={onView}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" role="status">
            No demo vehicles match your search. Try another category or name.
          </div>
        )}
        <TrustStrip />
      </div>
    </section>
  );
}

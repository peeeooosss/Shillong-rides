import { ArrowRight, Mountain } from "lucide-react";
import { DESTINATIONS } from "../../data/destinations";
import DestinationCard from "../destinations/DestinationCard";

export default function Destinations({ onNotify }) {
  return (
    <section className="section section-white" id="destinations" aria-labelledby="destinations-heading">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker">
              <Mountain size={14} aria-hidden="true" /> More than a destination
            </div>
            <h2 id="destinations-heading">Let the hills surprise you.</h2>
            <p className="section-sub">
              A little inspiration for the road ahead. Check local conditions and travel times
              before setting out.
            </p>
          </div>
          <button
            className="btn btn-light"
            onClick={() => onNotify("Destination guides are coming in a later phase with verified local information.")}
          >
            Explore guides <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="destination-grid">
          {DESTINATIONS.map((d) => (
            <DestinationCard key={d.name} destination={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

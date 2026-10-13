import { ArrowUpRight, CheckCircle2, Compass } from "lucide-react";

export default function Hero({ onFindRide, onExplore }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true"></span> Your Meghalaya story starts here
          </div>
          <h1 id="hero-heading">
            Take the long way.
            <br />
            <em>Love every turn.</em>
          </h1>
          <p className="hero-copy">
            From Shillong&apos;s lively streets to roads wrapped in mist. Find the right car, bike
            or scooty for wherever the hills take you.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onFindRide}>
              Find your ride <ArrowUpRight size={16} aria-hidden="true" />
            </button>
            <button className="btn btn-light" onClick={onExplore}>
              <Compass size={16} aria-hidden="true" /> Explore the hills
            </button>
          </div>
          <div className="hero-note">
            <span>
              <CheckCircle2 size={14} aria-hidden="true" /> Straightforward pricing
            </span>
            <span>
              <CheckCircle2 size={14} aria-hidden="true" /> Cars, bikes &amp; scooties
            </span>
            <span>
              <CheckCircle2 size={14} aria-hidden="true" /> Made for Shillong
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

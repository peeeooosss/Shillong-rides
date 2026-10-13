import { ArrowUpRight } from "lucide-react";

export default function CallToAction({ onExplore }) {
  return (
    <section className="cta" aria-labelledby="cta-heading">
      <div className="container cta-inner">
        <div>
          <h2 id="cta-heading">
            Shillong is calling.
            <br />
            Pick your way to answer.
          </h2>
          <p>Choose your ride and make room for a few unexpected turns.</p>
        </div>
        <button className="btn btn-primary" onClick={onExplore}>
          Explore available rides <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

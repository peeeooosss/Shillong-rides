import { Route } from "lucide-react";

const STEPS = [
  { n: "01", title: "Find your fit", text: "Choose a car, bike or scooty and check the rental details, pickup options and displayed rate." },
  { n: "02", title: "Confirm the details", text: "Share your rental dates and required documents. Review all charges and terms before confirming." },
  { n: "03", title: "Start your journey", text: "Follow the confirmed pickup instructions, inspect the vehicle and enjoy the road responsibly." },
];

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works" aria-labelledby="how-heading">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker">
              <Route size={14} aria-hidden="true" /> Three simple steps
            </div>
            <h2 id="how-heading">Less planning. More exploring.</h2>
            <p className="section-sub">
              A simple journey from browsing vehicles to getting ready for the road.
            </p>
          </div>
        </div>
        <div className="steps-grid">
          {STEPS.map((s) => (
            <article className="step" key={s.n}>
              <div className="step-number" aria-hidden="true">
                {s.n}
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

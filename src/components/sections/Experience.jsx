import { ArrowRight, Compass, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

const BENEFITS = [
  { icon: Compass, title: "Made for local journeys", text: "Pickup options and travel information designed around Shillong and nearby destinations." },
  { icon: ShieldCheck, title: "Know before you go", text: "Clear rental terms, vehicle details and pricing before you make a decision." },
  { icon: MessageCircle, title: "Human help, not guesswork", text: "Easy-to-find contact and support details for the questions that matter." },
];

export default function Experience({ onHowItWorks }) {
  return (
    <section className="experience" id="why-us" aria-labelledby="why-heading">
      <div className="section">
        <div className="container experience-grid">
          <div>
            <div className="kicker">
              <Sparkles size={14} aria-hidden="true" /> A more local way to move
            </div>
            <h2 id="why-heading">Built for the bends, the breeze and the unexpected stops.</h2>
            <p className="section-sub">
              Shillong is best experienced at your own pace. We&apos;re shaping a rental experience
              around the way people actually explore the hills.
            </p>
            <div className="benefits">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <div className="benefit" key={title}>
                  <span className="benefit-icon" aria-hidden="true">
                    <Icon size={19} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={onHowItWorks}>
              How Shillong Ride works <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
          <div className="experience-visual" role="img" aria-label="Mist-covered hillside road in Meghalaya">
            <div className="visual-note">
              <span>Take your time</span>
              <strong>The best turns aren&apos;t always planned.</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

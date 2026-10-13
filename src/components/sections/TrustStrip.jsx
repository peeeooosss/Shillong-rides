import { CheckCircle2, Headphones, KeyRound, ShieldCheck } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, title: "Clear, upfront pricing", text: "Know the costs before you confirm." },
  { icon: KeyRound, title: "Simple pickup process", text: "Clear instructions for your ride." },
  { icon: Headphones, title: "Local support", text: "Help when you need it." },
  { icon: CheckCircle2, title: "Booking transparency", text: "Policies shown before checkout." },
];

export default function TrustStrip() {
  return (
      <div className="trust-strip">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div className="trust-item" key={title}>
            <span className="trust-icon" aria-hidden="true">
              <Icon size={19} />
            </span>
            <div>
              <strong>{title}</strong>
              <small>{text}</small>
            </div>
          </div>
        ))}
      </div>
  );
}

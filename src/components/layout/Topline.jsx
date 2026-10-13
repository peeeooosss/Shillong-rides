import { MapPin, ShieldCheck } from "lucide-react";

export default function Topline() {
  return (
    <div className="topline">
      <div className="container topline-inner">
        <span>
          <MapPin size={13} aria-hidden="true" /> Shillong, Meghalaya · Explore at your own pace
        </span>
        <span>
          <ShieldCheck size={13} aria-hidden="true" /> Clear pricing · Local support · Easy booking
        </span>
      </div>
    </div>
  );
}

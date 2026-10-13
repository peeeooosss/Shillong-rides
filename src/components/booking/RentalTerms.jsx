import { useState } from "react";

/** Short rental-terms summary shown at booking time. Full text lives in README/legal docs. */
export const TERMS_VERSION = "v1";

export const TERMS_POINTS = [
  "You must hold a valid driving licence for the vehicle class and be 18 or older.",
  "A refundable security deposit may apply; damages, late return and fuel gaps are chargeable.",
  "Free cancellation up to 48 hrs before pickup; late cancellations may forfeit one day's rental.",
  "Documents (licence + Aadhaar) are verified by the admin on WhatsApp before handover.",
  "Helmets are mandatory on two-wheelers; rash riding voids damage cover.",
];

export function TermsChecklist({ checked, onChange }) {
  return (
    <div>
      <ul style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
        {TERMS_POINTS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, fontWeight: 600 }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ marginTop: 3 }} />
        <span>I accept the rental terms ({TERMS_VERSION}) and understand documents + payment are completed with the admin on WhatsApp.</span>
      </label>
    </div>
  );
}

export function useTermsState() {
  return useState(false);
}

import { Facebook, Instagram, MessageCircle, Mountain } from "lucide-react";

export default function Footer({ onSelectCategory, onShowAdmin, onNotify }) {
  const placeholder = (message) => (e) => {
    e.preventDefault();
    onNotify(message);
  };

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#home" className="brand" aria-label="Shillong Ride home">
              <span className="brand-mark" aria-hidden="true">
                <Mountain size={24} />
              </span>
              <span>
                SHILLONG RIDE<small>FIND YOUR ROAD</small>
              </span>
            </a>
            <p className="footer-copy">
              A Shillong-focused vehicle rental concept for travellers who want to explore Meghalaya
              at their own pace.
            </p>
            <div className="footer-social">
              <a href="#home" aria-label="Instagram">
                <Instagram size={17} aria-hidden="true" />
              </a>
              <a href="#home" aria-label="Facebook">
                <Facebook size={17} aria-hidden="true" />
              </a>
              <a href="#home" aria-label="WhatsApp">
                <MessageCircle size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
          <nav aria-label="Explore rides">
            <h4>Explore rides</h4>
            <a href="#fleet" onClick={() => onSelectCategory("Car")}>
              Car rentals
            </a>
            <a href="#fleet" onClick={() => onSelectCategory("Bike")}>
              Bike rentals
            </a>
            <a href="#fleet" onClick={() => onSelectCategory("Scooty")}>
              Scooty rentals
            </a>
            <a href="#booking">Pickup information</a>
          </nav>
          <nav aria-label="Discover">
            <h4>Discover</h4>
            <a href="#destinations">Meghalaya guides</a>
            <a href="#why-us">Why Shillong Ride</a>
            <a href="#how-it-works">How it works</a>
            <a href="#admin-preview" onClick={onShowAdmin}>
              Admin preview
            </a>
          </nav>
          <nav aria-label="Help">
            <h4>Need a hand?</h4>
            <a href="#footer" onClick={placeholder("Contact support is coming in a later phase — verified business phone will be added before launch.")}>
              Contact support
            </a>
            <a href="#footer" onClick={placeholder("FAQs and rental policy are coming in a later phase.")}>
              FAQs &amp; rental rules
            </a>
            <a href="#footer" onClick={placeholder("Privacy policy must be added before collecting customer information.")}>
              Privacy policy
            </a>
            <a href="#footer" onClick={placeholder("Terms and cancellation policy must be approved by the business owner.")}>
              Terms &amp; cancellation
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Shillong Ride. Concept prototype.</span>
          <span>
            Made for the roads of Meghalaya{" "}
            <Mountain size={12} style={{ display: "inline", verticalAlign: "middle" }} aria-hidden="true" />
          </span>
        </div>
      </div>
    </footer>
  );
}

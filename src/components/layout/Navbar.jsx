import { ArrowUpRight, Menu, Mountain, X } from "lucide-react";

export default function Navbar({
  mobileMenu,
  onToggleMenu,
  onCloseMenu,
  onBookRide,
  user,
  authLoading,
  onLoginClick,
  onLogout,
  onMyBookings,
}) {
  return (
    <header className="container navbar">
      <a href="#home" className="brand" aria-label="Shillong Ride home">
        <span className="brand-mark" aria-hidden="true">
          <Mountain size={25} />
        </span>
        <span>
          SHILLONG RIDE<small>FIND YOUR ROAD</small>
        </span>
      </a>
      <nav className={`navlinks ${mobileMenu ? "open" : ""}`} aria-label="Primary">
        <a href="#fleet" onClick={onCloseMenu}>
          Find a ride
        </a>
        <a href="#destinations" onClick={onCloseMenu}>
          Explore Meghalaya
        </a>
        <a href="#places" onClick={onCloseMenu}>
          Must-visit places
        </a>
        <a href="#how-it-works" onClick={onCloseMenu}>
          How it works
        </a>
        <a href="#why-us" onClick={onCloseMenu}>
          Why us
        </a>
        {user && (
          <a
            href="#my-bookings"
            onClick={(e) => {
              e.preventDefault();
              onCloseMenu();
              onMyBookings();
            }}
          >
            My bookings
          </a>
        )}
        <div className="navlinks-mobile-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              onCloseMenu();
              onBookRide();
            }}
          >
            Book a ride
          </button>
          {authLoading ? null : user ? (
            <button
              className="btn btn-light"
              onClick={() => {
                onCloseMenu();
                onLogout();
              }}
            >
              Log out
            </button>
          ) : (
            <button
              className="btn btn-light"
              onClick={() => {
                onCloseMenu();
                onLoginClick();
              }}
            >
              Log in
            </button>
          )}
        </div>
      </nav>
      <div className="nav-actions">
        {authLoading ? null : user ? (
          <button className="btn btn-text" onClick={onLogout} title={`Logged in as ${user.phone}`}>
            {user.name || user.phone} · Out
          </button>
        ) : (
          <button className="btn btn-text" onClick={onLoginClick}>
            Log in
          </button>
        )}
        <button className="btn btn-primary" onClick={onBookRide}>
          Book a ride <ArrowUpRight size={15} aria-hidden="true" />
        </button>
        <button
          className="mobile-toggle"
          aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenu}
          onClick={onToggleMenu}
        >
          {mobileMenu ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}

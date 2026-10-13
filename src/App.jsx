import { useEffect, useState } from "react";
import { CircleHelp } from "lucide-react";
import Topline from "./components/layout/Topline";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BookingSearch from "./components/booking/BookingSearch";
import BookingModal from "./components/booking/BookingModal";
import MyBookings from "./components/booking/MyBookings";
import AuthModal from "./components/auth/AuthModal";
import VehicleGrid from "./components/fleet/VehicleGrid";
import VehicleDetailsModal from "./components/fleet/VehicleDetailsModal";
import Hero from "./components/sections/Hero";
import Destinations from "./components/sections/Destinations";
import Experience from "./components/sections/Experience";
import HowItWorks from "./components/sections/HowItWorks";
import CallToAction from "./components/sections/CallToAction";
import AdminPortal from "./components/admin/AdminPortal";
import { VEHICLES } from "./data/vehicles";
import { useFilteredVehicles } from "./hooks/useFilteredVehicles";
import { useToast } from "./hooks/useToast";
import { useAuth } from "./hooks/useAuth";
import { api } from "./lib/api";
import "./styles/tokens.css";
import "./styles/global.css";

/**
 * Shillong Ride — page composition + booking orchestration.
 * Backend (Vercel + Neon) is used when reachable; otherwise the site runs
 * in clearly-labeled demo mode with a WhatsApp handoff fallback.
 */
function toCard(v) {
  if (v.backendId) return v;
  return {
    ...v,
    backendId: v.id && String(v.id).includes("-") ? v.id : undefined,
    price: v.price_per_day ?? v.price,
    image: v.image_url ?? v.image,
  };
}

export default function App() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [saved, setSaved] = useState([]);
  const [fleet, setFleet] = useState(VEHICLES);
  const [authMode, setAuthMode] = useState(null); // 'login' | 'register' | null
  const [bookingVehicle, setBookingVehicle] = useState(null);
  const [pendingVehicle, setPendingVehicle] = useState(null);
  const [bookingsTick, setBookingsTick] = useState(0);
  const { toast, notify } = useToast();
  const { user, loading: authLoading, apiDown, login, register, logout } = useAuth();

  // Prefer live fleet when the backend is reachable; keep demo fallback otherwise.
  useEffect(() => {
    if (apiDown) return;
    api("/api/vehicles")
      .then((d) => {
        if (d.vehicles?.length) setFleet(d.vehicles.map(toCard));
      })
      .catch(() => {});
  }, [apiDown]);

  const filteredVehicles = useFilteredVehicles(fleet, category, query);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleSearch = () => {
    scrollTo("fleet");
    notify(apiDown ? "Showing demo vehicles. Connect the backend for live availability." : "Showing vehicles with live availability.");
  };

  const toggleSave = (id) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const resetFilters = () => {
    setCategory("All");
    setQuery("");
  };

  // Details modal → booking: require login first (backend mode), else open booking directly.
  const handleContinue = (vehicle) => {
    setSelected(null);
    if (!apiDown && !user) {
      setPendingVehicle(vehicle);
      setAuthMode("login");
      notify("Log in to book this ride.");
      return;
    }
    setBookingVehicle(vehicle);
  };

  const handleAuthed = async (fn) => {
    const u = await fn;
    setAuthMode(null);
    notify(`Welcome${u?.name ? `, ${u.name}` : ""}!`);
    if (pendingVehicle) {
      setBookingVehicle(pendingVehicle);
      setPendingVehicle(null);
    }
    return u;
  };

  return (
    <div className="sr-app">
      <Topline />
      <Navbar
        mobileMenu={mobileMenu}
        onToggleMenu={() => setMobileMenu((v) => !v)}
        onCloseMenu={() => setMobileMenu(false)}
        onNotify={notify}
        onBookRide={() => scrollTo("booking")}
        user={user}
        authLoading={authLoading}
        onLoginClick={() => setAuthMode("login")}
        onLogout={async () => {
          await logout();
          notify("Logged out.");
        }}
        onMyBookings={() => scrollTo("my-bookings")}
      />

      <main>
        <Hero onFindRide={() => scrollTo("booking")} onExplore={() => scrollTo("destinations")} />
        <BookingSearch onSearch={handleSearch} />

        <VehicleGrid
          vehicles={filteredVehicles}
          category={category}
          onCategoryChange={setCategory}
          query={query}
          onQueryChange={setQuery}
          saved={saved}
          onToggleSave={toggleSave}
          onView={setSelected}
          onReset={resetFilters}
        />
        <Destinations onNotify={notify} />
        <Experience onHowItWorks={() => scrollTo("how-it-works")} />
        <HowItWorks />
        <CallToAction onExplore={() => scrollTo("fleet")} />
        {user && !apiDown && (
          <MyBookings user={user} refreshKey={bookingsTick} onLoginClick={() => setAuthMode("login")} />
        )}
        <AdminPortal user={user} apiDown={apiDown} onLoginClick={() => setAuthMode("login")} notify={notify} />
      </main>

      <Footer
        onSelectCategory={(c) => {
          setCategory(c);
          scrollTo("fleet");
        }}
        onShowAdmin={() => scrollTo("admin-preview")}
        onNotify={notify}
      />

      <VehicleDetailsModal
        vehicle={selected}
        onClose={() => setSelected(null)}
        onContinue={() => handleContinue(selected)}
      />
      {bookingVehicle && (
        <BookingModal
          vehicle={bookingVehicle}
          user={user}
          apiDown={apiDown}
          onClose={() => setBookingVehicle(null)}
          onBooked={() => setBookingsTick((t) => t + 1)}
          notify={notify}
        />
      )}
      {authMode && (
        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => {
            setAuthMode(null);
            setPendingVehicle(null);
          }}
          onLogin={(phone, password) => handleAuthed(login(phone, password))}
          onRegister={(phone, password, name) => handleAuthed(register(phone, password, name))}
        />
      )}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <CircleHelp size={16} aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}

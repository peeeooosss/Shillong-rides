import { useState } from "react";
import { LogIn, UserPlus, X } from "lucide-react";

function normalize(phone) {
  const d = String(phone).replace(/\D/g, "");
  return d.length === 12 && d.startsWith("91") ? d.slice(2) : d;
}

export default function AuthModal({ mode, onModeChange, onClose, onLogin, onRegister }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "register") await onRegister(normalize(phone), password, name.trim());
      else await onLogin(normalize(phone), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div className="modal-body">
          <div className="modal-head">
            <div>
              <div className="vehicle-type">{mode === "register" ? "Create account" : "Welcome back"}</div>
              <h3 id="auth-title">{mode === "register" ? "Sign up" : "Log in"}</h3>
            </div>
            <button className="close-btn" aria-label="Close" onClick={onClose}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="modal-copy">
            Use your mobile number and password. Staff accounts can access the admin portal.
          </p>
          <form onSubmit={submit}>
            {mode === "register" && (
              <div className="field" style={{ marginBottom: 10 }}>
                <label htmlFor="auth-name">Your name</label>
                <input id="auth-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" />
              </div>
            )}
            <div className="field" style={{ marginBottom: 10 }}>
              <label htmlFor="auth-phone">Mobile number</label>
              <input
                id="auth-phone" inputMode="numeric" value={phone} required
                onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" autoComplete="tel"
              />
            </div>
            <div className="field" style={{ marginBottom: 10 }}>
              <label htmlFor="auth-pass">Password</label>
              <input
                id="auth-pass" type="password" value={password} required minLength={6}
                onChange={(e) => setPassword(e.target.value)} placeholder={mode === "register" ? "Min 6 characters" : "Your password"} autoComplete={mode === "register" ? "new-password" : "current-password"}
              />
            </div>
            {error && <p className="field-error" role="alert">{error}</p>}
            <div className="modal-actions" style={{ marginTop: 14 }}>
              <button type="button" className="btn btn-light" onClick={() => onModeChange(mode === "register" ? "login" : "register")}>
                {mode === "register" ? <><LogIn size={15} aria-hidden="true" /> Have an account? Log in</> : <><UserPlus size={15} aria-hidden="true" /> New here? Sign up</>}
              </button>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Please wait…" : mode === "register" ? "Create account" : "Log in"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

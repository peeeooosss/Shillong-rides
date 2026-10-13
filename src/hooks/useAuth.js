import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";

/** Session state. apiDown=true when the backend/database is not reachable (demo mode). */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiDown, setApiDown] = useState(false);

  useEffect(() => {
    api("/api/auth/me")
      .then((d) => setUser(d.user))
      .catch((e) => {
        if (e instanceof TypeError) setApiDown(true); // network fail → no backend
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (phone, password) => {
    const d = await api("/api/auth/login", { method: "POST", body: { phone, password } });
    setUser(d.user);
    return d.user;
  }, []);

  const register = useCallback(async (phone, password, name) => {
    const d = await api("/api/auth/register", { method: "POST", body: { phone, password, name } });
    setUser(d.user);
    return d.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch { /* ignore */ }
    setUser(null);
  }, []);

  return { user, loading, apiDown, login, register, logout };
}

import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthValue } from "./auth-context";
import type { User } from "@/types";
import { setSession as persist, logout as clearSession } from "@/lib/auth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);          // ← eklendi

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    setToken(t);
    setUser(u ? (JSON.parse(u) as User) : null);
    setReady(true);                                    // ← yükleme tamam
  }, []);

  const login: AuthValue["login"] = (t, u) => {
    persist(t, u);
    setToken(t);
    setUser(u);
  };

  const logout: AuthValue["logout"] = () => {
    clearSession(); // localStorage temizler ve /login'e yönlendirir
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

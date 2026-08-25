import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "marvel_auth";
const DEFAULT_USERS = [
  { email: "admin@marvelglobal.com", password: "Admin123!", role: "admin", name: "Marvel Global Administrator" },
  { email: "customer@marvelglobal.com", password: "Customer123!", role: "customer", name: "Marvel Global Customer" },
];

function getStoredAuth() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) || window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredAuth);

  const login = (email, password, rememberMe = false) => {
    const account = DEFAULT_USERS.find((candidate) => candidate.email === email.trim().toLowerCase() && candidate.password === password);
    if (!account) return { success: false, message: "Invalid email address or password." };
    const authenticatedUser = { email: account.email, role: account.role, name: account.name };
    setUser(authenticatedUser);
    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    otherStorage.removeItem(STORAGE_KEY);
    return { success: true, user: authenticatedUser };
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), isAdmin: user?.role === "admin", isCustomer: user?.role === "customer", login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider.");
  return context;
}

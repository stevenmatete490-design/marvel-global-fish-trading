import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "marvel_auth";

const DEFAULT_USERS = [
  {
    email: "admin@marvelglobal.com",
    password: "Admin123!",
    role: "admin",
    name: "Marvel Global Administrator",
  },
  {
    email: "customer@marvelglobal.com",
    password: "Customer123!",
    role: "customer",
    name: "Marvel Global Customer",
  },
];

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredAuth);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email, password, rememberMe = false) => {
    const normalizedEmail = email.trim().toLowerCase();

    const matchedUser = DEFAULT_USERS.find(
      (account) =>
        account.email === normalizedEmail &&
        account.password === password
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "Invalid email address or password.",
      };
    }

    const authenticatedUser = {
      email: matchedUser.email,
      role: matchedUser.role,
      name: matchedUser.name,
    };

    setUser(authenticatedUser);

    if (!rememberMe) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(authenticatedUser)
      );
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }

    return {
      success: true,
      user: authenticatedUser,
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      isCustomer: user?.role === "customer",
      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
}
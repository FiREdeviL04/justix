import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jx_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("jx_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem("jx_token", authToken);
    localStorage.setItem("jx_user", JSON.stringify(authUser));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("jx_token");
    localStorage.removeItem("jx_user");
  };

  const value = useMemo(
    () => ({ token, user, login, logout, isAuthenticated: Boolean(token) }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

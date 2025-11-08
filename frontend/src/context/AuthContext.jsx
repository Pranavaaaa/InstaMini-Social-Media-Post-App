import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email, password) => {
    const data = await apiRequest("/users/login", { method: "POST", body: { email, password } });
    setToken(data.token);
    setUser(data.user);
  };

  const signup = async (firstname, lastname, email, password) => {
    const data = await apiRequest("/users/register", {
      method: "POST",
      body: { email, password, fullname: { firstname, lastname } },
    });
    return data;
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, signup, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}



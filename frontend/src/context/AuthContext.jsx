import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);
const validRoles = new Set(["student", "company", "admin"]);

const isValidUser = (user) => user && validRoles.has(user.role);

const getAuthPayload = (response) => response.data?.data || {};

const persistAuth = ({ token, user }) => {
  if (token) localStorage.setItem("placement_token", token);
  localStorage.setItem("placement_user", JSON.stringify(user));
};

const clearStoredAuth = () => {
  localStorage.removeItem("placement_user");
  localStorage.removeItem("placement_token");
};

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("placement_user");
    if (!stored) return null;
    const user = JSON.parse(stored);
    if (isValidUser(user)) return user;
    clearStoredAuth();
    return null;
  } catch {
    clearStoredAuth();
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("placement_token");
    if (!token) return;
    api.get("/auth/me")
      .then((res) => {
        const { user } = getAuthPayload(res);
        if (!isValidUser(user)) {
          clearStoredAuth();
          setUser(null);
          return;
        }
        setUser(user);
        localStorage.setItem("placement_user", JSON.stringify(user));
      })
      .catch(() => {
        clearStoredAuth();
        setUser(null);
      });
  }, []);

  const login = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", payload);
      const auth = getAuthPayload(res);
      if (!isValidUser(auth.user)) {
        throw new Error("Invalid user role returned by server");
      }
      persistAuth(auth);
      setUser(auth.user);
      return auth.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", payload);
      const auth = getAuthPayload(res);
      if (!isValidUser(auth.user)) {
        throw new Error("Invalid user role returned by server");
      }
      persistAuth(auth);
      setUser(auth.user);
      return auth.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

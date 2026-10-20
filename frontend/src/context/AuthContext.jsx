import React, { createContext, useContext, useState, useEffect } from "react";
import API_BASE_URL from "../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("ems_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("ems_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const currentToken = localStorage.getItem("ems_token");
      if (!currentToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/session`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("ems_user", JSON.stringify(data.user));
        } else {
          logout();
        }
      } catch (err) {
        console.error("Session verification failed:", err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("ems_user", JSON.stringify(userData));
    localStorage.setItem("ems_token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ems_user");
    localStorage.removeItem("ems_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

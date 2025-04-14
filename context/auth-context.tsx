"use client";

import React from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  setRole: (role: string) => void;
  getRole: () => string | null;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = React.useState<string | null>(
    typeof window !== "undefined" ? Cookies.get("token") || null : null
  );

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      Cookies.set("token", newToken);
    } else {
      Cookies.remove("token");
    }
  };

  const setRole = (role: string | null) => {
    if (role) {
      Cookies.set("role", role);
    } else {
      Cookies.remove("role");
    }
  };

  const getRole = () => {
    return Cookies.get("role") || null;
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, setToken, isAuthenticated, setRole, getRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

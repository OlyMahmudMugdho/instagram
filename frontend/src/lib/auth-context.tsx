"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, AuthResponse, LoginRequest, RegisterRequest } from "@/services/auth";

interface User {
  _id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await authService.getToken();
      if (res.success && res.user) {
        setUser(res.user as User);
      }
    } catch (e) {
      // Not logged in
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    const res = await authService.login(data);
    if (res.success && res.user) {
      setUser(res.user as User);
    } else {
      throw new Error(res.message || "Login failed");
    }
  };

  const register = async (data: RegisterRequest) => {
    const res = await authService.register(data);
    if (res.success && res.user) {
      setUser(res.user as User);
    } else {
      throw new Error(res.message || "Registration failed");
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
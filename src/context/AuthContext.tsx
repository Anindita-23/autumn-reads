import React, { createContext, useEffect, useState, ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import * as authService from "../services/authService";

export type Role = "reader" | "publisher" | null;

export interface AuthContextValue {
  user: User | null;
  role: Role;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    role: Exclude<Role, null>
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultValue: AuthContextValue = {
  user: null,
  role: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const r = await authService.getUserRole(u.uid);
          setRole(r);
        } catch (err) {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signup = async (
    email: string,
    password: string,
    r: Exclude<Role, null>
  ) => {
    await authService.signup(email, password, r);
  };

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
  };

  const logout = async () => {
    await authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{ user, role, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

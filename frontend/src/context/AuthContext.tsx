import {
  createContext,
  useContext,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import type {
  AuthUser,
  Permission,
} from "../types/auth";

import {
  loginRequest,
} from "../services/authService";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  hasPermission: (
    permission: Permission
  ) => boolean;
  markPasswordChanged: () => void;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] =
    useState<string | null>(() =>
      localStorage.getItem("arafir_token")
    );

  const [user, setUser] =
    useState<AuthUser | null>(() => {
      const storedUser =
        localStorage.getItem("arafir_user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    });

  async function login(
    email: string,
    password: string
  ) {
    const data =
      await loginRequest(email, password);

    localStorage.setItem(
      "arafir_token",
      data.token
    );

    localStorage.setItem(
      "arafir_user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("arafir_token");
    localStorage.removeItem("arafir_user");

    setToken(null);
    setUser(null);
  }

  function hasPermission(
    permission: Permission
  ) {
    return (
      user?.permissions.includes(permission) ??
      false
    );
  }

  function markPasswordChanged() {
    if (!user) return;

    const updatedUser: AuthUser = {
      ...user,
      mustChangePassword: false,
    };

    localStorage.setItem(
      "arafir_user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        login,
        logout,
        hasPermission,
        markPasswordChanged,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
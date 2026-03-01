import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { apiRequest, ApiUser, AuthResponse } from "../lib/api";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = "shop_token";
const USER_KEY = "shop_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function saveSession(token: string, user: ApiUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getInitialToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getInitialUser(): ApiUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as ApiUser;
  } catch {
    clearSession();
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getInitialToken());
  const [user, setUser] = useState<ApiUser | null>(getInitialUser());

  const setAuthData = (data: AuthResponse) => {
    setToken(data.accessToken);
    setUser(data.user);
    saveSession(data.accessToken, data.user);
  };

  const register = async (payload: RegisterPayload) => {
    const data = await apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setAuthData(data);
  };

  const login = async (payload: LoginPayload) => {
    const data = await apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setAuthData(data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearSession();
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAdmin: Boolean(user?.roles?.includes("ROLE_ADMIN")),
      register,
      login,
      logout,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

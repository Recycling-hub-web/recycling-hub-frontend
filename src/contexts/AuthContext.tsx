'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from '../components/features/auth/services/authService';
import type { CurrentUser } from '../types/auth';

type AuthContextValue = {
  user: CurrentUser | null;
  /** True while the initial session check (on page load) is in flight. */
  loading: boolean;
  login: (email: string, password: string) => ReturnType<typeof loginRequest>;
  /** Call after a successful login/OTP verification to load the user. */
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const me = await getCurrentUser();
    setUser(me);
  }, []);

  // Auth is an httpOnly cookie now — there's nothing readable in JS to
  // check before deciding whether to call the API, so this always hits
  // /accounts/me/ and treats any failure (no cookie, expired session) as
  // logged-out.
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login: loginRequest, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export { AuthProvider, useAuth };

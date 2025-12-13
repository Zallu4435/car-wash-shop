'use client';

import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';
import { useCurrentUser, useLogout } from '@/api/domains/auth/queries';
import type { AuthUser } from '@/types/auth';
import { setAccessToken, subscribeToken } from '@/state/authState';

interface AuthContextValue {
  user: AuthUser | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  role: AuthUser['role'] | undefined;
  setAuth: (auth: { user: AuthUser; token: string }) => void;
  logout: () => void;
}

const COOKIE_IS_LOGGED = 'auth_is_logged';
const COOKIE_ROLE = 'auth_role';

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: fetchedUser, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();

  // Initialize token from sessionStorage on mount (isolated per tab)
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem('auth_access_token');
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<AuthUser | undefined>(undefined);

  // Initialize global token state from localStorage on mount
  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, []);

  // Keep user in sync with fetched user when not explicitly set via setAuth
  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  // Reflect token to global accessor (axios interceptor reads from here)
  useEffect(() => {
    setAccessToken(accessToken);
  }, [accessToken]);

  // Listen for external token updates (e.g., refresh in interceptor)
  useEffect(() => {
    const unsubscribe = subscribeToken((t) => {
      setAccessTokenState(t);
    });
    return unsubscribe;
  }, []);

  // Sync minimal auth info for middleware
  useEffect(() => {
    if (user) {
      setCookie(COOKIE_IS_LOGGED, 'true');
      if (user.role) setCookie(COOKIE_ROLE, String(user.role));
    } else {
      deleteCookie(COOKIE_IS_LOGGED);
      deleteCookie(COOKIE_ROLE);
    }
  }, [user]);

  const isAuthenticated = !!user && !!accessToken;

  const value: AuthContextValue = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    accessToken,
    role: user?.role,
    setAuth: ({ user: newUser, token }) => {
      setUser(newUser);
      setAccessTokenState(token);
    },
    logout: () => {
      setAccessTokenState(null);
      setUser(undefined);
      deleteCookie(COOKIE_IS_LOGGED);
      deleteCookie(COOKIE_ROLE);
      // Clear token from sessionStorage
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem('auth_access_token');
        } catch (error) {
          console.error('Failed to clear token from sessionStorage:', error);
        }
      }
      logoutMutation.mutate();
    },
  }), [user, isLoading, isAuthenticated, accessToken, logoutMutation]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

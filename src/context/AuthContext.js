import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const AuthContext = createContext(null);

function extractToken(payload) {
  const direct = payload?.token || payload?.accessToken || payload?.access_token || payload?.jwt || null;
  if (direct) return direct;

  const nested = payload?.data || payload?.auth || payload?.session || payload?.tokens || payload?.result || null;
  if (!nested || typeof nested !== 'object') return null;

  return nested?.token || nested?.accessToken || nested?.access_token || nested?.jwt || nested?.idToken || nested?.id_token || null;
}

function extractUser(payload) {
  const direct = payload?.user || payload?.profile || payload?.me || null;
  if (direct) return direct;

  const nested = payload?.data || payload?.auth || payload?.session || payload?.result || null;
  if (!nested || typeof nested !== 'object') return null;

  return nested?.user || nested?.profile || nested?.me || null;
}

export function AuthProvider({ children }) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;

    let mounted = true;

    const hydrate = async () => {
      try {
        const savedToken = token;
        const savedUser = user || null;
        console.log('[auth] hydrate parsed token/user:', Boolean(savedToken), Boolean(savedUser));
        if (!savedToken) return;

        // Prefer server-verified profile when available.
        try {
          const me = await authService.getMe(savedToken);
          if (!mounted) return;
          setSession({ token: savedToken, user: me || savedUser || null });
          return;
        } catch {
          if (!mounted) return;
          if (savedToken) {
            return;
          }
        }
      } catch {
        // ignore corrupted local session state
      } finally {
        if (mounted) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      mounted = false;
    };
  }, [hasHydrated, token, user, setSession]);

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });
      console.log('[auth] login result keys:', result && typeof result === 'object' ? Object.keys(result) : typeof result);
      const nextUser = extractUser(result);
      const nextToken = extractToken(result);
      console.log('[auth] login parsed token/user:', Boolean(nextToken), Boolean(nextUser));
      if (nextToken) {
        setSession({ token: nextToken, user: nextUser });
        console.log('[auth] session persisted');
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const signup = useCallback(async ({ fullName, email, password }) => {
    setIsLoading(true);

    try {
      const result = await authService.signup({ fullName, email, password });

      const signupToken = extractToken(result);
      const signupUser = extractUser(result);
      if (signupToken) {
        setSession({ token: signupToken, user: signupUser });
        return result;
      }

      const loginResult = await authService.login({ email, password });
      const nextUser = extractUser(loginResult);
      const nextToken = extractToken(loginResult);
      if (nextToken) {
        setSession({ token: nextToken, user: nextUser });
      }
      return loginResult;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const logout = useCallback(async () => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isHydrating,
      isAuthenticated: Boolean(token),
      login,
      signup,
      logout,
    }),
    [user, token, isLoading, isHydrating, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

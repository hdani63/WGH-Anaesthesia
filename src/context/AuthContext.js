import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  const isGuest = useAuthStore((s) => s.isGuest);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setGuestMode = useAuthStore((s) => s.setGuestMode);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const checkedTokenRef = useRef(null);

  useEffect(() => {
    if (!hasHydrated) return;

    let mounted = true;

    const hydrate = async () => {
      try {
        const savedToken = token;
        const savedUser = user || null;

        // Guest sessions don't need server verification
        if (isGuest) {
          return;
        }

        if (!savedToken) {
          checkedTokenRef.current = null;
          return;
        }
        if (checkedTokenRef.current === savedToken) return;
        checkedTokenRef.current = savedToken;

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
  }, [hasHydrated, token, user, isGuest, setSession]);

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });
      const nextUser = extractUser(result);
      const nextToken = extractToken(result);
      if (nextToken) {
        // Clear any guest session before setting authenticated session
        setSession({ token: nextToken, user: nextUser });
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

  /**
   * Enters guest mode — no server call required.
   * Complies with Apple App Store Review Guideline 5.1.1 which requires
   * apps to allow users to access core functionality without creating an account.
   */
  const continueAsGuest = useCallback(() => {
    setGuestMode(true);
  }, [setGuestMode]);

  const logout = useCallback(async () => {
    clearSession();
  }, [clearSession]);

  const deleteAccount = useCallback(async () => {
    const userId = user?._id || user?.id || user?.userId;
    if (!userId) {
      throw new Error('Unable to find user ID.');
    }

    await authService.deleteUser(userId, token);
    clearSession();
  }, [user, token, clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isGuest,
      isLoading,
      isHydrating,
      isAuthenticated: Boolean(token) || isGuest,
      isFullyAuthenticated: Boolean(token),
      login,
      signup,
      continueAsGuest,
      logout,
      deleteAccount,
    }),
    [user, token, isGuest, isLoading, isHydrating, login, signup, continueAsGuest, logout, deleteAccount]
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

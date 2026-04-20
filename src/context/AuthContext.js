import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });
      setUser(result?.user || null);
      setToken(result?.token || null);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async ({ fullName, email, password }) => {
    setIsLoading(true);

    try {
      const result = await authService.signup({ fullName, email, password });

      if (result?.token && result?.user) {
        setUser(result.user);
        setToken(result.token);
        return result;
      }

      const loginResult = await authService.login({ email, password });
      setUser(loginResult?.user || null);
      setToken(loginResult?.token || null);
      return loginResult;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      signup,
      logout,
    }),
    [user, token, isLoading, login, signup, logout]
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

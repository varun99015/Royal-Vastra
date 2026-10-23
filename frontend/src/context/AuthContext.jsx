import { createContext, useContext, useState, useCallback } from 'react';
import { adminLogin as apiAdminLogin } from '../services/products.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('rv_token') || null;
    } catch {
      return null;
    }
  });

  const [adminInfo, setAdminInfo] = useState(() => {
    try {
      const stored = localStorage.getItem('rv_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const res = await apiAdminLogin(email, password);
    if (res.success && res.data) {
      const newToken = res.data.token;
      const admin = res.data.admin;
      setToken(newToken);
      setAdminInfo(admin);
      localStorage.setItem('rv_token', newToken);
      localStorage.setItem('rv_admin', JSON.stringify(admin));
      return { success: true };
    }
    throw new Error(res.error || 'Login failed');
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdminInfo(null);
    try {
      localStorage.removeItem('rv_token');
      localStorage.removeItem('rv_admin');
    } catch {
      // ignore
    }
  }, []);

  const value = {
    token,
    adminInfo,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import { useCallback, useEffect, useMemo, useState, createContext, useContext } from 'react';
import { apiClient } from '../lib/apiClient';

const AuthContext = createContext(null);

const SESSION_STORAGE_KEY = 'shadowcoder_user_session';

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  // Restore & sync user session on application load
  const fetchMe = useCallback(async () => {
    try {
      const data = await apiClient('/auth/me');
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
      }
    } catch (err) {
      // Keep existing stored user on network errors or offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const register = useCallback(async ({ name, email, password, role, track }) => {
    const data = await apiClient('/auth/register', {
      method: 'POST',
      body: { name, email, password, role, track },
    });
    if (data && data.user) {
      setUser(data.user);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
    }
    return data.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data && data.user) {
      setUser(data.user);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
    }
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  const triggerOAuth = useCallback((provider) => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${backendUrl}/auth/${provider}`;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isStudent: user?.role === 'student',
      login,
      register,
      logout,
      triggerOAuth,
      refreshUser: fetchMe,
    }),
    [user, loading, login, register, logout, triggerOAuth, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
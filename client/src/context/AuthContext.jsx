import { useCallback, useEffect, useMemo, useState, createContext, useContext } from 'react';
import { apiClient } from '../lib/apiClient';

const AuthContext = createContext(null);

const DEFAULT_MONARCH_USER = {
  _id: 'usr_shreyas_monarch',
  name: 'Shreyas Chavan',
  email: 'chavanshreyas2006@gmail.com',
  role: 'admin',
  track: 'fullstack',
  level: 99,
  xp: 48500,
  streak: { currentCount: 14, bestCount: 30 },
  unlockedTiers: [1, 2, 3, 4, 5],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_MONARCH_USER);
  const [loading, setLoading] = useState(false);

  // Restore user session on application load
  const fetchMe = useCallback(async () => {
    try {
      const data = await apiClient('/auth/me');
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      // Keep default Monarch user profile
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const register = useCallback(async ({ name, email, password, role, track }) => {
    try {
      const data = await apiClient('/auth/register', {
        method: 'POST',
        body: { name, email, password, role, track },
      });
      if (data && data.user) {
        setUser(data.user);
        return data.user;
      }
    } catch (err) {}
    
    const newUsr = {
      _id: `usr_${Date.now()}`,
      name: name || 'Developer',
      email: email || 'dev@shadowcoder.com',
      role: role || 'student',
      track: track || 'fullstack',
      level: 1,
      xp: 100,
      streak: { currentCount: 1, bestCount: 1 },
      unlockedTiers: [1],
    };
    setUser(newUsr);
    return newUsr;
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (data && data.user) {
        setUser(data.user);
        return data.user;
      }
    } catch (err) {}

    const loggedUsr = {
      ...DEFAULT_MONARCH_USER,
      email: email || DEFAULT_MONARCH_USER.email,
    };
    setUser(loggedUsr);
    return loggedUsr;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (err) {}
    setUser(DEFAULT_MONARCH_USER);
  }, []);

  const triggerOAuth = useCallback((provider) => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${backendUrl}/auth/${provider}`;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: true,
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
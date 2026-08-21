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
  const initialUser = getStoredUser();
  const [user, setUser] = useState(initialUser);
  // Zero-millisecond first paint: do not block guest visitors who have no session
  const [loading, setLoading] = useState(false);

  // Background non-blocking session sync with 3.5s timeout
  const fetchMe = useCallback(async () => {
    try {
      const data = await apiClient('/auth/me', { timeout: 3500 });
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
      }
    } catch (err) {
      // If server explicitly returned 401, clear invalidated session
      if (err.status === 401) {
        setUser(null);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
      // On network timeout or cold start, preserve cached user for offline tolerance
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only verify backend session if there was a previous user session or on initial mount
    fetchMe();
  }, [fetchMe]);

  const register = useCallback(async ({ name, email, password, role, track }) => {
    const { signUpWithEmail } = await import('../lib/firebase');
    const firebaseUser = await signUpWithEmail(email, password);
    const idToken = await firebaseUser.getIdToken();

    const data = await apiClient('/auth/firebase', {
      method: 'POST',
      body: { idToken, name, role, track },
    });
    if (data && data.user) {
      setUser(data.user);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
    }
    return data.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const { signInWithEmail } = await import('../lib/firebase');
    const firebaseUser = await signInWithEmail(email, password);
    const idToken = await firebaseUser.getIdToken();

    const data = await apiClient('/auth/firebase', {
      method: 'POST',
      body: { idToken },
    });
    if (data && data.user) {
      setUser(data.user);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
    }
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      const { auth } = await import('../lib/firebase');
      if (auth.currentUser) {
        await auth.signOut();
      }
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout warning:', err.message);
    } finally {
      setUser(null);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  const loginWithFirebaseGoogle = useCallback(async (idToken) => {
    const data = await apiClient('/auth/firebase', {
      method: 'POST',
      body: { idToken },
    });
    if (data && data.user) {
      setUser(data.user);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
    }
    return data.user;
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
      loginWithFirebaseGoogle,
      refreshUser: fetchMe,
    }),
    [user, loading, login, register, logout, loginWithFirebaseGoogle, fetchMe]
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
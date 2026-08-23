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
    fetchMe();
  }, [fetchMe]);

  const register = useCallback(async ({ name, email, password, role, track }) => {
    const { signUpWithEmail } = await import('../lib/firebase');
    const firebaseUser = await signUpWithEmail(email, password);
    const idToken = await firebaseUser.getIdToken();

    try {
      const data = await apiClient('/auth/firebase', {
        method: 'POST',
        body: { idToken, name, role, track },
        timeout: 15000,
      });
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (err) {
      // Fallback authorized session from verified Firebase user
      const fallback = {
        _id: firebaseUser.uid,
        name: name || firebaseUser.email?.split('@')[0],
        email: firebaseUser.email,
        role: role || 'student',
        track: track || 'fullstack',
        level: 1,
        xp: 150,
        tier: 1,
        hunterRank: 'E-Rank Novice',
        streakDays: 1,
      };
      setUser(fallback);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const { signInWithEmail } = await import('../lib/firebase');
    const firebaseUser = await signInWithEmail(email, password);
    const idToken = await firebaseUser.getIdToken();

    try {
      const data = await apiClient('/auth/firebase', {
        method: 'POST',
        body: { idToken },
        timeout: 15000,
      });
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (err) {
      // Fallback authorized session from verified Firebase user
      const fallback = {
        _id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        email: firebaseUser.email,
        role: 'student',
        track: 'fullstack',
        level: 1,
        xp: 150,
        tier: 1,
        hunterRank: 'E-Rank Novice',
        streakDays: 1,
      };
      setUser(fallback);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { auth } = await import('../lib/firebase');
      if (auth.currentUser) {
        await auth.signOut();
      }
      await apiClient('/auth/logout', { method: 'POST', timeout: 4000 });
    } catch (err) {
      console.warn('Logout warning:', err.message);
    } finally {
      setUser(null);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  const loginWithFirebaseGoogle = useCallback(async (idToken, fbUser = null) => {
    try {
      const data = await apiClient('/auth/firebase', {
        method: 'POST',
        body: { idToken },
        timeout: 15000,
      });
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (err) {
      console.warn('Backend sync warning during Google sign-in:', err.message);
      // If Firebase verified the Google account, log the user in immediately without failing
      if (fbUser) {
        const fallback = {
          _id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Developer',
          email: fbUser.email,
          role: 'student',
          track: 'fullstack',
          level: 1,
          xp: 150,
          tier: 1,
          hunterRank: 'E-Rank Novice',
          streakDays: 1,
        };
        setUser(fallback);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(fallback));
        return fallback;
      }
      throw err;
    }
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
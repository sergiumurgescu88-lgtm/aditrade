import { useState, useCallback } from 'react';

export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface AuthState {
  user: MockUser | null;
  loading: boolean;
  error: string | null;
}

// Preset mock user for seamless demonstration
export const DEMO_USER: MockUser = {
  uid: 'usr_sergiu_88',
  email: 'sergiu.murgescu88@gmail.com',
  displayName: 'Sergiu Murgescu',
  photoURL: ''
};

export const useAuth = () => {
  // Check if simulated user was previously stored in localStorage
  const [user, setUser] = useState<MockUser | null>(() => {
    try {
      const stored = localStorage.getItem('trinity_mock_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithGoogle = useCallback(async (customUser?: MockUser) => {
    setError(null);
    setLoading(true);
    try {
      // Simulate micro-delay for realistic UI feedback
      await new Promise((resolve) => setTimeout(resolve, 200));
      const targetUser = customUser || DEMO_USER;
      setUser(targetUser);
      try {
        localStorage.setItem('trinity_mock_user', JSON.stringify(targetUser));
      } catch {
        // ignore
      }
      return targetUser;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Eroare la autentificarea simulată';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setUser(null);
      try {
        localStorage.removeItem('trinity_mock_user');
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Eroare la delogare';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user
  };
};

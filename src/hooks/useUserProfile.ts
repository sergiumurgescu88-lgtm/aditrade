import { useState, useEffect, useCallback } from 'react';
import { MockUser } from './useAuth';

export type SubscriptionTier = 'FREE' | 'VIP_SIGNALS' | 'COPY_TRADING_PRO';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  subscriptionTier: SubscriptionTier;
  cTraderConnected: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const useUserProfile = (user: MockUser | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (!user) return null;
    try {
      const stored = localStorage.getItem(`trinity_profile_${user.uid}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      subscriptionTier: 'COPY_TRADING_PRO',
      cTraderConnected: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const stored = localStorage.getItem(`trinity_profile_${user.uid}`);
      if (stored) {
        setProfile(JSON.parse(stored));
        return;
      }
    } catch {
      // ignore
    }

    // Default mock profile with COPY_TRADING_PRO as requested
    const defaultProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      subscriptionTier: 'COPY_TRADING_PRO',
      cTraderConnected: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProfile(defaultProfile);
    try {
      localStorage.setItem(`trinity_profile_${user.uid}`, JSON.stringify(defaultProfile));
    } catch {
      // ignore
    }
  }, [user]);

  const updateSubscriptionTier = useCallback(
    async (tier: SubscriptionTier) => {
      if (!user) return;
      setLoading(true);
      try {
        setProfile((prev) => {
          if (!prev) return null;
          const updated: UserProfile = {
            ...prev,
            subscriptionTier: tier,
            updatedAt: new Date().toISOString()
          };
          try {
            localStorage.setItem(`trinity_profile_${user.uid}`, JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const toggleCTraderConnection = useCallback(
    async (connected: boolean) => {
      if (!user) return;
      setLoading(true);
      try {
        setProfile((prev) => {
          if (!prev) return null;
          const updated: UserProfile = {
            ...prev,
            cTraderConnected: connected,
            updatedAt: new Date().toISOString()
          };
          try {
            localStorage.setItem(`trinity_profile_${user.uid}`, JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return {
    profile,
    loading,
    error,
    updateSubscriptionTier,
    toggleCTraderConnection
  };
};

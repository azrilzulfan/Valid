// src/lib/useCurrentUser.ts
import { useState, useEffect } from "react";

export interface CurrentUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  vocationField: string;
  reputationPoints: number;
  badgeLevel: string | null;
  bio: string;
  location: string;
  phoneNumber: string;
  verifierStatus: string | null;
}

export function useCurrentUser(): {
  user: CurrentUser | null;
  loading: boolean;
  reload: () => void;
} {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("valid_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, [tick]);

  const reload = () => setTick((t) => t + 1);

  return { user, loading, reload };
}

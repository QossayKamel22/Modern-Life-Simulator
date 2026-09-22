"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { subscribeToAuthChanges } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export interface AuthStatus {
  user: User | null;
  loading: boolean;
  firebaseConfigured: boolean;
}

export function useAuth(): AuthStatus {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading, firebaseConfigured: isFirebaseConfigured };
}

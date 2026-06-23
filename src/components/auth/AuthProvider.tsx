"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/database.types";
import type { AuthContextValue } from "@/lib/auth/types";
import { migrateLocalData } from "@/lib/auth/migrateLocalData";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Failed to load profile:", error.message);
        setProfile(null);
        return null;
      }

      setProfile(data);
      return data;
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const loaded = await fetchProfile(user.id);
    if (loaded) {
      await migrateLocalData(user.id);
      await fetchProfile(user.id);
    }
  }, [fetchProfile, user]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { user: sessionUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUser(sessionUser);

      if (sessionUser) {
        await fetchProfile(sessionUser.id);
      }

      setIsLoading(false);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (nextUser) {
        await fetchProfile(nextUser.id);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  useEffect(() => {
    if (!user?.id || !profile?.id) return;

    let active = true;

    void (async () => {
      await migrateLocalData(user.id);
      if (active) await fetchProfile(user.id);
    })();

    return () => {
      active = false;
    };
  }, [user?.id, profile?.id, fetchProfile]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading,
      refreshProfile,
    }),
    [user, profile, isLoading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

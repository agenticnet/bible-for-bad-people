import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/database.types";

export interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

export const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string): boolean {
  return USERNAME_REGEX.test(normalizeUsername(value));
}

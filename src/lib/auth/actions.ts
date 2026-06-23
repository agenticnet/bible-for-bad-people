"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const normalized = normalizeUsername(username);
  if (!isValidUsername(normalized)) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalized)
    .maybeSingle();

  if (error) return false;
  return !data;
}

export async function createProfile(username: string): Promise<{ error?: string }> {
  const normalized = normalizeUsername(username);
  if (!isValidUsername(normalized)) {
    return { error: "Username must be 3–20 characters: lowercase letters, numbers, underscores." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a profile." };
  }

  const available = await checkUsernameAvailable(normalized);
  if (!available) {
    return { error: "Username is already taken." };
  }

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    username: normalized,
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function getProfileByUsername(username: string) {
  const normalized = normalizeUsername(username);
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", normalized)
    .maybeSingle();

  if (error || !profile) return null;

  const [{ count: confessionCount }, { count: sinCount }, { count: purchaseCount }] =
    await Promise.all([
      supabase
        .from("confessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id),
      supabase
        .from("sin_log_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id),
      supabase
        .from("indulgence_purchases")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id),
    ]);

  return {
    profile,
    stats: {
      confessionCount: confessionCount ?? 0,
      sinCount: sinCount ?? 0,
      purchaseCount: purchaseCount ?? 0,
    },
  };
}

export async function getLeaderboardProfiles(limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, salvation_score")
    .order("salvation_score", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}

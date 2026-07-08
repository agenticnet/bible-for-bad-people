"use server";

import { createClient } from "@/lib/supabase/server";
import {
  isValidUsername,
  normalizeUsername,
  type OnboardingPreferences,
} from "@/lib/auth/types";
import {
  generateCertificateId,
  INDULGENCE_PRODUCTS,
} from "@/lib/indulgenceProducts";

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

export async function ensureProfileFromMetadata(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return {};

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return {};

  const pending = user.user_metadata?.pending_username;
  if (typeof pending !== "string") return {};

  return createProfile(pending);
}

async function grantStarterPack(
  userId: string,
  starterPackId: string
): Promise<void> {
  const product = INDULGENCE_PRODUCTS.find((p) => p.id === starterPackId);
  if (!product) return;

  const supabase = await createClient();
  const boost = product.leaderboardBoost ?? 0;

  await supabase.from("indulgence_purchases").insert({
    user_id: userId,
    product_id: product.id,
    product_name: product.name,
    certificate_id: generateCertificateId(),
    price_paid: product.price,
    purchased_at: new Date().toISOString(),
  });

  if (boost > 0) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("salvation_score, total_spent")
      .eq("id", userId)
      .maybeSingle();

    if (profile) {
      await supabase
        .from("profiles")
        .update({
          salvation_score: profile.salvation_score + boost,
          total_spent: Number(profile.total_spent) + product.price,
        })
        .eq("id", userId);
    }
  }
}

export async function createProfile(
  username: string,
  preferences?: OnboardingPreferences
): Promise<{ error?: string }> {
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

  const insertData = {
    id: user.id,
    username: normalized,
    display_name: preferences?.displayName ?? null,
    favorite_chambers: preferences?.favoriteChambers ?? [],
    chamber_order: preferences?.chamberOrder ?? [],
    default_accent: preferences?.defaultAccent ?? "wine",
    notification_prefs: preferences?.notificationPrefs ?? {
      weeklyDigest: true,
      sinReminders: true,
      smiteAlerts: false,
    },
    starter_pack_id: preferences?.starterPackId ?? null,
    onboarding_completed_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").insert(insertData);

  if (error) {
    return { error: error.message };
  }

  if (preferences?.starterPackId) {
    await grantStarterPack(user.id, preferences.starterPackId);
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
    .select("id, username, salvation_score, display_name")
    .order("salvation_score", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}

"use server";

import { createClient } from "@/lib/supabase/server";
import type { ContributedSin, SinLogItem } from "@/lib/sinTypes";
import { recalculateAndPersistSalvationScore } from "@/lib/data/indulgences";

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function fetchSinLog(): Promise<SinLogItem[]> {
  const userId = await requireUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sin_log_items")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    sinId: row.sin_id ?? undefined,
    petty: row.petty,
    translation: row.translation,
    completedAt: row.completed_at,
    source: row.source as SinLogItem["source"],
  }));
}

export async function addSinLogItem(
  item: Omit<SinLogItem, "id">
): Promise<{ error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in to log sins." };

  const supabase = await createClient();
  const { error } = await supabase.from("sin_log_items").insert({
    user_id: userId,
    sin_id: item.sinId ?? null,
    petty: item.petty,
    translation: item.translation,
    source: item.source,
    completed_at: item.completedAt,
  });

  if (error) return { error: error.message };

  await recalculateSalvationScore(userId);
  return {};
}

export async function clearSinLog(): Promise<{ error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in required." };

  const supabase = await createClient();
  const { error } = await supabase.from("sin_log_items").delete().eq("user_id", userId);
  if (error) return { error: error.message };

  await recalculateSalvationScore(userId);
  return {};
}

export async function fetchCommunitySins(): Promise<ContributedSin[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sin_community_items")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    petty: row.petty,
    translation: row.translation,
    category: row.category as ContributedSin["category"],
    difficulty: row.difficulty as ContributedSin["difficulty"],
    submittedAt: row.submitted_at,
  }));
}

export async function contributeSin(
  sin: Omit<ContributedSin, "id" | "submittedAt">
): Promise<{ error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in to contribute." };

  const supabase = await createClient();
  const { error } = await supabase.from("sin_community_items").insert({
    user_id: userId,
    petty: sin.petty,
    translation: sin.translation,
    category: sin.category,
    difficulty: sin.difficulty,
  });

  if (error) return { error: error.message };
  return {};
}

export async function fetchDailyCompleted(dateKey: string): Promise<string[]> {
  const userId = await requireUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("sin_daily_done")
    .select("sin_ids")
    .eq("user_id", userId)
    .eq("date_key", dateKey)
    .maybeSingle();

  const ids = data?.sin_ids;
  return Array.isArray(ids) ? (ids as string[]) : [];
}

export async function saveDailyCompleted(
  dateKey: string,
  sinIds: string[]
): Promise<{ error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in required." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("sin_daily_done")
    .select("id")
    .eq("user_id", userId)
    .eq("date_key", dateKey)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("sin_daily_done")
      .update({ sin_ids: sinIds })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("sin_daily_done").insert({
      user_id: userId,
      date_key: dateKey,
      sin_ids: sinIds,
    });
    if (error) return { error: error.message };
  }

  return {};
}

async function recalculateSalvationScore(userId: string): Promise<void> {
  await recalculateAndPersistSalvationScore(userId);
}

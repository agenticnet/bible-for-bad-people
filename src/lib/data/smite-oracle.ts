"use server";

import { createClient } from "@/lib/supabase/server";
import type { SmiteRecord } from "@/lib/smiteTypes";
import type { DailyReading } from "@/lib/oracleTypes";
import type { Json } from "@/lib/database.types";

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function fetchSmiteHistory(): Promise<SmiteRecord[]> {
  const userId = await requireUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("smite_history")
    .select("*")
    .eq("user_id", userId)
    .order("smote_at", { ascending: false })
    .limit(50);

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    target: row.target as SmiteRecord["target"],
    targetLabel: row.target_label,
    customName: row.custom_name ?? undefined,
    plague: row.plague as SmiteRecord["plague"],
    tier: row.tier as SmiteRecord["tier"],
    result: row.result,
    visualDescription: row.visual_description ?? undefined,
    smoteAt: row.smote_at,
    pricePaid: Number(row.price_paid),
  }));
}

export async function addSmiteRecord(
  record: Omit<SmiteRecord, "id">
): Promise<{ record?: SmiteRecord; error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in to smite." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("smite_history")
    .insert({
      user_id: userId,
      target: record.target,
      target_label: record.targetLabel,
      custom_name: record.customName ?? null,
      plague: record.plague,
      tier: record.tier,
      result: record.result,
      visual_description: record.visualDescription ?? null,
      smote_at: record.smoteAt,
      price_paid: record.pricePaid,
    })
    .select("*")
    .single();

  if (error || !data) return { error: error?.message ?? "Failed to save smite." };

  return {
    record: {
      id: data.id,
      target: data.target as SmiteRecord["target"],
      targetLabel: data.target_label,
      customName: data.custom_name ?? undefined,
      plague: data.plague as SmiteRecord["plague"],
      tier: data.tier as SmiteRecord["tier"],
      result: data.result,
      visualDescription: data.visual_description ?? undefined,
      smoteAt: data.smote_at,
      pricePaid: Number(data.price_paid),
    },
  };
}

export async function fetchDailySmiteCount(dateKey: string): Promise<number> {
  const userId = await requireUserId();
  if (!userId) return 0;

  const supabase = await createClient();
  const { data } = await supabase
    .from("smite_daily_counts")
    .select("count")
    .eq("user_id", userId)
    .eq("date_key", dateKey)
    .maybeSingle();

  return data?.count ?? 0;
}

export async function incrementDailySmiteCount(
  dateKey: string
): Promise<{ count: number; error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { count: 0, error: "Sign in required." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("smite_daily_counts")
    .select("id, count")
    .eq("user_id", userId)
    .eq("date_key", dateKey)
    .maybeSingle();

  const nextCount = (existing?.count ?? 0) + 1;

  if (existing) {
    const { error } = await supabase
      .from("smite_daily_counts")
      .update({ count: nextCount })
      .eq("id", existing.id);
    if (error) return { count: existing.count, error: error.message };
  } else {
    const { error } = await supabase.from("smite_daily_counts").insert({
      user_id: userId,
      date_key: dateKey,
      count: nextCount,
    });
    if (error) return { count: 0, error: error.message };
  }

  return { count: nextCount };
}

export async function fetchOracleReading(dateKey: string): Promise<DailyReading | null> {
  const userId = await requireUserId();
  if (!userId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("oracle_readings")
    .select("*")
    .eq("user_id", userId)
    .eq("date_key", dateKey)
    .maybeSingle();

  if (error || !data) return null;

  return {
    dateKey: data.date_key,
    cards: data.cards as unknown as DailyReading["cards"],
    doomScore: data.doom_score,
    summary: data.summary,
    revealed: data.revealed,
  };
}

export async function saveOracleReading(
  reading: DailyReading
): Promise<{ error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in to save readings." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("oracle_readings")
    .select("id")
    .eq("user_id", userId)
    .eq("date_key", reading.dateKey)
    .maybeSingle();

  const payload = {
    user_id: userId,
    date_key: reading.dateKey,
    cards: reading.cards as unknown as Json,
    doom_score: reading.doomScore,
    summary: reading.summary,
    revealed: reading.revealed,
  };

  if (existing) {
    const { error } = await supabase
      .from("oracle_readings")
      .update(payload)
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("oracle_readings").insert(payload);
    if (error) return { error: error.message };
  }

  return {};
}

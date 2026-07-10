"use client";

import { createClient } from "@/lib/supabase/client";
import { loadUserPosts } from "@/lib/confessionalStorage";
import { loadProfile } from "@/lib/indulgenceStorage";
import { loadSinLog, loadCommunitySins } from "@/lib/sinStorage";
import { loadSmiteHistory } from "@/lib/smiteStorage";
import { loadReading, STORAGE_KEY_PREFIX } from "@/lib/mockOracleDeck";
import { syncSalvationScore } from "@/lib/data/indulgences";
import type { Json } from "@/lib/database.types";

const MIGRATION_PREFIX = "bfb-migrated-";

function migrationKey(userId: string): string {
  return `${MIGRATION_PREFIX}${userId}`;
}

function isMigrated(userId: string): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(migrationKey(userId)) === "1";
}

function markMigrated(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(migrationKey(userId), "1");
}

export async function migrateLocalData(userId: string): Promise<void> {
  if (typeof window === "undefined" || isMigrated(userId)) return;

  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return;

  let hadErrors = false;

  const { count: existingSins } = await supabase
    .from("sin_log_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if ((existingSins ?? 0) === 0) {
    const sinLog = loadSinLog();
    for (const item of sinLog) {
      const { error } = await supabase.from("sin_log_items").insert({
        user_id: userId,
        sin_id: item.sinId ?? null,
        petty: item.petty,
        translation: item.translation,
        source: item.source,
        completed_at: item.completedAt,
      });
      if (error) hadErrors = true;
    }
  }

  const community = loadCommunitySins();
  if (community.length > 0) {
    const { count } = await supabase
      .from("sin_community_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if ((count ?? 0) === 0) {
      for (const sin of community) {
        const { error } = await supabase.from("sin_community_items").insert({
          user_id: userId,
          petty: sin.petty,
          translation: sin.translation,
          category: sin.category,
          difficulty: sin.difficulty,
          submitted_at: sin.submittedAt,
        });
        if (error) hadErrors = true;
      }
    }
  }

  const localProfile = loadProfile();
  if (localProfile.purchases.length > 0) {
    const { count } = await supabase
      .from("indulgence_purchases")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if ((count ?? 0) === 0) {
      for (const purchase of localProfile.purchases) {
        const { error } = await supabase.from("indulgence_purchases").insert({
          user_id: userId,
          product_id: purchase.productId,
          product_name: purchase.productName,
          certificate_id: purchase.certificateId,
          price_paid: purchase.pricePaid,
          purchased_at: purchase.purchasedAt,
        });
        if (error) hadErrors = true;
      }
      const { error } = await supabase
        .from("profiles")
        .update({ total_spent: localProfile.totalSpent })
        .eq("id", userId);
      if (error) hadErrors = true;
    }
  }

  const posts = loadUserPosts();
  if (posts.length > 0) {
    const { count } = await supabase
      .from("confessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if ((count ?? 0) === 0) {
      for (const post of posts) {
        const { error } = await supabase.from("confessions").insert({
          user_id: userId,
          content: post.content,
          created_at: post.createdAt,
        });
        if (error) hadErrors = true;
      }
    }
  }

  const smiteHistory = loadSmiteHistory();
  if (smiteHistory.length > 0) {
    const { count } = await supabase
      .from("smite_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if ((count ?? 0) === 0) {
      for (const record of smiteHistory) {
        const { error } = await supabase.from("smite_history").insert({
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
        });
        if (error) hadErrors = true;
      }
    }
  }

  if (typeof window !== "undefined") {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        const dateKey = key.replace(`${STORAGE_KEY_PREFIX}-`, "");
        const reading = loadReading(dateKey);
        if (reading) {
          const { count } = await supabase
            .from("oracle_readings")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("date_key", dateKey);
          if ((count ?? 0) === 0) {
            const { error } = await supabase.from("oracle_readings").insert({
              user_id: userId,
              date_key: reading.dateKey,
              cards: reading.cards as unknown as Json,
              doom_score: reading.doomScore,
              summary: reading.summary,
              revealed: reading.revealed,
            });
            if (error) hadErrors = true;
          }
        }
      }
    }
  }

  if (!hadErrors) {
    await syncSalvationScore();
    markMigrated(userId);
  }
}

export { migrationKey, isMigrated, markMigrated };

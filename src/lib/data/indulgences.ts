"use server";

import { createClient } from "@/lib/supabase/server";
import type { PurchasedIndulgence, UserSalvationProfile } from "@/lib/indulgenceTypes";
import {
  calculateBaseSalvationScore,
  sumPurchaseBoosts,
} from "@/lib/indulgenceProducts";

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Full recalc from sins + purchases; persists to profiles.salvation_score. */
export async function recalculateAndPersistSalvationScore(
  userId: string
): Promise<number> {
  const supabase = await createClient();

  const [{ count: sinCount }, { data: purchases }] = await Promise.all([
    supabase
      .from("sin_log_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase.from("indulgence_purchases").select("product_id").eq("user_id", userId),
  ]);

  const base = calculateBaseSalvationScore(sinCount ?? 0);
  const boost = sumPurchaseBoosts((purchases ?? []).map((p) => p.product_id));
  const score = Math.min(base + boost, 99);

  await supabase
    .from("profiles")
    .update({ salvation_score: score })
    .eq("id", userId);

  return score;
}

/** Client-callable sync for the authenticated user (e.g. after local migration). */
export async function syncSalvationScore(): Promise<void> {
  const userId = await requireUserId();
  if (!userId) return;
  await recalculateAndPersistSalvationScore(userId);
}

export async function fetchSalvationProfile(): Promise<UserSalvationProfile | null> {
  const userId = await requireUserId();
  if (!userId) return null;

  const supabase = await createClient();
  const [{ data: profile }, { data: purchases }, { count: sinCount }] = await Promise.all([
    supabase.from("profiles").select("username, salvation_score, total_spent").eq("id", userId).single(),
    supabase
      .from("indulgence_purchases")
      .select("*")
      .eq("user_id", userId)
      .order("purchased_at", { ascending: false }),
    supabase
      .from("sin_log_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  if (!profile) return null;

  const mappedPurchases: PurchasedIndulgence[] = (purchases ?? []).map((p) => ({
    id: p.id,
    productId: p.product_id,
    productName: p.product_name,
    purchasedAt: p.purchased_at,
    certificateId: p.certificate_id,
    pricePaid: Number(p.price_paid),
  }));

  const base = calculateBaseSalvationScore(sinCount ?? 0);
  const boost = sumPurchaseBoosts(mappedPurchases.map((p) => p.productId));

  return {
    displayName: profile.username,
    salvationScore: Math.min(base + boost, 99),
    totalSpent: Number(profile.total_spent),
    purchases: mappedPurchases,
  };
}

export async function addIndulgencePurchase(
  purchase: Omit<PurchasedIndulgence, "id"> & {
    /** When set (e.g. mystery crate), stock/drop checks use this id while productId is scored. */
    inventoryProductId?: string;
  }
): Promise<{ profile?: UserSalvationProfile; error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in to purchase indulgences." };

  const { validateDropWindow, decrementStockIfTracked } = await import(
    "@/lib/data/collectibles"
  );

  const inventoryId = purchase.inventoryProductId ?? purchase.productId;

  const dropError = await validateDropWindow(inventoryId);
  if (dropError) return { error: dropError };

  const stockError = await decrementStockIfTracked(inventoryId);
  if (stockError) return { error: stockError };

  const supabase = await createClient();
  const { error: insertError } = await supabase.from("indulgence_purchases").insert({
    user_id: userId,
    product_id: purchase.productId,
    product_name: purchase.productName,
    certificate_id: purchase.certificateId,
    price_paid: purchase.pricePaid,
    purchased_at: purchase.purchasedAt,
  });

  if (insertError) return { error: insertError.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("total_spent")
    .eq("id", userId)
    .single();

  const newTotal = Number(profile?.total_spent ?? 0) + purchase.pricePaid;

  await supabase
    .from("profiles")
    .update({ total_spent: newTotal })
    .eq("id", userId);

  await recalculateAndPersistSalvationScore(userId);

  const updated = await fetchSalvationProfile();
  return { profile: updated ?? undefined };
}

export async function fetchLeaderboardEntries(currentUserId?: string | null) {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, salvation_score")
    .order("salvation_score", { ascending: false })
    .limit(50);

  const { MOCK_LEADERBOARD } = await import("@/lib/indulgenceProducts");

  const realEntries = (profiles ?? []).map((p) => ({
    id: p.id,
    displayName: p.username,
    salvationScore: p.salvation_score,
    isUser: p.id === currentUserId,
    badge: p.id === currentUserId ? "Paid Sinner" : undefined,
  }));

  const combined = [...MOCK_LEADERBOARD, ...realEntries];
  return combined.sort((a, b) => b.salvationScore - a.salvationScore);
}

"use server";

import { createClient } from "@/lib/supabase/server";
import type { PurchasedIndulgence, UserSalvationProfile } from "@/lib/indulgenceTypes";
import { calculateBaseSalvationScore } from "@/lib/indulgenceProducts";
import { getBoostForProduct } from "@/lib/indulgenceStorage";

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
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
  const boost = mappedPurchases.reduce((sum, p) => {
    if (p.productId === "leaderboard-boost") return sum + 50;
    return sum + getBoostForProduct(p.productId);
  }, 0);

  return {
    displayName: profile.username,
    salvationScore: Math.min(base + boost, 99),
    totalSpent: Number(profile.total_spent),
    purchases: mappedPurchases,
  };
}

export async function addIndulgencePurchase(
  purchase: Omit<PurchasedIndulgence, "id">
): Promise<{ profile?: UserSalvationProfile; error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in to purchase indulgences." };

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

  const { data: allPurchases } = await supabase
    .from("indulgence_purchases")
    .select("product_id")
    .eq("user_id", userId);

  const { count: sinCount } = await supabase
    .from("sin_log_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const base = calculateBaseSalvationScore(sinCount ?? 0);
  const boost = (allPurchases ?? []).reduce((sum, p) => {
    if (p.product_id === "leaderboard-boost") return sum + 50;
    return sum + getBoostForProduct(p.product_id);
  }, 0);

  await supabase
    .from("profiles")
    .update({
      total_spent: newTotal,
      salvation_score: Math.min(base + boost, 99),
    })
    .eq("id", userId);

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

"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  MysteryReward,
  ProductInventoryRow,
  PurchaseActivityEvent,
  TimedDrop,
} from "@/lib/indulgenceTypes";
import { rollMysteryReward } from "@/lib/collectibles/mysteryPool";
import {
  FALLBACK_DROPS,
  FALLBACK_INVENTORY,
  MOCK_ACTIVITY_SEED,
} from "@/lib/collectibles/constants";

function mapInventoryRow(row: {
  product_id: string;
  stock_total: number;
  stock_remaining: number;
  low_stock_threshold: number;
}): ProductInventoryRow {
  const isLow = row.stock_remaining <= row.low_stock_threshold;
  return {
    productId: row.product_id,
    stockTotal: row.stock_total,
    stockRemaining: row.stock_remaining,
    lowStockThreshold: row.low_stock_threshold,
    isLow,
    isSoldOut: row.stock_remaining <= 0,
  };
}

export async function fetchProductInventory(
  productIds?: string[]
): Promise<Record<string, ProductInventoryRow>> {
  const supabase = await createClient();
  let query = supabase.from("product_inventory").select("*");

  if (productIds?.length) {
    query = query.in("product_id", productIds);
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    const ids = productIds ?? Object.keys(FALLBACK_INVENTORY);
    const result: Record<string, ProductInventoryRow> = {};
    for (const id of ids) {
      const fallback = FALLBACK_INVENTORY[id];
      if (fallback) {
        result[id] = mapInventoryRow({
          product_id: id,
          stock_total: fallback.stockTotal,
          stock_remaining: fallback.stockRemaining,
          low_stock_threshold: fallback.lowStockThreshold,
        });
      }
    }
    return result;
  }

  return Object.fromEntries(
    data.map((row) => [row.product_id, mapInventoryRow(row)])
  );
}

export async function fetchActiveDrops(): Promise<TimedDrop[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("timed_drops")
    .select("*")
    .eq("is_active", true);

  if (error || !data?.length) {
    return FALLBACK_DROPS;
  }

  return data.map((row) => ({
    productId: row.product_id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    isActive: row.is_active,
  }));
}

export async function fetchRecentActivity(
  limit = 10
): Promise<PurchaseActivityEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchase_activity_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) {
    return MOCK_ACTIVITY_SEED.slice(0, limit);
  }

  const mapped = data.map((row) => ({
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    displayName: row.display_name,
    city: row.city,
    createdAt: row.created_at,
  }));

  if (mapped.length < 3) {
    return [...mapped, ...MOCK_ACTIVITY_SEED].slice(0, limit);
  }

  return mapped;
}

export async function upsertCartSession(
  productId: string,
  sessionId: string
): Promise<void> {
  const supabase = await createClient();
  const expiresAt = new Date(Date.now() + 15 * 60_000).toISOString();

  await supabase.from("cart_sessions").upsert(
    {
      product_id: productId,
      session_id: sessionId,
      expires_at: expiresAt,
    },
    { onConflict: "product_id,session_id" }
  );
}

export async function removeCartSession(
  productId: string,
  sessionId: string
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("cart_sessions")
    .delete()
    .eq("product_id", productId)
    .eq("session_id", sessionId);
}

export async function fetchCartPressure(productId: string): Promise<number> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { count, error } = await supabase
    .from("cart_sessions")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId)
    .gt("expires_at", now);

  if (error || count === null) {
    return Math.floor(Math.random() * 3) + 2;
  }

  return count;
}

export async function openMysteryPack(): Promise<MysteryReward> {
  return rollMysteryReward();
}

export async function validateDropWindow(productId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("timed_drops")
    .select("*")
    .eq("product_id", productId)
    .eq("is_active", true)
    .maybeSingle();

  const drop = data
    ? {
        startsAt: data.starts_at,
        endsAt: data.ends_at,
      }
    : FALLBACK_DROPS.find((d) => d.productId === productId);

  if (!drop) return null;

  const now = Date.now();
  const start = new Date(drop.startsAt).getTime();
  const end = new Date(drop.endsAt).getTime();

  if (now < start) return "This drop has not started yet.";
  if (now >= end) return "This drop has ended.";
  return null;
}

export async function decrementStockIfTracked(
  productId: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data: inventory } = await supabase
    .from("product_inventory")
    .select("product_id, stock_remaining")
    .eq("product_id", productId)
    .maybeSingle();

  if (!inventory) {
    const fallback = FALLBACK_INVENTORY[productId];
    if (!fallback) return null;
    if (fallback.stockRemaining <= 0) return "This item is sold out.";
    return null;
  }

  const { error } = await supabase.rpc("decrement_product_stock", {
    p_product_id: productId,
  });

  if (error) {
    return error.message.includes("sold out")
      ? "This item is sold out."
      : error.message;
  }

  return null;
}

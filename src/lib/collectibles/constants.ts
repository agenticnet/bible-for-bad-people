import type { IndulgenceTier } from "@/lib/indulgenceTypes";

export function resolveInspectMode(
  inspectMode: "magnifier" | "3d" | "auto" | undefined,
  tier: IndulgenceTier
): "magnifier" | "3d" {
  if (inspectMode === "magnifier" || inspectMode === "3d") {
    return inspectMode;
  }
  return tier === "premium" || tier === "ultimate" ? "3d" : "magnifier";
}

export function getCartSessionId(): string {
  if (typeof window === "undefined") return "server";
  const key = "bfb_cart_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export const MOCK_ACTIVITY_SEED = [
  {
    id: "seed-1",
    productId: "weekend-pass",
    productName: "Weekend Mortal Sin Pass",
    displayName: "KarenWhoReturnsCarts",
    city: "Toronto",
    createdAt: new Date(Date.now() - 120_000).toISOString(),
  },
  {
    id: "seed-2",
    productId: "hell-free-card",
    productName: "Get Out of Hell Free Card",
    displayName: "NeverReplyAllGuy",
    city: "Brooklyn",
    createdAt: new Date(Date.now() - 300_000).toISOString(),
  },
];

export const FALLBACK_INVENTORY: Record<
  string,
  { stockTotal: number; stockRemaining: number; lowStockThreshold: number }
> = {
  "hell-free-card": { stockTotal: 12, stockRemaining: 3, lowStockThreshold: 5 },
  "sin-mystery-crate": { stockTotal: 50, stockRemaining: 18, lowStockThreshold: 10 },
};

export const FALLBACK_DROPS = [
  {
    productId: "celebrity-prayer-jump",
    startsAt: new Date(Date.now() - 3_600_000).toISOString(),
    endsAt: new Date(Date.now() + 48 * 3_600_000).toISOString(),
    isActive: true,
  },
];

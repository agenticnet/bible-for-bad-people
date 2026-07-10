"use client";

import { Badge } from "@/components/ui";
import { useCollectiblesOptional } from "./CollectiblesProvider";
import { FALLBACK_INVENTORY } from "@/lib/collectibles/constants";

interface InventoryCounterProps {
  productId: string;
}

export default function InventoryCounter({ productId }: InventoryCounterProps) {
  const ctx = useCollectiblesOptional();
  const row = ctx?.inventory[productId];

  const fallback = FALLBACK_INVENTORY[productId];
  const remaining = row?.stockRemaining ?? fallback?.stockRemaining;
  const threshold = row?.lowStockThreshold ?? fallback?.lowStockThreshold ?? 5;

  if (remaining === undefined) return null;

  if (remaining <= 0) {
    return <Badge tone="ember">Extinct</Badge>;
  }

  if (remaining <= threshold) {
    return (
      <Badge tone="ember">
        Only {remaining} left in existence
      </Badge>
    );
  }

  return null;
}

export function isProductSoldOut(productId: string, ctx: ReturnType<typeof useCollectiblesOptional>): boolean {
  const row = ctx?.inventory[productId];
  const fallback = FALLBACK_INVENTORY[productId];
  const remaining = row?.stockRemaining ?? fallback?.stockRemaining;
  if (remaining === undefined) return false;
  return remaining <= 0;
}

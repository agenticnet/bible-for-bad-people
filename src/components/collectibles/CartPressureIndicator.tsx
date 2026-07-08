"use client";

import { useCollectiblesOptional } from "./CollectiblesProvider";
import { FALLBACK_INVENTORY } from "@/lib/collectibles/constants";

interface CartPressureIndicatorProps {
  productId: string;
}

export default function CartPressureIndicator({
  productId,
}: CartPressureIndicatorProps) {
  const ctx = useCollectiblesOptional();
  const count = ctx?.cartPressure[productId];
  const hasInventory =
    ctx?.inventory[productId] !== undefined ||
    FALLBACK_INVENTORY[productId] !== undefined;
  const hasDrop = ctx?.drops[productId] !== undefined;

  if (!hasInventory && !hasDrop) return null;
  if (!count || count < 2) return null;

  return (
    <p className="verse-ref flex items-center gap-1.5 text-ink-soft">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wine/40 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-wine/70" />
      </span>
      Currently in {count} people&apos;s carts
    </p>
  );
}

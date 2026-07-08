"use client";

import { useDropCountdown } from "@/lib/collectibles/useServerTime";
import { useCollectiblesOptional } from "./CollectiblesProvider";
import { INDULGENCE_PRODUCTS } from "@/lib/indulgenceProducts";
import { Badge, FixedBottomBar } from "@/components/ui";
import { FIXED_CHROME_SPACER_HEIGHT, Z_DROP } from "@/lib/ux/constraints";
import { cn } from "@/lib/utils";

interface DropTimerProps {
  className?: string;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function DropTimer({ className }: DropTimerProps) {
  const ctx = useCollectiblesOptional();
  const drops = ctx ? Object.values(ctx.drops) : [];
  const offsetMs = ctx?.serverOffsetMs ?? 0;

  const activeDrop = drops.find((d) => d.isActive) ?? null;
  const countdown = useDropCountdown(
    activeDrop?.startsAt,
    activeDrop?.endsAt,
    offsetMs
  );

  if (!activeDrop || countdown.phase === "ended" || countdown.phase === "none") {
    return null;
  }

  const product = INDULGENCE_PRODUCTS.find((p) => p.id === activeDrop.productId);

  return (
    <>
      <div className={FIXED_CHROME_SPACER_HEIGHT} aria-hidden />
      <FixedBottomBar
        variant="binding"
        zIndex={Z_DROP}
        className={className}
        innerClassName="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
      <div className="flex min-w-0 items-center gap-2">
        <Badge tone={countdown.isEndingSoon ? "warning" : "wine"} size="sm">
          Timed Drop
        </Badge>
        <span className="truncate text-sm font-medium text-ivory">
          {product?.name ?? activeDrop.productId}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span
          className={cn(
            "verse-ref text-ink-soft",
            countdown.phase === "upcoming" && "text-ink-soft",
            countdown.isEndingSoon && "text-warning"
          )}
        >
          {countdown.label}
        </span>
        <span className="verse-ref font-mono text-base tabular-nums text-ivory sm:text-lg">
          {pad(countdown.days)}:{pad(countdown.hours)}:{pad(countdown.minutes)}:
          {pad(countdown.seconds)}
        </span>
      </div>
      </FixedBottomBar>
    </>
  );
}

export function isDropUnavailable(
  productId: string,
  ctx: ReturnType<typeof useCollectiblesOptional>
): string | null {
  const drop = ctx?.drops[productId];
  if (!drop) return null;

  const offsetMs = ctx?.serverOffsetMs ?? 0;
  const now = Date.now() + offsetMs;
  const start = new Date(drop.startsAt).getTime();
  const end = new Date(drop.endsAt).getTime();

  if (now < start) return "Drop has not started yet.";
  if (now >= end) return "Drop has ended.";
  return null;
}

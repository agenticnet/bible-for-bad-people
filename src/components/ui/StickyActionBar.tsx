"use client";

import { cn } from "@/lib/utils";
import {
  SAFE_BOTTOM,
  THUMB_CTA_MIN_HEIGHT,
  Z_STICKY_ACTION,
} from "@/lib/ux/constraints";
import Button from "./Button";
import type { Accent } from "./tokens";

interface StickyActionBarProps {
  primaryLabel: React.ReactNode;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  primaryAccent?: Accent;
  secondary?: React.ReactNode;
  className?: string;
}

export default function StickyActionBar({
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryAccent = "wine",
  secondary,
  className,
}: StickyActionBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 border-t border-rule bg-parchment/95 backdrop-blur-sm",
        Z_STICKY_ACTION,
        SAFE_BOTTOM,
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
        {secondary && <div className="shrink-0">{secondary}</div>}
        <Button
          accent={primaryAccent}
          size="lg"
          className={cn("w-full", THUMB_CTA_MIN_HEIGHT)}
          onClick={onPrimary}
          disabled={primaryDisabled}
        >
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
}

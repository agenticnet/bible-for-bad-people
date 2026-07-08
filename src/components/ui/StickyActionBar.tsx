"use client";

import { cn } from "@/lib/utils";
import {
  THUMB_CTA_MIN_HEIGHT,
  Z_STICKY_ACTION,
} from "@/lib/ux/constraints";
import Button from "./Button";
import FixedBottomBar from "./FixedBottomBar";
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
    <FixedBottomBar
      variant="parchment"
      zIndex={Z_STICKY_ACTION}
      className={className}
      innerClassName="flex items-center gap-3"
    >
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
    </FixedBottomBar>
  );
}

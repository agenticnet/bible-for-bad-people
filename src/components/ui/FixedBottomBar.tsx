"use client";

import { cn } from "@/lib/utils";
import { SAFE_BOTTOM } from "@/lib/ux/constraints";

export type FixedBottomBarVariant = "binding" | "parchment";

const variantStyles: Record<FixedBottomBarVariant, string> = {
  binding: "border-rule bg-binding/95 backdrop-blur-sm",
  parchment: "border-rule bg-parchment/95 backdrop-blur-sm",
};

interface FixedBottomBarProps {
  children: React.ReactNode;
  variant?: FixedBottomBarVariant;
  zIndex: string;
  className?: string;
  innerClassName?: string;
}

export default function FixedBottomBar({
  children,
  variant = "parchment",
  zIndex,
  className,
  innerClassName,
}: FixedBottomBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 border-t",
        variantStyles[variant],
        zIndex,
        SAFE_BOTTOM,
        className
      )}
    >
      <div
        className={cn("mx-auto max-w-4xl px-4 py-3", innerClassName)}
      >
        {children}
      </div>
    </div>
  );
}

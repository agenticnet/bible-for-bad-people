"use client";

import { cn } from "@/lib/utils";
import {
  PAGE_CONTENT_MAX_WIDTH,
  SAFE_BOTTOM,
  type PageContentMaxWidth,
} from "@/lib/ux/constraints";

export type FixedBottomBarVariant = "binding" | "parchment";

const variantStyles: Record<FixedBottomBarVariant, string> = {
  binding: "border-rule bg-binding/95 backdrop-blur-sm",
  parchment: "border-rule bg-parchment/95 backdrop-blur-sm",
};

interface FixedBottomBarProps {
  children: React.ReactNode;
  variant?: FixedBottomBarVariant;
  zIndex: string;
  /** Align inner content with PageShell width */
  contentMaxWidth?: PageContentMaxWidth;
  className?: string;
  innerClassName?: string;
}

export default function FixedBottomBar({
  children,
  variant = "parchment",
  zIndex,
  contentMaxWidth = "lg",
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
        className={cn(
          "mx-auto px-4 py-3 sm:px-6",
          PAGE_CONTENT_MAX_WIDTH[contentMaxWidth],
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

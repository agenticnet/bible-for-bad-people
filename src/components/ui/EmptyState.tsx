"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-rule bg-page/80 px-6 py-16 text-center",
        className
      )}
    >
      {Icon && (
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Icon className="mx-auto mb-4 h-10 w-10 text-ink-soft" />
        </motion.div>
      )}
      <p className="text-ink-soft">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      )}
    </div>
  );
}

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
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  action,
}: EmptyStateProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      role="status"
      className={cn(
        "rounded-xl border border-dashed border-rule bg-page/80 px-6 py-16 text-center",
        className
      )}
    >
      {Icon && (
        <motion.div
          aria-hidden
          animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Icon className="mx-auto mb-4 h-10 w-10 text-ink-soft" aria-hidden />
        </motion.div>
      )}
      <p className="text-ink-soft">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

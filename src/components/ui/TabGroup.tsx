"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface TabGroupProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  accent?: Accent;
  size?: "sm" | "md";
  className?: string;
}

const sizeStyles = {
  sm: "px-3 py-2 text-xs sm:px-4 sm:text-sm",
  md: "px-4 py-2 text-sm",
};

export default function TabGroup({
  tabs,
  value,
  onChange,
  accent = "wine",
  size = "md",
  className,
}: TabGroupProps) {
  return (
    <nav
      className={cn(
        "relative flex gap-1 overflow-x-auto rounded-xl border border-rule bg-page p-1",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 flex shrink-0 items-center gap-2 rounded-lg font-medium transition-colors",
              sizeStyles[size],
              active ? accentStyles[accent].text : "text-ink-soft hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId="tab-pill"
                className={cn(
                  "absolute inset-0 rounded-lg",
                  accentStyles[accent].bgMuted
                )}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

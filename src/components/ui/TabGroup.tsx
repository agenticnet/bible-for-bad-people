"use client";

import { useRef, type KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TOUCH_TARGET_MIN } from "@/lib/ux/constraints";
import { accentStyles, focusVisibleRing, type Accent } from "./tokens";

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
  /** Prefix for aria-controls / tabpanel ids — consumers should set matching panel ids */
  idPrefix?: string;
}

const sizeStyles = {
  sm: "px-3 text-xs sm:px-4 sm:text-sm",
  md: "px-4 text-sm",
};

export function tabPanelId(idPrefix: string, tabId: string) {
  return `${idPrefix}-panel-${tabId}`;
}

export function tabId(idPrefix: string, tabId: string) {
  return `${idPrefix}-tab-${tabId}`;
}

export default function TabGroup({
  tabs,
  value,
  onChange,
  accent = "wine",
  size = "md",
  className,
  idPrefix = "tabs",
}: TabGroupProps) {
  const listRef = useRef<HTMLDivElement>(null);

  function focusTabAt(index: number) {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[index]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = tabs.findIndex((t) => t.id === value);
    if (currentIndex < 0) return;

    let nextIndex: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        break;
    }

    if (nextIndex === null) return;
    onChange(tabs[nextIndex].id);
    // Focus after state update on next frame
    requestAnimationFrame(() => focusTabAt(nextIndex!));
  }

  return (
    <div
      ref={listRef}
      className={cn(
        "relative flex gap-1 overflow-x-auto overscroll-x-contain rounded-xl border border-rule bg-page p-1",
        className
      )}
      role="tablist"
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={tabId(idPrefix, tab.id)}
            aria-selected={active}
            aria-controls={tabPanelId(idPrefix, tab.id)}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition-colors",
              TOUCH_TARGET_MIN,
              focusVisibleRing,
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
              {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
              <span className={cn(size === "sm" && tabs.length > 4 && "max-w-[5.5rem] truncate sm:max-w-none")}>
                {tab.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

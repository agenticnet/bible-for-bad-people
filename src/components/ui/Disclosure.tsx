"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";

interface DisclosureProps {
  label: string;
  summary?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent?: Accent;
  className?: string;
}

export default function Disclosure({
  label,
  summary,
  children,
  defaultOpen = false,
  accent = "wine",
  className,
}: DisclosureProps) {
  return (
    <details
      className={cn("group rounded-xl border border-rule bg-page", className)}
      open={defaultOpen || undefined}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-ink",
          "[&::-webkit-details-marker]:hidden"
        )}
      >
        <div className="min-w-0">
          <span className={accentStyles[accent].text}>{label}</span>
          {summary && (
            <p className="mt-0.5 text-xs font-normal text-ink-soft">{summary}</p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-ink-soft transition-transform duration-200",
            "group-open:rotate-180 motion-reduce:transition-none"
          )}
        />
      </summary>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out group-open:grid-rows-[1fr] motion-reduce:transition-none">
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-rule px-4 py-4">{children}</div>
        </div>
      </div>
    </details>
  );
}

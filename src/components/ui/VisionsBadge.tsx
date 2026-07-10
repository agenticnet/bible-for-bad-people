"use client";

import { useId } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";

interface VisionsBadgeProps {
  label?: string;
  accent?: Accent;
  className?: string;
}

export default function VisionsBadge({
  label = "Satire, not scripture",
  accent = "plum",
  className,
}: VisionsBadgeProps) {
  const disclaimerId = useId();

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1",
        accentStyles[accent].borderMuted,
        accentStyles[accent].bgMuted,
        className
      )}
      aria-describedby={disclaimerId}
    >
      <Sparkles className={cn("h-3 w-3", accentStyles[accent].text)} aria-hidden />
      <span className={cn("verse-ref text-[0.65rem]", accentStyles[accent].text)}>
        {label}
      </span>
      <span id={disclaimerId} className="sr-only">
        Responses are satirical approximations — not prophecy, therapy, or divine
        revelation.
      </span>
    </div>
  );
}

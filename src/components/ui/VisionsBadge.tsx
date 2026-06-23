import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";

interface VisionsBadgeProps {
  label?: string;
  accent?: Accent;
  className?: string;
}

export default function VisionsBadge({
  label = "Visions Approximate",
  accent = "plum",
  className,
}: VisionsBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1",
        accentStyles[accent].borderMuted,
        accentStyles[accent].bgMuted,
        className
      )}
    >
      <Sparkles className={cn("h-3 w-3", accentStyles[accent].text)} />
      <span className={cn("verse-ref text-[0.65rem]", accentStyles[accent].text)}>
        {label}
      </span>
    </div>
  );
}

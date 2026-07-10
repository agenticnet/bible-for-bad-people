import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";

interface TypingIndicatorProps {
  accent: Accent;
  label: string;
  avatar: React.ReactNode;
}

export default function TypingIndicator({
  accent,
  label,
  avatar,
}: TypingIndicatorProps) {
  const a = accentStyles[accent];

  return (
    <div className="flex gap-3" role="status" aria-live="polite" aria-label={label}>
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
          a.borderMuted,
          a.bgMuted
        )}
      >
        <span className="text-sm" aria-hidden="true">
          {avatar}
        </span>
      </div>
      <div
        className={cn(
          "rounded-2xl rounded-ss-sm border bg-page px-5 py-4",
          a.borderMuted.replace("/30", "/20")
        )}
      >
        <p className={cn("verse-ref mb-2", a.text)}>{label}</p>
        <div className="flex gap-1.5" aria-hidden>
          <span className={cn("typing-dot h-2 w-2 rounded-full", a.dot)} />
          <span className={cn("typing-dot h-2 w-2 rounded-full", a.dot)} />
          <span className={cn("typing-dot h-2 w-2 rounded-full", a.dot)} />
        </div>
      </div>
    </div>
  );
}

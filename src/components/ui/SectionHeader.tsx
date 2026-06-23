import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  accent?: Accent;
  className?: string;
}

export default function SectionHeader({
  kicker,
  title,
  description,
  accent = "wine",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {kicker && (
        <p className={cn("verse-ref mb-1", accentStyles[accent].text)}>
          {kicker}
        </p>
      )}
      <h2 className="font-serif text-xl font-bold text-ink">{title}</h2>
      {description && (
        <p className="mt-2 max-w-xl text-sm text-ink-soft">{description}</p>
      )}
    </div>
  );
}

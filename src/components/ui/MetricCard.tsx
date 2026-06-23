import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";
import Surface from "./Surface";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: Accent;
  accentTint?: boolean;
  className?: string;
}

export default function MetricCard({
  label,
  value,
  hint,
  accent,
  accentTint = false,
  className,
}: MetricCardProps) {
  return (
    <Surface
      accent={accent}
      accentTint={accentTint}
      padding="sm"
      className={className}
    >
      <p
        className={cn(
          "verse-ref mb-1",
          accent ? accentStyles[accent].text : "text-ink-soft"
        )}
      >
        {label}
      </p>
      <div className="font-bold text-ink">{value}</div>
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </Surface>
  );
}

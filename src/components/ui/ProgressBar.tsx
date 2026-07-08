import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  className?: string;
  label?: string;
  showPercent?: boolean;
}

export default function ProgressBar({
  percent,
  className,
  label,
  showPercent = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercent) && (
        <div className="mb-2 flex items-center justify-between">
          {label && <p className="verse-ref text-ink-soft">{label}</p>}
          {showPercent && (
            <p className="verse-ref text-wine">{clamped}%</p>
          )}
        </div>
      )}
      <div
        className="h-1.5 overflow-hidden rounded-full bg-rule"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-wine transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

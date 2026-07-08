import Button from "./Button";
import { cn } from "@/lib/utils";
import type { Accent } from "./tokens";

interface FormActionsProps {
  primaryLabel: string;
  onPrimary?: () => void;
  primaryType?: "button" | "submit";
  primaryDisabled?: boolean;
  backLabel?: string;
  onBack?: () => void;
  accent?: Accent;
  className?: string;
}

export default function FormActions({
  primaryLabel,
  onPrimary,
  primaryType = "button",
  primaryDisabled = false,
  backLabel = "Back",
  onBack,
  accent = "wine",
  className,
}: FormActionsProps) {
  return (
    <div className={cn("mt-8 flex items-center justify-between gap-3", className)}>
      {onBack ? (
        <Button type="button" variant="ghost" accent={accent} onClick={onBack}>
          {backLabel}
        </Button>
      ) : (
        <span />
      )}
      <div className="ml-auto w-full sm:w-auto">
        <Button
          type={primaryType}
          size="lg"
          accent={accent}
          className="w-full sm:w-auto"
          onClick={onPrimary}
          disabled={primaryDisabled}
        >
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
}

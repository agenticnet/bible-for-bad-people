import { cn } from "@/lib/utils";
import { TOUCH_TARGET_MIN } from "@/lib/ux/constraints";
import { accentStyles, focusVisibleRing, type Accent } from "./tokens";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accent?: Accent;
}

export default function Chip({
  accent,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-rule bg-smoke px-4 text-xs text-ink-soft transition-colors hover:text-ink",
        TOUCH_TARGET_MIN,
        focusVisibleRing,
        accent && accentStyles[accent].borderHover,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

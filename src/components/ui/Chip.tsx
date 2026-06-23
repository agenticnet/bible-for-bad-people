import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";

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
        "rounded-full border border-rule bg-smoke px-3 py-1.5 text-xs text-ink-soft transition-colors hover:text-ink",
        accent && accentStyles[accent].borderHover,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

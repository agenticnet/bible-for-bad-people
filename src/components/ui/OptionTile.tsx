import { cn } from "@/lib/utils";
import { TOUCH_TARGET_MIN } from "@/lib/ux/constraints";
import { accentStyles, focusVisibleRing, type Accent } from "./tokens";

interface OptionTileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  accent?: Accent;
  layout?: "stack" | "row";
}

export default function OptionTile({
  selected = false,
  accent = "ember",
  layout = "stack",
  className,
  children,
  ...props
}: OptionTileProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-xl border p-3 text-start transition-colors",
        TOUCH_TARGET_MIN,
        focusVisibleRing,
        layout === "stack"
          ? "flex flex-col items-center gap-1 text-center"
          : "flex items-center gap-2",
        selected
          ? cn(
              accentStyles[accent].borderMuted,
              accentStyles[accent].bgMuted,
              accentStyles[accent].text
            )
          : "border-rule bg-page text-ink-soft hover:text-ink",
        !selected && accentStyles[accent].borderHover,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

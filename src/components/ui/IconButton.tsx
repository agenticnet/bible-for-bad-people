import { cn } from "@/lib/utils";
import { TOUCH_TARGET_MIN } from "@/lib/ux/constraints";
import { accentStyles, focusVisibleRing, type Accent } from "./tokens";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accent?: Accent;
  size?: "md" | "lg";
}

const sizeStyles = {
  md: TOUCH_TARGET_MIN,
  lg: "h-12 w-12",
};

export default function IconButton({
  accent = "wine",
  size = "lg",
  className,
  children,
  type,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        focusVisibleRing,
        sizeStyles[size],
        accentStyles[accent].border,
        accentStyles[accent].bg,
        accentStyles[accent].text,
        accentStyles[accent].bgHover,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

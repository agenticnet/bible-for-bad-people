import { cn } from "@/lib/utils";
import { PRIMARY_CTA_MIN_HEIGHT, TOUCH_TARGET_MIN } from "@/lib/ux/constraints";
import { accentStyles, focusVisibleRing, statusStyles, type Accent } from "./tokens";

type ButtonVariant = "accent" | "ghost" | "success" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  accent?: Accent;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: cn("px-3 py-1.5 text-sm", TOUCH_TARGET_MIN),
  md: cn("px-5 py-2.5 text-sm font-semibold", TOUCH_TARGET_MIN),
  lg: cn("px-6 py-3.5 text-sm font-semibold", PRIMARY_CTA_MIN_HEIGHT),
};

export default function Button({
  variant = "accent",
  accent = "wine",
  size = "md",
  className,
  children,
  type,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "accent"
      ? cn(
          "rounded-lg border transition-colors",
          accentStyles[accent].border,
          accentStyles[accent].bg,
          accentStyles[accent].text,
          accentStyles[accent].bgHover,
          "disabled:opacity-40"
        )
      : variant === "ghost"
        ? cn(
            "rounded-lg border border-rule text-ink-soft transition-colors hover:text-ink",
            accentStyles[accent].borderHover
          )
        : variant === "success"
          ? cn(
              "rounded-lg border transition-colors",
              statusStyles.success.border,
              "bg-green-500/15 text-green-400 hover:border-green-500/40"
            )
          : cn(
              "rounded-lg border transition-colors",
              accentStyles.ember.border,
              accentStyles.ember.bg,
              accentStyles.ember.text,
              accentStyles.ember.bgHover
            );

  return (
    <button
      type={type ?? "button"}
      className={cn(
        "inline-flex items-center justify-center gap-2 active:scale-[0.98] motion-reduce:active:scale-100",
        focusVisibleRing,
        sizeStyles[size],
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

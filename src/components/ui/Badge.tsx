import { cn } from "@/lib/utils";
import { accentStyles, statusStyles, type Accent, type SemanticStatus } from "./tokens";

type BadgeTone = Accent | SemanticStatus | "active";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: "sm" | "md";
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-[9px]",
  md: "px-2.5 py-0.5 text-[10px]",
};

function resolveTone(tone: BadgeTone) {
  if (tone === "active") {
    return "rounded-full border border-rule bg-smoke text-ink-soft";
  }
  if (tone in statusStyles) {
    const s = statusStyles[tone as SemanticStatus];
    return cn("rounded-full border", s.border, s.bg, s.text);
  }
  const a = accentStyles[tone as Accent];
  return cn("rounded-full border", a.borderMuted, a.bgMuted, a.text);
}

export default function Badge({
  tone = "neutral" as BadgeTone,
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center uppercase tracking-wider",
        sizeStyles[size],
        resolveTone(tone),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils";
import { accentStyles, surfaceBase, type Accent } from "./tokens";

type SurfaceElement = "article" | "div" | "section" | "form";

interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  as?: SurfaceElement;
  accent?: Accent;
  accentTint?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Surface({
  as: Tag = "div",
  accent,
  accentTint = false,
  padding = "md",
  hover = false,
  className,
  children,
  ...props
}: SurfaceProps) {
  const accentClass = accent
    ? accentTint
      ? `${accentStyles[accent].borderMuted} ${accentStyles[accent].bgMuted}`
      : accentStyles[accent].borderMuted
    : "";

  return (
    <Tag
      className={cn(
        surfaceBase,
        paddingStyles[padding],
        hover && "hover:border-rule",
        accentClass,
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

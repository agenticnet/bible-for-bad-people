import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";
import VisionsBadge from "./VisionsBadge";

interface ChamberHeaderProps {
  icon: LucideIcon;
  accent: Accent;
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}

export default function ChamberHeader({
  icon: Icon,
  accent,
  title,
  subtitle,
  badge,
  align = "left",
  className,
  children,
}: ChamberHeaderProps) {
  const centered = align === "center";

  return (
    <header className={cn("mb-8", centered && "text-center", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-3",
          centered && "justify-center"
        )}
      >
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border",
            accentStyles[accent].borderMuted,
            accentStyles[accent].bgMuted
          )}
        >
          <Icon className={cn("h-6 w-6", accentStyles[accent].text)} />
        </div>
        <div className={cn(centered && "w-full")}>
          <h1 className={cn("font-serif text-2xl font-bold sm:text-3xl", accentStyles[accent].text)}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-ink-soft">{subtitle}</p>
          )}
        </div>
        {badge && (
          <VisionsBadge
            label={badge}
            accent={accent}
            className={cn(!centered && "ml-auto hidden sm:flex")}
          />
        )}
      </div>
      {children}
    </header>
  );
}

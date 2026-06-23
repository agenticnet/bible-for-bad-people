import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-rule bg-page/80 px-6 py-16 text-center",
        className
      )}
    >
      {Icon && <Icon className="mx-auto mb-4 h-10 w-10 text-ink-soft" />}
      <p className="text-ink-soft">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      )}
    </div>
  );
}

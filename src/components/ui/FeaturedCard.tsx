import { cn } from "@/lib/utils";
import { featuredStyles } from "./tokens";

interface FeaturedCardProps {
  children: React.ReactNode;
  featured?: boolean;
  hero?: boolean;
  className?: string;
}

export default function FeaturedCard({
  children,
  featured = false,
  hero = false,
  className,
}: FeaturedCardProps) {
  if (!featured && !hero) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "relative rounded-xl transition-transform duration-300 motion-reduce:transition-none",
        featured && featuredStyles.base,
        hero && featuredStyles.hero,
        className
      )}
    >
      {hero && (
        <span
          className={cn(
            "absolute -top-2.5 left-1/2 z-20 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            featuredStyles.ribbon
          )}
        >
          Recommended
        </span>
      )}
      {children}
    </div>
  );
}

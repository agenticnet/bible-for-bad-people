import Link from "next/link";
import { cn } from "@/lib/utils";

type LinkButtonVariant = "primary" | "secondary";

interface LinkButtonProps {
  href: string;
  variant?: LinkButtonVariant;
  className?: string;
  children: React.ReactNode;
}

export default function LinkButton({
  href,
  variant = "primary",
  className,
  children,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-medium transition-colors active:scale-[0.98] motion-reduce:active:scale-100 sm:px-8 sm:py-4 sm:text-base",
        variant === "primary"
          ? "bg-wine text-ivory hover:bg-wine-deep"
          : "border border-rule bg-page text-ink-soft hover:border-ink-soft/30 hover:text-ink",
        className
      )}
    >
      {children}
    </Link>
  );
}

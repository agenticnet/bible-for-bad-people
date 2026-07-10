import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-rule/60 motion-reduce:animate-none",
        className
      )}
      aria-hidden
    />
  );
}

import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  label?: string;
}

export default function Spinner({
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <span
      role="status"
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-rule border-t-wine motion-reduce:animate-none motion-reduce:border-wine"
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({
  message = "Loading…",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
        className
      )}
    >
      <Spinner label={message} />
      <p className="text-sm text-ink-soft">{message}</p>
    </div>
  );
}

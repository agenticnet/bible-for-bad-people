import { cn } from "@/lib/utils";

interface BindingBarProps {
  children: React.ReactNode;
  className?: string;
}

export default function BindingBar({ children, className }: BindingBarProps) {
  return (
    <div
      className={cn(
        "border-b border-ivory/10 bg-binding px-4 py-3 sm:px-6",
        className
      )}
    >
      {children}
    </div>
  );
}

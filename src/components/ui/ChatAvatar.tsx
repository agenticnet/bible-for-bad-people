import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";

interface ChatAvatarProps {
  accent: Accent;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  online?: boolean;
}

const sizeStyles = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-xl",
  lg: "h-12 w-12 text-xl border-2",
};

export default function ChatAvatar({
  accent,
  children,
  size = "sm",
  online,
}: ChatAvatarProps) {
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "flex items-center justify-center rounded-full border",
          sizeStyles[size],
          accentStyles[accent].borderMuted,
          accentStyles[accent].bgMuted
        )}
      >
        <span aria-hidden="true">{children}</span>
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute -end-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-parchment",
            online ? "bg-green-500" : "bg-ember"
          )}
        />
      )}
    </div>
  );
}

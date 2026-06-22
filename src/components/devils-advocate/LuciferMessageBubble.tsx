import { cn } from "@/lib/utils";
import type { LuciferMessage } from "@/lib/luciferChatTypes";

interface LuciferMessageBubbleProps {
  message: LuciferMessage;
}

export default function LuciferMessageBubble({ message }: LuciferMessageBubbleProps) {
  const isLucifer = message.role === "lucifer";

  return (
    <div
      className={cn(
        "flex gap-3",
        isLucifer ? "justify-start" : "justify-end"
      )}
    >
      {isLucifer && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neon-red/40 bg-neon-red/10">
          <span className="text-sm" aria-hidden="true">
            🔥
          </span>
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%]",
          isLucifer
            ? "rounded-tl-sm border border-neon-red/25 bg-shadow"
            : "rounded-tr-sm border border-neon-pink/30 bg-neon-pink/10"
        )}
      >
        {isLucifer && (
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-neon-red/80">
            Lucifer
          </p>
        )}
        <p className="text-sm leading-relaxed text-bone sm:text-base">
          {message.content}
        </p>
        <p className="mt-2 text-[10px] text-muted/50">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {!isLucifer && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neon-pink/40 bg-neon-pink/10">
          <span className="text-sm" aria-hidden="true">
            😈
          </span>
        </div>
      )}
    </div>
  );
}

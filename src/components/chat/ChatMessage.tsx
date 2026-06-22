import { cn } from "@/lib/utils";
import type { Message } from "@/lib/chatTypes";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isGod = message.role === "god";

  return (
    <div
      className={cn(
        "flex gap-3",
        isGod ? "justify-start" : "justify-end"
      )}
    >
      {isGod && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neon-gold/40 bg-neon-gold/10">
          <span className="text-sm" aria-hidden="true">
            ✝
          </span>
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%]",
          isGod
            ? "rounded-tl-sm border border-neon-gold/20 bg-shadow"
            : "rounded-tr-sm border border-neon-purple/30 bg-neon-purple/10"
        )}
      >
        {isGod && (
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-neon-gold/70">
            GOD
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

      {!isGod && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neon-purple/40 bg-neon-purple/10">
          <span className="text-sm" aria-hidden="true">
            😈
          </span>
        </div>
      )}
    </div>
  );
}

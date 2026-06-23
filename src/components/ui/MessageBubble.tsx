import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";
import ChatAvatar from "./ChatAvatar";

interface MessageBubbleProps {
  align: "start" | "end";
  accent: Accent;
  userAccent?: Accent;
  avatar: React.ReactNode;
  label?: string;
  content: string;
  timestamp: Date;
}

export default function MessageBubble({
  align,
  accent,
  userAccent = "plum",
  avatar,
  label,
  content,
  timestamp,
}: MessageBubbleProps) {
  const isStart = align === "start";
  const bubbleAccent = isStart ? accent : userAccent;
  const a = accentStyles[bubbleAccent];

  return (
    <div className={cn("flex gap-3", isStart ? "justify-start" : "justify-end")}>
      {isStart && <ChatAvatar accent={accent}>{avatar}</ChatAvatar>}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%]",
          isStart ? "rounded-tl-sm border border-rule bg-page" : "rounded-tr-sm border",
          !isStart && cn(a.borderMuted, a.bgMuted)
        )}
      >
        {label && (
          <p className={cn("verse-ref mb-1", accentStyles[accent].text)}>{label}</p>
        )}
        <p className="text-sm leading-relaxed text-ink sm:text-base">{content}</p>
        <p className="mt-2 text-[10px] text-ink-soft">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {!isStart && <ChatAvatar accent={userAccent}>{avatar}</ChatAvatar>}
    </div>
  );
}

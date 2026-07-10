"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, resolveVariants, spring } from "@/lib/motion";
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
  animate?: boolean;
}

export default function MessageBubble({
  align,
  accent,
  userAccent = "plum",
  avatar,
  label,
  content,
  timestamp,
  animate = false,
}: MessageBubbleProps) {
  const reducedMotion = useReducedMotion();
  const isStart = align === "start";
  const bubbleAccent = isStart ? accent : userAccent;
  const a = accentStyles[bubbleAccent];
  const variants = resolveVariants(
    {
      hidden: {
        opacity: 0,
        y: 12,
        x: isStart ? -4 : 4,
      },
      visible: { opacity: 1, y: 0, x: 0 },
    },
    reducedMotion
  );
  const t = resolveTransition(spring.gentle, reducedMotion);

  return (
    <motion.div
      className={cn("flex gap-3", isStart ? "justify-start" : "justify-end")}
      initial={animate ? "hidden" : false}
      animate={animate ? "visible" : false}
      variants={variants}
      transition={t}
    >
      {isStart && <ChatAvatar accent={accent}>{avatar}</ChatAvatar>}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%]",
          isStart ? "rounded-ss-sm border border-rule bg-page" : "rounded-se-sm border",
          !isStart && cn(a.borderMuted, a.bgMuted)
        )}
      >
        {label && (
          <p className={cn("verse-ref mb-1", accentStyles[accent].text)}>{label}</p>
        )}
        <p className="text-contain text-sm leading-relaxed text-ink sm:text-base">{content}</p>
        <p className="mt-2 text-[10px] text-ink-soft">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {!isStart && <ChatAvatar accent={userAccent}>{avatar}</ChatAvatar>}
    </motion.div>
  );
}

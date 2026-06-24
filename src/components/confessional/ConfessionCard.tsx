"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import type { Confession, VoteType } from "@/lib/confessionalTypes";
import { getVerdict, getScore } from "@/lib/confessionalTypes";
import { cn } from "@/lib/utils";
import { Badge, Button, Surface } from "@/components/ui";
import type { Accent, SemanticStatus } from "@/components/ui/tokens";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, resolveVariants, spring } from "@/lib/motion";

interface ConfessionCardProps {
  confession: Confession;
  userVote: VoteType | null;
  onVote: (id: string, vote: VoteType) => void;
  votingDisabled?: boolean;
}

const verdictTones: Record<
  ReturnType<typeof getVerdict>,
  SemanticStatus | Accent
> = {
  absolved: "success",
  condemned: "ember",
  split: "plum",
};

const verdictLabels = {
  absolved: "Leaning Absolved",
  condemned: "Leaning Condemned",
  split: "Jury Split",
};

export default function ConfessionCard({
  confession,
  userVote,
  onVote,
  votingDisabled = false,
}: ConfessionCardProps) {
  const reducedMotion = useReducedMotion();
  const verdict = getVerdict(confession.absolveVotes, confession.condemnVotes);
  const score = getScore(confession.absolveVotes, confession.condemnVotes);
  const variants = resolveVariants(
    {
      hidden: { opacity: 0, x: -8, borderLeftWidth: 0 },
      visible: { opacity: 1, x: 0, borderLeftWidth: 2 },
    },
    reducedMotion
  );
  const t = resolveTransition(spring.gentle, reducedMotion);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={t}
      className="border-l-wine/30"
      style={{ borderLeftStyle: "solid", borderLeftColor: "oklch(0.45 0.11 25 / 0.3)" }}
    >
      <Surface as="article" hover>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge tone="plum" size="sm">
              u/{confession.authorLabel}
            </Badge>
            {confession.isUser && (
              <span className="text-[10px] uppercase tracking-wider text-wine">
                Your post
              </span>
            )}
          </div>
          <motion.div
            key={`${verdict}-${score}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={resolveTransition(spring.gentle, reducedMotion)}
          >
            <Badge tone={verdictTones[verdict]}>{verdictLabels[verdict]}</Badge>
          </motion.div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-ink">{confession.content}</p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={userVote === "absolve" ? "success" : "ghost"}
              accent="wine"
              size="sm"
              disabled={votingDisabled}
              onClick={() => onVote(confession.id, "absolve")}
              className={cn(
                userVote !== "absolve" &&
                  "hover:border-green-500/40 hover:text-green-400"
              )}
            >
              <ThumbsUp className="h-4 w-4" />
              Absolve
              <motion.span
                key={confession.absolveVotes}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-xs"
              >
                {confession.absolveVotes}
              </motion.span>
            </Button>
            <Button
              variant={userVote === "condemn" ? "danger" : "ghost"}
              accent="ember"
              size="sm"
              disabled={votingDisabled}
              onClick={() => onVote(confession.id, "condemn")}
            >
              <ThumbsDown className="h-4 w-4" />
              Condemn
              <motion.span
                key={confession.condemnVotes}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-xs"
              >
                {confession.condemnVotes}
              </motion.span>
            </Button>
          </div>
          <div className="text-right">
            <motion.p
              key={score}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={resolveTransition(spring.gentle, reducedMotion)}
              className="font-mono text-sm font-bold text-plum"
            >
              {score > 0 ? "+" : ""}
              {score}
            </motion.p>
            <p className="text-[10px] text-ink-soft">salvation pts</p>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-ink-soft">
          {new Date(confession.createdAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" · "}
          Tap again to remove vote
        </p>
      </Surface>
    </motion.div>
  );
}

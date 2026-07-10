"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { Confession, VoteType } from "@/lib/confessionalTypes";
import { getVerdict, getScore } from "@/lib/confessionalTypes";
import { cn } from "@/lib/utils";
import { Badge, Button, Surface } from "@/components/ui";
import type { Accent, SemanticStatus } from "@/components/ui/tokens";

interface ConfessionCardProps {
  confession: Confession;
  userVote: VoteType | null;
  onVote: (id: string, vote: VoteType) => void;
  /** Demo seed posts — votes are display-only. */
  demoOnly?: boolean;
  /** Guest: buttons stay enabled and call onGuestVote instead of casting. */
  requiresAuth?: boolean;
  onGuestVote?: () => void;
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
  demoOnly = false,
  requiresAuth = false,
  onGuestVote,
}: ConfessionCardProps) {
  const verdict = getVerdict(confession.absolveVotes, confession.condemnVotes);
  const score = getScore(confession.absolveVotes, confession.condemnVotes);

  function handleVote(vote: VoteType) {
    if (demoOnly) return;
    if (requiresAuth) {
      onGuestVote?.();
      return;
    }
    onVote(confession.id, vote);
  }

  return (
    <Surface as="article" accent="plum" accentTint hover padding="lg">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3">
        <div className="flex items-center gap-2">
          <Badge tone="plum" size="sm">
            {confession.authorLabel}
          </Badge>
          {confession.isUser && (
            <span className="verse-ref text-wine">Your post</span>
          )}
        </div>
        <Badge tone={verdictTones[verdict]}>{verdictLabels[verdict]}</Badge>
      </div>

      <p className="text-contain mb-4 text-sm leading-relaxed text-ink">{confession.content}</p>

      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 border-t border-rule pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={userVote === "absolve" ? "success" : "ghost"}
            accent="wine"
            size="sm"
            disabled={demoOnly}
            onClick={() => handleVote("absolve")}
            className={cn(
              userVote !== "absolve" &&
                "hover:border-green-500/30 hover:text-green-400"
            )}
          >
            <ThumbsUp className="h-4 w-4" />
            Absolve
            <span className="font-mono text-xs">{confession.absolveVotes}</span>
          </Button>
          <Button
            variant={userVote === "condemn" ? "danger" : "ghost"}
            accent="ember"
            size="sm"
            disabled={demoOnly}
            onClick={() => handleVote("condemn")}
          >
            <ThumbsDown className="h-4 w-4" />
            Condemn
            <span className="font-mono text-xs">{confession.condemnVotes}</span>
          </Button>
        </div>
        <div className="w-full text-right sm:w-auto">
          <p className="font-mono text-sm font-bold text-plum">
            {score > 0 ? "+" : ""}
            {score}
          </p>
          <p className="verse-ref text-ink-soft">salvation pts</p>
        </div>
      </div>

      {demoOnly && (
        <p className="verse-ref mt-2 text-ink-soft">
          Votes are for display only.
        </p>
      )}
      {requiresAuth && !demoOnly && (
        <p className="verse-ref mt-2 text-ink-soft">
          Sign in to cast a real vote.
        </p>
      )}

      <p className="verse-ref mt-3 text-ink-soft">
        {new Date(confession.createdAt).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
        {" · "}
        {!demoOnly && !requiresAuth && "Tap again to remove vote"}
      </p>
    </Surface>
  );
}

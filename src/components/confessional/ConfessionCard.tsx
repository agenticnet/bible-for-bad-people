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
}: ConfessionCardProps) {
  const verdict = getVerdict(confession.absolveVotes, confession.condemnVotes);
  const score = getScore(confession.absolveVotes, confession.condemnVotes);

  return (
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
        <Badge tone={verdictTones[verdict]}>{verdictLabels[verdict]}</Badge>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-ink">{confession.content}</p>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={userVote === "absolve" ? "success" : "ghost"}
            accent="wine"
            size="sm"
            onClick={() => onVote(confession.id, "absolve")}
            className={cn(
              userVote !== "absolve" &&
                "hover:border-green-500/40 hover:text-green-400"
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
            onClick={() => onVote(confession.id, "condemn")}
          >
            <ThumbsDown className="h-4 w-4" />
            Condemn
            <span className="font-mono text-xs">{confession.condemnVotes}</span>
          </Button>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-bold text-plum">
            {score > 0 ? "+" : ""}
            {score}
          </p>
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
  );
}

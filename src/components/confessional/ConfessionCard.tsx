"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { Confession, VoteType } from "@/lib/confessionalTypes";
import { getVerdict, getScore } from "@/lib/confessionalTypes";
import { cn } from "@/lib/utils";

interface ConfessionCardProps {
  confession: Confession;
  userVote: VoteType | null;
  onVote: (id: string, vote: VoteType) => void;
}

export default function ConfessionCard({
  confession,
  userVote,
  onVote,
}: ConfessionCardProps) {
  const verdict = getVerdict(confession.absolveVotes, confession.condemnVotes);
  const score = getScore(confession.absolveVotes, confession.condemnVotes);

  const verdictStyles = {
    absolved: "border-green-500/30 text-green-400",
    condemned: "border-neon-red/30 text-neon-red",
    split: "border-neon-purple/30 text-neon-purple",
  };

  const verdictLabels = {
    absolved: "Leaning Absolved",
    condemned: "Leaning Condemned",
    split: "Jury Split",
  };

  return (
    <article className="rounded-xl border border-ash bg-shadow p-5 transition-all hover:border-ash/80">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-neon-purple/30 bg-neon-purple/10 px-2.5 py-0.5 font-mono text-[10px] text-neon-purple">
            u/{confession.authorLabel}
          </span>
          {confession.isUser && (
            <span className="text-[10px] uppercase tracking-wider text-neon-gold">
              Your post
            </span>
          )}
        </div>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider",
            verdictStyles[verdict]
          )}
        >
          {verdictLabels[verdict]}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-bone">{confession.content}</p>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onVote(confession.id, "absolve")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all",
              userVote === "absolve"
                ? "border-green-500/50 bg-green-500/15 text-green-400"
                : "border-ash text-muted hover:border-green-500/40 hover:text-green-400"
            )}
          >
            <ThumbsUp className="h-4 w-4" />
            Absolve
            <span className="font-mono text-xs">{confession.absolveVotes}</span>
          </button>
          <button
            type="button"
            onClick={() => onVote(confession.id, "condemn")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all",
              userVote === "condemn"
                ? "border-neon-red/50 bg-neon-red/15 text-neon-red"
                : "border-ash text-muted hover:border-neon-red/40 hover:text-neon-red"
            )}
          >
            <ThumbsDown className="h-4 w-4" />
            Condemn
            <span className="font-mono text-xs">{confession.condemnVotes}</span>
          </button>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-bold text-neon-purple">
            {score > 0 ? "+" : ""}
            {score}
          </p>
          <p className="text-[10px] text-muted/60">salvation pts</p>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-muted/40">
        {new Date(confession.createdAt).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
        {" · "}
        Tap again to remove vote
      </p>
    </article>
  );
}

"use client";

import type { LeaderboardEntry } from "@/lib/indulgenceTypes";
import { SectionHeader, Surface } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
  userRank: number | null;
}

export default function LeaderboardPanel({
  entries,
  userRank,
}: LeaderboardPanelProps) {
  return (
    <div>
      <SectionHeader
        kicker="Salvation Rankings"
        title="Least Likely to Go to Hell"
        description="Higher Salvation Score = better odds. Buy indulgences to climb. Log sins in the Sin Engine to fall. Capitalism meets eschatology."
        accent="wine"
      />

      {userRank && (
        <p className={cn("mb-6 text-sm", accentStyles.wine.text)}>
          Your rank: <span className="font-bold">#{userRank}</span>
        </p>
      )}

      <Surface padding="none" className="overflow-hidden">
        <div className="grid grid-cols-[3rem_1fr_5rem] gap-2 border-b border-rule bg-smoke px-4 py-2">
          <span className="verse-ref text-ink-soft">Rank</span>
          <span className="verse-ref text-ink-soft">Sinner</span>
          <span className="verse-ref text-right text-ink-soft">Score</span>
        </div>
        <ul>
          {entries.map((entry, index) => {
            const rank = index + 1;
            return (
              <li
                key={entry.id}
                className={cn(
                  "grid grid-cols-[3rem_1fr_5rem] gap-2 border-b border-rule px-4 py-3 last:border-0",
                  entry.isUser ? "bg-wine/10" : "bg-page"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-sm font-bold",
                    rank <= 3 ? accentStyles.wine.text : "text-ink-soft"
                  )}
                >
                  {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      entry.isUser ? accentStyles.wine.text : "text-ink"
                    )}
                  >
                    {entry.displayName}
                    {entry.isUser && " (You)"}
                  </p>
                  {entry.badge && (
                    <p className="verse-ref truncate text-ink-soft">{entry.badge}</p>
                  )}
                </div>
                <span
                  className={cn(
                    "text-right font-mono text-sm font-bold",
                    entry.salvationScore >= 50
                      ? accentStyles.wine.text
                      : accentStyles.ember.text
                  )}
                >
                  {entry.salvationScore}
                </span>
              </li>
            );
          })}
        </ul>
      </Surface>
    </div>
  );
}

"use client";

import type { LeaderboardEntry } from "@/lib/indulgenceTypes";
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
      <div className="mb-6">
        <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-neon-gold">
          Salvation Rankings
        </p>
        <h2
          className="text-xl font-bold text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Least Likely to Go to Hell
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Higher Salvation Score = better odds. Buy indulgences to climb. Log sins
          in the Sin Engine to fall. Capitalism meets eschatology.
        </p>
        {userRank && (
          <p className="mt-2 text-sm text-neon-gold">
            Your rank: <span className="font-bold">#{userRank}</span>
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-rule">
        <div className="grid grid-cols-[3rem_1fr_5rem] gap-2 border-b border-rule bg-smoke px-4 py-2 text-[10px] uppercase tracking-wider text-ink-soft">
          <span>Rank</span>
          <span>Sinner</span>
          <span className="text-right">Score</span>
        </div>
        <ul>
          {entries.map((entry, index) => {
            const rank = index + 1;
            return (
              <li
                key={entry.id}
                className={cn( "grid grid-cols-[3rem_1fr_5rem] gap-2 border-b border-rule px-4 py-3 last:border-0", entry.isUser ? "bg-neon-gold/10 border-l-2 border-l-neon-gold" : "bg-page" )}
              >
                <span
                  className={cn( "font-mono text-sm font-bold", rank <= 3 ? "text-neon-gold" : "text-ink-soft" )}
                >
                  {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn( "truncate text-sm font-medium", entry.isUser ? "text-neon-gold" : "text-ink" )}
                  >
                    {entry.displayName}
                    {entry.isUser && " (You)"}
                  </p>
                  {entry.badge && (
                    <p className="truncate text-[10px] text-ink-soft">{entry.badge}</p>
                  )}
                </div>
                <span
                  className={cn( "text-right font-mono text-sm font-bold", entry.salvationScore >= 80 ? "text-success" : entry.salvationScore >= 50 ? "text-neon-gold" : "text-neon-red" )}
                >
                  {entry.salvationScore}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

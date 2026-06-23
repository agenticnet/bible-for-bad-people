"use client";

import { useState, useEffect } from "react";
import { Check, Circle, Sparkles } from "lucide-react";
import type { SinEntry } from "@/lib/sinTypes";
import { getDailySins, getDateKey } from "@/lib/sinLibrary";
import {
  loadDailyCompleted,
  markDailySinDone,
  unmarkDailySinDone,
  addToSinLog,
} from "@/lib/sinStorage";
import { generateSinId } from "@/lib/sinTranslationEngine";
import { cn } from "@/lib/utils";

interface DailySinChecklistProps {
  onLogUpdate: () => void;
}

export default function DailySinChecklist({ onLogUpdate }: DailySinChecklistProps) {
  const dateKey = getDateKey();
  const [dailySins, setDailySins] = useState<SinEntry[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  const formattedDate = new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    setMounted(true);
    setDailySins(getDailySins(dateKey, 7));
    setCompleted(loadDailyCompleted(dateKey));
  }, [dateKey]);

  function toggleSin(sin: SinEntry) {
    const isDone = completed.has(sin.id);

    if (isDone) {
      setCompleted(unmarkDailySinDone(dateKey, sin.id));
    } else {
      setCompleted(markDailySinDone(dateKey, sin.id));
      addToSinLog({
        id: generateSinId(),
        sinId: sin.id,
        petty: sin.petty,
        translation: sin.translation,
        completedAt: new Date().toISOString(),
        source: "daily",
      });
      onLogUpdate();
    }
  }

  if (!mounted) return null;

  const doneCount = dailySins.filter((s) => completed.has(s.id)).length;

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-neon-pink">
          Today&apos;s Suggested Sins
        </p>
        <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-display)" }}>
          Daily Petty Sin Checklist
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{formattedDate}</p>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Seven morally flexible todos for your day. Check them off when completed
          — or aspirational, we don&apos;t judge. Fresh list tomorrow; Grok API later.
        </p>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-lg border border-neon-pink/20 bg-neon-pink/5 px-4 py-3">
        <Sparkles className="h-4 w-4 shrink-0 text-neon-pink" />
        <p className="text-sm text-ink-soft">
          <span className="font-semibold text-neon-pink">{doneCount}/7</span> sins
          logged today. Complete the set for absolutely no reward.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {dailySins.map((sin, index) => {
          const isDone = completed.has(sin.id);
          return (
            <li key={sin.id}>
              <button
                type="button"
                onClick={() => toggleSin(sin)}
                className={cn( "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all", isDone ? "border-neon-pink/30 bg-neon-pink/5 opacity-80" : "border-rule bg-page hover:border-neon-pink/30 hover:bg-smoke" )}
              >
                <div
                  className={cn( "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border", isDone ? "border-neon-pink bg-neon-pink/20 text-neon-pink" : "border-rule text-ink-soft" )}
                >
                  {isDone ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-soft">
                    Sin #{index + 1} · {sin.difficulty}
                  </p>
                  <p
                    className={cn( "text-sm font-medium text-ink", isDone && "line-through decoration-neon-pink/50" )}
                  >
                    {sin.petty}
                  </p>
                  {isDone && (
                    <p className="mt-2 text-xs italic leading-relaxed text-neon-pink">
                      {sin.translation}
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Check, Circle, Sparkles } from "lucide-react";
import type { SinEntry } from "@/lib/sinTypes";
import { getDateKey } from "@/lib/dateKey";
import { getDailySins } from "@/lib/sinLibrary";
import {
  fetchDailyCompleted,
  saveDailyCompleted,
  addSinLogItem,
} from "@/lib/data/sin";
import { Callout, OptionTile, SectionHeader } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface DailySinChecklistProps {
  onLogUpdate: () => void;
}

export default function DailySinChecklist({ onLogUpdate }: DailySinChecklistProps) {
  const dateKey = getDateKey();
  const [dailySins] = useState(() => getDailySins(dateKey, 7));
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const formattedDate = new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    void fetchDailyCompleted(dateKey).then((ids) => setCompleted(new Set(ids)));
  }, [dateKey]);

  async function toggleSin(sin: SinEntry) {
    const isDone = completed.has(sin.id);
    const next = new Set(completed);

    if (isDone) {
      next.delete(sin.id);
    } else {
      next.add(sin.id);
      await addSinLogItem({
        sinId: sin.id,
        petty: sin.petty,
        translation: sin.translation,
        completedAt: new Date().toISOString(),
        source: "daily",
      });
      onLogUpdate();
    }

    setCompleted(next);
    await saveDailyCompleted(dateKey, [...next]);
  }

  const doneCount = dailySins.filter((s) => completed.has(s.id)).length;

  return (
    <div>
      <SectionHeader
        kicker="Today's Suggested Sins"
        title="Daily Petty Sin Checklist"
        description={`${formattedDate}. Seven morally flexible todos for your day. Check them off when completed — or aspirational, we don't judge.`}
        accent="terra"
      />

      <Callout tone="terra" className="mb-4 flex items-center gap-3">
        <Sparkles className="h-4 w-4 shrink-0" />
        <p className="text-sm text-ink-soft">
          <span className={cn("font-semibold", accentStyles.terra.text)}>
            {doneCount}/7
          </span>{" "}
          sins logged today. Complete the set for absolutely no reward.
        </p>
      </Callout>

      <ul className="flex flex-col gap-3">
        {dailySins.map((sin, index) => {
          const isDone = completed.has(sin.id);
          return (
            <li key={sin.id}>
              <OptionTile
                selected={isDone}
                accent="terra"
                layout="row"
                onClick={() => void toggleSin(sin)}
                className={cn("w-full items-start gap-4 p-4", isDone && "opacity-80")}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                    isDone
                      ? "border-terra bg-terra/20 text-terra"
                      : "border-rule text-ink-soft"
                  )}
                >
                  {isDone ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="verse-ref mb-1 text-ink-soft">
                    Sin #{index + 1} · {sin.difficulty}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-medium text-ink",
                      isDone && "line-through decoration-terra/50"
                    )}
                  >
                    {sin.petty}
                  </p>
                  {isDone && (
                    <p className={cn("mt-2 text-xs italic leading-relaxed", accentStyles.terra.text)}>
                      {sin.translation}
                    </p>
                  )}
                </div>
              </OptionTile>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

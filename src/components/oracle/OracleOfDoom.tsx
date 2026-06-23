"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, Skull } from "lucide-react";
import DoomCardDisplay from "./DoomCardDisplay";
import type { DailyReading } from "@/lib/oracleTypes";
import { SPREAD_LABELS } from "@/lib/oracleTypes";
import {
  generateDailyReading,
  getDateKey,
  loadReading,
  saveReading,
} from "@/lib/mockOracleDeck";
import {
  Button,
  PageShell,
  Surface,
  VisionsBadge,
} from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

export default function OracleOfDoom() {
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dateKey = getDateKey();
  const formattedDate = new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    setMounted(true);
    const stored = loadReading(dateKey);
    if (stored) {
      setReading(stored);
      setCardsRevealed(stored.revealed);
    } else {
      const generated = generateDailyReading(dateKey);
      setReading({ ...generated, revealed: false });
    }
  }, [dateKey]);

  const revealReading = useCallback(() => {
    if (!reading || revealing || cardsRevealed) return;

    setRevealing(true);

    setTimeout(() => {
      setCardsRevealed(true);
      const updated = { ...reading, revealed: true };
      setReading(updated);
      saveReading(updated);
      setRevealing(false);
    }, 1200);
  }, [reading, revealing, cardsRevealed]);

  if (!mounted || !reading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-parchment">
        <p className="text-ink-soft">Consulting the void...</p>
      </div>
    );
  }

  return (
    <PageShell maxWidth="lg">
      <header className="mb-10 text-center">
        <VisionsBadge className="mb-4 inline-flex" />
        <h1 className={cn("mb-3 font-serif text-3xl font-bold sm:text-4xl", accentStyles.plum.text)}>
          Oracle of Doom
        </h1>
        <p className="text-sm text-ink-soft">{formattedDate}</p>
        <p className="mx-auto mt-2 max-w-lg text-ink-soft">
          Your daily tarot reading — brutally honest, zero toxic positivity,
          maximum existential dread.
        </p>
      </header>

      {cardsRevealed && (
        <div className="mb-10 flex justify-center">
          <Surface accent="ember" accentTint className="px-8 py-4 text-center">
            <p className={cn("verse-ref mb-1", accentStyles.ember.text)}>
              Today&apos;s Doom Score
            </p>
            <p className={cn("text-5xl font-bold", accentStyles.ember.text)}>
              {reading.doomScore}
              <span className="text-lg text-ink-soft">/10</span>
            </p>
          </Surface>
        </div>
      )}

      <div className="mb-10 grid gap-8 sm:grid-cols-3">
        {reading.cards.map((card, i) => (
          <DoomCardDisplay
            key={card.id}
            card={card}
            label={SPREAD_LABELS[i]}
            revealed={cardsRevealed}
            delay={i * 200}
          />
        ))}
      </div>

      {cardsRevealed && (
        <Surface accent="plum" accentTint className="mx-auto mb-10 max-w-2xl text-center" padding="lg">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Skull className={cn("h-4 w-4", accentStyles.plum.text)} />
            <p className={cn("verse-ref", accentStyles.plum.text)}>The Oracle Has Spoken</p>
          </div>
          <p className="scripture-block text-lg leading-relaxed text-ink-soft">
            {reading.summary}
          </p>
          <p className="mt-4 text-xs text-ink-soft">
            This reading is locked until tomorrow. The cards do not do refunds,
            rerolls, or emotional support.
          </p>
        </Surface>
      )}

      {!cardsRevealed && (
        <div className="flex justify-center">
          <Button
            accent="plum"
            className="rounded-xl px-10 py-4 text-base"
            onClick={revealReading}
            disabled={revealing}
          >
            <Eye className="h-5 w-5" />
            {revealing ? "The cards are turning..." : "Reveal Your Daily Doom"}
          </Button>
        </div>
      )}

      {cardsRevealed && (
        <p className="text-center text-xs text-ink-soft">
          Come back tomorrow for a fresh reading. Same doom, different cards.
        </p>
      )}
    </PageShell>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Eye, Skull } from "lucide-react";
import DoomCardDisplay from "./DoomCardDisplay";
import type { DailyReading } from "@/lib/oracleTypes";
import { SPREAD_LABELS } from "@/lib/oracleTypes";
import {
  generateDailyReading,
  getDateKey,
  loadReading,
  saveReading,
} from "@/lib/mockOracleDeck";

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
    <div className="min-h-dvh bg-parchment">
      {/* Top bar */}
      <div className="border-b border-ivory/10 bg-binding px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-sm border border-ivory/15 px-3 py-1.5 text-sm text-binding-muted transition-colors hover:border-ivory/30 hover:text-binding-ivory"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-neon-purple" />
            <span className="text-xs uppercase tracking-[0.25em] text-neon-purple">
              Visions Approximate
            </span>
          </div>
          <h1
            className="mb-3 text-3xl font-bold text-neon-purple sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Oracle of Doom
          </h1>
          <p className="text-sm text-ink-soft">{formattedDate}</p>
          <p className="mx-auto mt-2 max-w-lg text-ink-soft">
            Your daily tarot reading — brutally honest, zero toxic positivity,
            maximum existential dread.
          </p>
        </div>

        {/* Doom score — shown after reveal */}
        {cardsRevealed && (
          <div className="mb-10 flex justify-center">
            <div className="rounded-xl border border-neon-red/30 bg-neon-red/5 px-8 py-4 text-center">
              <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-neon-red">
                Today&apos;s Doom Score
              </p>
              <p className="text-5xl font-bold text-neon-red">
                {reading.doomScore}
                <span className="text-lg text-ink-soft">/10</span>
              </p>
            </div>
          </div>
        )}

        {/* Card spread */}
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

        {/* Summary */}
        {cardsRevealed && (
          <div className="mx-auto mb-10 max-w-2xl rounded-xl border border-neon-purple/30 bg-neon-purple/5 p-6 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Skull className="h-4 w-4 text-neon-purple" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-neon-purple">
                The Oracle Has Spoken
              </p>
            </div>
            <p
              className="text-lg leading-relaxed text-ink-soft"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {reading.summary}
            </p>
            <p className="mt-4 text-xs text-ink-soft">
              This reading is locked until tomorrow. The cards do not do
              refunds, rerolls, or emotional support.
            </p>
          </div>
        )}

        {/* Reveal button */}
        {!cardsRevealed && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={revealReading}
              disabled={revealing}
              className="group flex items-center gap-3 rounded-xl border border-neon-purple/60 bg-neon-purple/15 px-10 py-4 text-base font-semibold text-neon-purple transition-all hover:border-neon-purple hover:bg-neon-purple/25 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-60"
            >
              <Eye className="h-5 w-5 transition-transform group-hover:scale-110" />
              {revealing ? "The cards are turning..." : "Reveal Your Daily Doom"}
            </button>
          </div>
        )}

        {cardsRevealed && (
          <p className="text-center text-xs text-ink-soft">
            Come back tomorrow for a fresh reading. Same doom, different cards.
          </p>
        )}
      </div>
    </div>
  );
}

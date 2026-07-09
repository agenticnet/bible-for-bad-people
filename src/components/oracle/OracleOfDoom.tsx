"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, Skull, Sparkles } from "lucide-react";
import DoomCardDisplay from "./DoomCardDisplay";
import PostSignupWelcome from "./PostSignupWelcome";
import type { DailyReading } from "@/lib/oracleTypes";
import { SPREAD_LABELS } from "@/lib/oracleTypes";
import {
  generateDailyReading,
  loadReading,
  saveReading,
} from "@/lib/mockOracleDeck";
import { getDateKey } from "@/lib/dateKey";
import { fetchOracleReading, saveOracleReading } from "@/lib/data/smite-oracle";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthSavePrompt } from "@/components/auth/AuthGate";
import {
  Button,
  ChamberHeader,
  PageShell,
  Surface,
} from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";
import { isWelcomeComplete } from "@/lib/ux/welcome";

export default function OracleOfDoom() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const [welcomeActive, setWelcomeActive] = useState(false);

  useEffect(() => {
    const isWelcomeParam = searchParams.get("welcome") === "1";
    setWelcomeActive(isWelcomeParam && !isWelcomeComplete());
  }, [searchParams]);

  const dateKey = getDateKey();
  const formattedDate = new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    async function load() {
      if (user) {
        const stored = await fetchOracleReading(dateKey);
        if (stored) {
          setReading(stored);
          setCardsRevealed(stored.revealed);
          return;
        }
      } else {
        const local = loadReading(dateKey);
        if (local) {
          setReading(local);
          setCardsRevealed(local.revealed);
          return;
        }
      }

      const generated = generateDailyReading(dateKey);
      setReading({ ...generated, revealed: false });
    }

    void load();
  }, [dateKey, user]);

  const revealReading = useCallback(() => {
    if (!reading || revealing || cardsRevealed) return;

    setRevealing(true);

    setTimeout(() => {
      setCardsRevealed(true);
      const updated = { ...reading, revealed: true };
      setReading(updated);

      if (user) {
        void saveOracleReading(updated);
      } else {
        saveReading(updated);
      }

      setRevealing(false);
    }, 1200);
  }, [reading, revealing, cardsRevealed, user]);

  if (!reading) {
    return (
      <PageShell maxWidth="lg">
        <p className="text-center text-ink-soft">Consulting the void...</p>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="lg">
      <ChamberHeader
        icon={Sparkles}
        accent="plum"
        align="center"
        title="Oracle of Doom"
        badge="Visions Approximate"
        className="mb-10 border-b border-rule pb-8"
      >
        <p className="verse-ref mt-2 text-ink-soft">
          Daily spread · {formattedDate}
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-soft">
          Your daily tarot reading — brutally honest, zero toxic positivity,
          maximum existential dread.
        </p>
      </ChamberHeader>

      <PostSignupWelcome active={welcomeActive} cardsRevealed={cardsRevealed} />

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

      {cardsRevealed && !user && (
        <div className="mx-auto mb-6 max-w-md">
          <AuthSavePrompt
            lossContext="oracle"
            label="Lock in today's doom"
            className="rounded-xl border border-rule bg-page p-4 text-center"
          />
        </div>
      )}

      {cardsRevealed && (
        <p className="text-center text-xs text-ink-soft">
          Come back tomorrow for a fresh reading. {user ? "Synced to your account." : ""}
        </p>
      )}
    </PageShell>
  );
}

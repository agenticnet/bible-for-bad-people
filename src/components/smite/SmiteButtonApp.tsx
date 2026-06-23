"use client";

import { useState, useEffect, useCallback } from "react";
import { Crown, History, Zap } from "lucide-react";
import SmiteAnimation from "./SmiteAnimation";
import SmiteResultCard from "./SmiteResultCard";
import type { PlagueType, SmiteRecord, SmiteTarget } from "@/lib/smiteTypes";
import {
  TARGET_LABELS,
  TARGET_ICONS,
  PLAGUE_LABELS,
  PLAGUE_ICONS,
  FREE_DAILY_LIMIT,
  PREMIUM_PRICE,
} from "@/lib/smiteTypes";
import { generateSmiteResult, generateSmiteId } from "@/lib/smiteEngine";
import {
  fetchSmiteHistory,
  addSmiteRecord as addSmiteRecordServer,
  fetchDailySmiteCount,
  incrementDailySmiteCount,
} from "@/lib/data/smite-oracle";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthGate from "@/components/auth/AuthGate";
import { getDateKey } from "@/lib/sinLibrary";
import {
  Input,
  OptionTile,
  PageShell,
  Surface,
  VisionsBadge,
} from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

const TARGETS = Object.keys(TARGET_LABELS) as SmiteTarget[];
const PLAGUES = Object.keys(PLAGUE_LABELS) as PlagueType[];

export default function SmiteButtonApp() {
  const { user } = useAuth();
  const [target, setTarget] = useState<SmiteTarget>("boss");
  const [plague, setPlague] = useState<PlagueType>("locusts");
  const [customName, setCustomName] = useState("");
  const [premium, setPremium] = useState(false);
  const [smiteing, setSmiteing] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastResult, setLastResult] = useState<SmiteRecord | null>(null);
  const [history, setHistory] = useState<SmiteRecord[]>([]);
  const [dailyCount, setDailyCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dateKey = getDateKey();

  useEffect(() => {
    setMounted(true);
    if (user) {
      void fetchSmiteHistory().then(setHistory);
      void fetchDailySmiteCount(dateKey).then(setDailyCount);
    } else {
      setHistory([]);
      setDailyCount(0);
    }
  }, [dateKey, user]);

  const freeRemaining = Math.max(FREE_DAILY_LIMIT - dailyCount, 0);
  const needsPremium = freeRemaining <= 0;

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
    setSmiteing(false);
  }, []);

  function handleSmite() {
    if (smiteing || !user) return;
    if (target === "custom" && !customName.trim()) return;

    const usePremium = premium || needsPremium;

    setSmiteing(true);
    setShowAnimation(true);
    setLastResult(null);

    const { result, visualDescription } = generateSmiteResult(
      target,
      plague,
      customName,
      usePremium
    );

    setTimeout(async () => {
      const record: SmiteRecord = {
        id: generateSmiteId(),
        target,
        targetLabel: TARGET_LABELS[target],
        customName: target === "custom" ? customName : undefined,
        plague,
        tier: usePremium ? "premium" : "free",
        result,
        visualDescription,
        smoteAt: new Date().toISOString(),
        pricePaid: usePremium ? PREMIUM_PRICE : 0,
      };

      if (!usePremium) {
        const { count } = await incrementDailySmiteCount(dateKey);
        setDailyCount(count);
      }

      const saved = await addSmiteRecordServer(record);
      if (saved.record) {
        setHistory((prev) => [saved.record!, ...prev].slice(0, 50));
        setLastResult(saved.record);
      }
    }, 2200);
  }

  if (!mounted) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-parchment">
        <p className="text-ink-soft">Charging the smite cannon...</p>
      </div>
    );
  }

  return (
    <>
      {showAnimation && (
        <SmiteAnimation
          plague={plague}
          active={showAnimation}
          onComplete={handleAnimationComplete}
        />
      )}

      <PageShell maxWidth="md">
        <header className="mb-8 text-center">
          <VisionsBadge className="mb-4 inline-flex" />
          <h1 className={cn("mb-2 font-serif text-3xl font-bold sm:text-4xl", accentStyles.ember.text)}>
            Smite Button
          </h1>
          <p className="mx-auto max-w-lg text-sm text-ink-soft">
            Digitally smite minor inconveniences with classic biblical plagues.
            Free smites daily. Premium tier includes mock AI smiting visuals.
          </p>
          <p className={cn("mt-3 text-sm", accentStyles.wine.text)}>
            Free smites remaining today:{" "}
            <span className="font-bold">{freeRemaining}</span> / {FREE_DAILY_LIMIT}
          </p>
        </header>

        <section className="mb-8">
          <h2 className="verse-ref mb-3 text-ink-soft">Select Target</h2>
          <div className="grid grid-cols-3 gap-2">
            {TARGETS.filter((t) => t !== "custom").map((t) => (
              <OptionTile
                key={t}
                selected={target === t}
                accent="ember"
                onClick={() => setTarget(t)}
              >
                <span className="text-2xl">{TARGET_ICONS[t]}</span>
                <span className="text-[10px] leading-tight sm:text-xs">
                  {TARGET_LABELS[t]}
                </span>
              </OptionTile>
            ))}
          </div>
          <OptionTile
            className="mt-2 w-full"
            layout="row"
            selected={target === "custom"}
            accent="ember"
            onClick={() => setTarget("custom")}
          >
            🎯 Custom Target
          </OptionTile>
          {target === "custom" && (
            <Input
              accent="ember"
              className="mt-2"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Name thy enemy..."
              maxLength={60}
            />
          )}
        </section>

        <section className="mb-8">
          <h2 className="verse-ref mb-3 text-ink-soft">Choose Plague</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PLAGUES.map((p) => (
              <OptionTile
                key={p}
                layout="row"
                selected={plague === p}
                accent="ember"
                onClick={() => setPlague(p)}
              >
                <span className="text-xl">{PLAGUE_ICONS[p]}</span>
                <span className="text-xs text-ink">{PLAGUE_LABELS[p]}</span>
              </OptionTile>
            ))}
          </div>
        </section>

        <Surface accent="wine" accentTint className="mb-8" padding="sm">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={premium || needsPremium}
              onChange={(e) => setPremium(e.target.checked)}
              disabled={needsPremium}
              className="mt-1 accent-wine"
            />
            <div>
              <p className={cn("flex items-center gap-2 text-sm font-semibold", accentStyles.wine.text)}>
                <Crown className="h-4 w-4" />
                Premium Smite (+ AI Visual Mock) — ${PREMIUM_PRICE.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {needsPremium
                  ? "Free smites exhausted. Premium required for more smiting today."
                  : "Optional cinematic smite description. Real AI video when Grok API arrives."}
              </p>
            </div>
          </label>
        </Surface>

        <div className="mb-8 flex justify-center">
          <AuthGate
            tone="ember"
            title="Sign in to smite"
            description="Configure your plague for free. Log in to unleash digital wrath and save your smite history."
          >
            <button
              type="button"
              onClick={handleSmite}
              disabled={smiteing || (target === "custom" && !customName.trim())}
              className={cn(
                "group flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 transition-colors disabled:opacity-50 sm:h-40 sm:w-40",
                accentStyles.ember.border,
                accentStyles.ember.bg,
                accentStyles.ember.text,
                accentStyles.ember.bgHover
              )}
            >
              <Zap className="mb-1 h-10 w-10 transition-transform group-hover:scale-110 sm:h-12 sm:w-12" />
              <span className="text-sm font-bold uppercase tracking-[0.2em] sm:text-base">
                {smiteing ? "..." : "Smite"}
              </span>
            </button>
          </AuthGate>
        </div>

        {lastResult && !smiteing && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-ink">Latest Smite Report</h2>
            <SmiteResultCard record={lastResult} />
          </section>
        )}

        <section>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="mb-4 flex items-center gap-2 text-sm text-ink-soft hover:text-ink"
          >
            <History className="h-4 w-4" />
            Smite History ({history.length})
          </button>
          {showHistory && history.length > 0 && (
            <div className="flex flex-col gap-3">
              {history.slice(0, 10).map((record) => (
                <SmiteResultCard key={record.id} record={record} />
              ))}
            </div>
          )}
          {showHistory && history.length === 0 && (
            <p className="text-sm text-ink-soft">No smites yet. The world remains unscathed.</p>
          )}
        </section>

        <p className="mt-10 text-center text-xs text-ink-soft">
          Smite effectiveness not guaranteed. Side effects may include karma, guilt, and
          divine support tickets. File at /support-desk.
        </p>
      </PageShell>
    </>
  );
}

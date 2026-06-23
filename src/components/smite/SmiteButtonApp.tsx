"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  History,
  Sparkles,
  Zap,
} from "lucide-react";
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
  addSmiteRecord,
  getDailySmiteCount,
  incrementDailySmiteCount,
  loadSmiteHistory,
} from "@/lib/smiteStorage";
import { getDateKey } from "@/lib/sinLibrary";
import { cn } from "@/lib/utils";

const TARGETS = Object.keys(TARGET_LABELS) as SmiteTarget[];
const PLAGUES = Object.keys(PLAGUE_LABELS) as PlagueType[];

export default function SmiteButtonApp() {
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
    setHistory(loadSmiteHistory());
    setDailyCount(getDailySmiteCount(dateKey));
  }, [dateKey]);

  const freeRemaining = Math.max(FREE_DAILY_LIMIT - dailyCount, 0);
  const needsPremium = freeRemaining <= 0;

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
    setSmiteing(false);
  }, []);

  function handleSmite() {
    if (smiteing) return;
    if (target === "custom" && !customName.trim()) return;

    const usePremium = premium || needsPremium;
    if (usePremium && !premium && needsPremium) {
      // auto premium when out of free smites
    }

    setSmiteing(true);
    setShowAnimation(true);
    setLastResult(null);

    const { result, visualDescription } = generateSmiteResult(
      target,
      plague,
      customName,
      usePremium
    );

    setTimeout(() => {
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
        incrementDailySmiteCount(dateKey);
        setDailyCount(getDailySmiteCount(dateKey));
      }

      addSmiteRecord(record);
      setHistory(loadSmiteHistory());
      setLastResult(record);
    }, 2200);
  }

  if (!mounted) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-void">
        <p className="text-muted">Charging the smite cannon...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-void">
      {showAnimation && (
        <SmiteAnimation
          plague={plague}
          active={showAnimation}
          onComplete={handleAnimationComplete}
        />
      )}

      <div className="border-b border-ash/50 bg-void/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-ash px-3 py-1.5 text-sm text-muted transition-colors hover:border-neon-red/50 hover:text-bone"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-neon-purple" />
            <span className="text-xs uppercase tracking-[0.25em] text-neon-purple">
              Visions Approximate
            </span>
          </div>
          <h1
            className="mb-2 text-3xl font-bold text-neon-red sm:text-4xl"
            style={{
              fontFamily: "var(--font-display)",
              textShadow: "0 0 30px rgba(239, 68, 68, 0.5)",
            }}
          >
            Smite Button
          </h1>
          <p className="mx-auto max-w-lg text-sm text-muted">
            Digitally smite minor inconveniences with classic biblical plagues.
            Free smites daily. Premium tier includes mock AI smiting visuals.
          </p>
          <p className="mt-3 text-sm text-neon-gold">
            Free smites remaining today:{" "}
            <span className="font-bold">{freeRemaining}</span> / {FREE_DAILY_LIMIT}
          </p>
        </div>

        {/* Target selection */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
            Select Target
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
            {TARGETS.filter((t) => t !== "custom").map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTarget(t)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all",
                  target === t
                    ? "border-neon-red/50 bg-neon-red/10 text-neon-red"
                    : "border-ash bg-shadow text-muted hover:border-neon-red/30 hover:text-bone"
                )}
              >
                <span className="text-2xl">{TARGET_ICONS[t]}</span>
                <span className="text-[10px] leading-tight sm:text-xs">
                  {TARGET_LABELS[t]}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTarget("custom")}
            className={cn(
              "mt-2 w-full rounded-xl border p-3 text-sm transition-all",
              target === "custom"
                ? "border-neon-red/50 bg-neon-red/10 text-neon-red"
                : "border-ash bg-shadow text-muted hover:text-bone"
            )}
          >
            🎯 Custom Target
          </button>
          {target === "custom" && (
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Name thy enemy..."
              className="mt-2 w-full rounded-lg border border-ash bg-shadow px-4 py-2.5 text-sm text-bone placeholder:text-muted/50 focus:border-neon-red/50 focus:outline-none"
              maxLength={60}
            />
          )}
        </section>

        {/* Plague selection */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
            Choose Plague
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PLAGUES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlague(p)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
                  plague === p
                    ? "border-neon-red/50 bg-neon-red/10"
                    : "border-ash bg-shadow hover:border-neon-red/30"
                )}
              >
                <span className="text-xl">{PLAGUE_ICONS[p]}</span>
                <span className="text-xs text-bone">{PLAGUE_LABELS[p]}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Premium toggle */}
        <section className="mb-8 rounded-xl border border-neon-gold/25 bg-neon-gold/5 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={premium || needsPremium}
              onChange={(e) => setPremium(e.target.checked)}
              disabled={needsPremium}
              className="mt-1 accent-neon-gold"
            />
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-neon-gold">
                <Crown className="h-4 w-4" />
                Premium Smite (+ AI Visual Mock) — ${PREMIUM_PRICE.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {needsPremium
                  ? "Free smites exhausted. Premium required for more smiting today."
                  : "Optional cinematic smite description. Real AI video when Grok API arrives."}
              </p>
            </div>
          </label>
        </section>

        {/* SMITE BUTTON */}
        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={handleSmite}
            disabled={smiteing || (target === "custom" && !customName.trim())}
            className="group relative flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-neon-red bg-neon-red/20 text-neon-red transition-all hover:border-neon-red hover:bg-neon-red/30 hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] disabled:opacity-50 sm:h-40 sm:w-40"
          >
            <Zap className="mb-1 h-10 w-10 transition-transform group-hover:scale-110 sm:h-12 sm:w-12" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] sm:text-base">
              {smiteing ? "..." : "Smite"}
            </span>
          </button>
        </div>

        {/* Last result */}
        {lastResult && !smiteing && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-bone">Latest Smite Report</h2>
            <SmiteResultCard record={lastResult} />
          </section>
        )}

        {/* History */}
        <section>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="mb-4 flex items-center gap-2 text-sm text-muted hover:text-bone"
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
            <p className="text-sm text-muted">No smites yet. The world remains unscathed.</p>
          )}
        </section>

        <p className="mt-10 text-center text-xs text-muted/40">
          Smite effectiveness not guaranteed. Side effects may include karma, guilt, and
          divine support tickets. File at /support-desk.
        </p>
      </div>
    </div>
  );
}

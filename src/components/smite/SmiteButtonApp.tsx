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
import {
  addSmiteRecord as addSmiteRecordLocal,
  getDailySmiteCount as getLocalDailySmiteCount,
  incrementDailySmiteCount as incrementLocalDailySmiteCount,
  loadSmiteHistory,
} from "@/lib/smiteStorage";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthGate, { AuthSavePrompt } from "@/components/auth/AuthGate";
import { smiteLimitCopy } from "@/lib/auth/upsellCopy";
import { getDateKey } from "@/lib/dateKey";
import {
  ChamberHeader,
  Input,
  OptionTile,
  PageShell,
  Surface,
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

  const dateKey = getDateKey();

  useEffect(() => {
    if (user) {
      void fetchSmiteHistory().then(setHistory);
      void fetchDailySmiteCount(dateKey).then(setDailyCount);
    } else {
      setHistory(loadSmiteHistory());
      setDailyCount(getLocalDailySmiteCount(dateKey));
    }
  }, [dateKey, user]);

  const freeRemaining = Math.max(FREE_DAILY_LIMIT - dailyCount, 0);
  const needsPremium = freeRemaining <= 0;

  useEffect(() => {
    if (needsPremium) {
      setPremium(true);
    } else {
      setPremium(false);
    }
  }, [needsPremium]);

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
    setSmiteing(false);
  }, []);

  function handleSmite() {
    if (smiteing) return;
    if (target === "custom" && !customName.trim()) return;
    if (needsPremium && !premium) return;

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

      if (user) {
        if (!usePremium) {
          const { count } = await incrementDailySmiteCount(dateKey);
          setDailyCount(count);
        }
        const saved = await addSmiteRecordServer(record);
        if (saved.record) {
          setHistory((prev) => [saved.record!, ...prev].slice(0, 50));
          setLastResult(saved.record);
        }
      } else {
        if (!usePremium) {
          const count = incrementLocalDailySmiteCount(dateKey);
          setDailyCount(count);
        }
        const updated = addSmiteRecordLocal(record);
        setHistory(updated);
        setLastResult(record);
      }
    }, 2200);
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
        <ChamberHeader
          icon={Zap}
          accent="ember"
          align="center"
          title="Smite Button"
          badge="Digital plagues"
          subtitle="Digitally smite minor inconveniences with classic biblical plagues. Free smites daily. Premium tier includes a cinematic smite description."
          className="mb-8"
        >
          <p className={cn("mt-3 text-sm", accentStyles.wine.text)}>
            Free smites remaining today:{" "}
            <span className="font-bold">{freeRemaining}</span> / {FREE_DAILY_LIMIT}
          </p>
        </ChamberHeader>

        <section className="mb-8">
          <h2 className="verse-ref mb-3 text-ink-soft">Select Target</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TARGETS.filter((t) => t !== "custom").map((t) => (
              <OptionTile
                key={t}
                selected={target === t}
                accent="ember"
                onClick={() => setTarget(t)}
              >
                <span className="text-2xl">{TARGET_ICONS[t]}</span>
                <span className="verse-ref min-w-0 text-center leading-tight sm:text-xs">
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
            <>
              <Input
                accent="ember"
                className="mt-2"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Name thy enemy..."
                maxLength={60}
              />
              {!customName.trim() && (
                <p className="mt-2 text-xs text-ink-soft">Name thy enemy to smite.</p>
              )}
            </>
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

        <Surface accent="wine" accentTint className="mb-4" padding="sm">
          <p className="text-xs text-ink-soft line-through">
            Unlimited Annual Smite Plan: $99/yr
          </p>
        </Surface>

        <Surface accent="wine" accentTint className="mb-8" padding="sm">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={premium}
              onChange={(e) => setPremium(e.target.checked)}
              disabled={needsPremium}
              className="mt-1 accent-wine"
            />
            <div>
              <p className={cn("flex items-center gap-2 text-sm font-semibold", accentStyles.wine.text)}>
                <Crown className="h-4 w-4" />
                Premium Smite (+ Cinematic Visual) — ${PREMIUM_PRICE.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {needsPremium
                  ? smiteLimitCopy()
                  : "Optional cinematic smite description for the truly petty."}
              </p>
            </div>
          </label>
        </Surface>

        <div className="mb-8 flex justify-center">
          <AuthGate mode="preview" lossContext="smite">
            <button
              type="button"
              onClick={handleSmite}
              disabled={
                smiteing ||
                (target === "custom" && !customName.trim()) ||
                (needsPremium && !premium)
              }
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
            {!user && (
              <AuthSavePrompt
                lossContext="smite"
                label="Save this smite to your ledger"
                className="mt-4 rounded-xl border border-rule bg-page p-4"
              />
            )}
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

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Users } from "lucide-react";
import ConfessionCard from "./ConfessionCard";
import SubmitConfessionForm from "./SubmitConfessionForm";
import LeaderboardSidebar from "./LeaderboardSidebar";
import type { Confession, ConfessionSort, VoteType } from "@/lib/confessionalTypes";
import { SORT_LABELS } from "@/lib/confessionalTypes";
import {
  getAllConfessions,
  sortConfessions,
  castVote,
  loadVotes,
  getLeaderboardTop,
} from "@/lib/confessionalStorage";
import { cn } from "@/lib/utils";

const SORTS = Object.keys(SORT_LABELS) as ConfessionSort[];

export default function ConfessionalLeaderboard() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [sort, setSort] = useState<ConfessionSort>("hot");
  const [votes, setVotes] = useState<Record<string, VoteType>>({});
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setConfessions(getAllConfessions());
    setVotes(loadVotes());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  function handleVote(id: string, vote: VoteType) {
    const result = castVote(id, vote, confessions);
    setConfessions(result.confessions);
    setVotes(loadVotes());
  }

  function handleSubmitted() {
    refresh();
  }

  if (!mounted) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-void">
        <p className="text-muted">Opening the confessional...</p>
      </div>
    );
  }

  const sorted = sortConfessions(confessions, sort);
  const mostAbsolved = getLeaderboardTop(confessions, "absolved");
  const mostCondemned = getLeaderboardTop(confessions, "condemned");

  return (
    <div className="min-h-dvh bg-void">
      <div className="border-b border-ash/50 bg-void/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-ash px-3 py-1.5 text-sm text-muted transition-colors hover:border-neon-purple/50 hover:text-bone"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-purple/40 bg-neon-purple/10">
              <Users className="h-6 w-6 text-neon-purple" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-neon-purple text-glow-purple sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Confessional Leaderboard
              </h1>
              <p className="text-sm text-muted">
                Anonymous sins · Absolve or Condemn · Democracy, but unhinged
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/5 px-3 py-1">
              <Sparkles className="h-3 w-3 text-neon-purple" />
              <span className="text-[10px] uppercase tracking-wider text-neon-purple">
                Visions Approximate
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main feed */}
          <div className="lg:col-span-2">
            <SubmitConfessionForm onSubmitted={handleSubmitted} />

            {/* Sort tabs */}
            <div className="my-6 flex gap-1 overflow-x-auto rounded-xl border border-ash bg-shadow p-1">
              {SORTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSort(s)}
                  className={cn(
                    "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    sort === s
                      ? "bg-neon-purple/15 text-neon-purple"
                      : "text-muted hover:text-bone"
                  )}
                >
                  {SORT_LABELS[s]}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {sorted.map((confession) => (
                <ConfessionCard
                  key={confession.id}
                  confession={confession}
                  userVote={votes[confession.id] ?? null}
                  onVote={handleVote}
                />
              ))}
            </div>
          </div>

          {/* Sidebar leaderboard */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <LeaderboardSidebar
                mostAbsolved={mostAbsolved}
                mostCondemned={mostCondemned}
              />
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted/40">
          {confessions.length} confessions in feed · Votes stored locally · Real
          backend sync when API arrives
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Users } from "lucide-react";
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
import { ChamberHeader, PageShell, TabGroup } from "@/components/ui";

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
      <div className="flex min-h-dvh items-center justify-center bg-parchment">
        <p className="text-ink-soft">Opening the confessional...</p>
      </div>
    );
  }

  const sorted = sortConfessions(confessions, sort);
  const mostAbsolved = getLeaderboardTop(confessions, "absolved");
  const mostCondemned = getLeaderboardTop(confessions, "condemned");

  return (
    <PageShell maxWidth="xl">
      <ChamberHeader
        icon={Users}
        accent="plum"
        title="The Confessional Leaderboard"
        subtitle="Anonymous sins · Absolve or Condemn · Democracy, but unhinged"
        badge="Visions Approximate"
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SubmitConfessionForm onSubmitted={handleSubmitted} />

          <TabGroup
            className="my-6"
            accent="plum"
            tabs={SORTS.map((s) => ({ id: s, label: SORT_LABELS[s] }))}
            value={sort}
            onChange={(id) => setSort(id as ConfessionSort)}
          />

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

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <LeaderboardSidebar
              mostAbsolved={mostAbsolved}
              mostCondemned={mostCondemned}
            />
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-ink-soft">
        {confessions.length} confessions in feed · Votes stored locally · Real
        backend sync when API arrives
      </p>
    </PageShell>
  );
}

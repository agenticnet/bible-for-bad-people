"use client";

import { useState, useEffect, useCallback } from "react";
import { Users } from "lucide-react";
import ConfessionCard from "./ConfessionCard";
import SubmitConfessionForm from "./SubmitConfessionForm";
import LeaderboardSidebar from "./LeaderboardSidebar";
import type { Confession, ConfessionSort, VoteType } from "@/lib/confessionalTypes";
import { SORT_LABELS } from "@/lib/confessionalTypes";
import { sortConfessions, getLeaderboardTop } from "@/lib/confessionalUtils";
import {
  fetchConfessions,
  fetchUserVotes,
  castConfessionVote,
} from "@/lib/data/confessional";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { ChamberHeader, PageShell, TabGroup } from "@/components/ui";
import { usePathname } from "next/navigation";

const SORTS = Object.keys(SORT_LABELS) as ConfessionSort[];

export default function ConfessionalLeaderboard() {
  const { user } = useAuth();
  const { openSignUp } = useAuthModal();
  const pathname = usePathname();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [sort, setSort] = useState<ConfessionSort>("hot");
  const [votes, setVotes] = useState<Record<string, VoteType>>({});

  const refresh = useCallback(async () => {
    if (user) {
      const [feed, userVotes] = await Promise.all([
        fetchConfessions(),
        fetchUserVotes(),
      ]);
      setConfessions(feed);
      setVotes(userVotes);
    } else {
      const feed = await fetchConfessions();
      setConfessions(feed);
      setVotes({});
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleVote(id: string, vote: VoteType) {
    if (!user) return;

    if (!id.startsWith("seed-")) {
      await castConfessionVote(id, vote);
      await refresh();
    }
  }

  function handleSubmitted() {
    void refresh();
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
        badge="Absolve or condemn"
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
            {sorted.map((confession) => {
              const isDemo = confession.id.startsWith("seed-");
              return (
                <ConfessionCard
                  key={confession.id}
                  confession={confession}
                  userVote={votes[confession.id] ?? null}
                  onVote={handleVote}
                  demoOnly={isDemo}
                  requiresAuth={!user && !isDemo}
                  onGuestVote={() => openSignUp("confessional", pathname)}
                />
              );
            })}
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
        {confessions.length} confessions in feed ·{" "}
        {user ? "Synced to your account" : "Sign in to post and vote on real confessions"}
      </p>
    </PageShell>
  );
}

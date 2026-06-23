"use client";

import { useState, useMemo, useEffect } from "react";
import type { SinCategory } from "@/lib/sinTypes";
import { CATEGORY_LABELS } from "@/lib/sinTypes";
import { SIN_LIBRARY, searchSins } from "@/lib/sinLibrary";
import { loadCommunitySins } from "@/lib/sinStorage";
import type { ContributedSin } from "@/lib/sinTypes";
import { cn } from "@/lib/utils";

interface SinLibraryPanelProps {
  refreshKey: number;
}

export default function SinLibraryPanel({ refreshKey }: SinLibraryPanelProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [community, setCommunity] = useState<ContributedSin[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCommunity(loadCommunitySins());
  }, [refreshKey]);

  const libraryResults = useMemo(
    () => searchSins(query, category || undefined),
    [query, category]
  );

  const communityFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return community.filter((sin) => {
      if (category && sin.category !== category) return false;
      if (!q) return true;
      return sin.petty.toLowerCase().includes(q) || sin.translation.toLowerCase().includes(q);
    });
  }, [community, query, category]);

  if (!mounted) return null;

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-neon-pink">
          Inspiration Archive
        </p>
        <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-display)" }}>
          Sin Library
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          {SIN_LIBRARY.length} curated sins + {community.length} community contributions.
          Browse for ideas, copy to translate, or just feel seen.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sins..."
          className="flex-1 rounded-lg border border-rule bg-page px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-neon-pink/50 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-rule bg-page px-3 py-2.5 text-sm text-ink focus:border-neon-pink/50 focus:outline-none"
        >
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {communityFiltered.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-3 text-sm font-semibold text-neon-gold">
            Community Contributions ({communityFiltered.length})
          </h3>
          <div className="flex flex-col gap-3">
            {communityFiltered.map((sin) => (
              <SinLibraryCard key={sin.id} petty={sin.petty} translation={sin.translation} category={sin.category} badge="Community" />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink">
          Curated Library ({libraryResults.length})
        </h3>
        <div className="flex flex-col gap-3">
          {libraryResults.map((sin) => (
            <SinLibraryCard
              key={sin.id}
              petty={sin.petty}
              translation={sin.translation}
              category={sin.category}
              badge={sin.difficulty}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function SinLibraryCard({
  petty,
  translation,
  category,
  badge,
}: {
  petty: string;
  translation: string;
  category: SinCategory;
  badge: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-xl border border-rule bg-page p-4">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="rounded-full border border-rule bg-smoke px-2 py-0.5 text-[9px] uppercase text-ink-soft">
            {CATEGORY_LABELS[category]}
          </span>
          <span className="rounded-full border border-neon-pink/30 bg-neon-pink/10 px-2 py-0.5 text-[9px] uppercase text-neon-pink">
            {badge}
          </span>
        </div>
        <p className="text-sm font-medium text-ink">{petty}</p>
        <p className="mt-1 text-xs text-ink-soft">{expanded ? "Hide translation" : "Tap for scripture →"}</p>
      </button>
      {expanded && (
        <p
          className={cn( "mt-3 border-t border-rule pt-3 text-xs italic leading-relaxed text-ink-soft" )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {translation}
        </p>
      )}
    </article>
  );
}

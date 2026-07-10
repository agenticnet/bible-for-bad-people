"use client";

import { useState, useMemo, useEffect } from "react";
import type { SinCategory, SinDifficulty } from "@/lib/sinTypes";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/lib/sinTypes";
import { SIN_LIBRARY, searchSins } from "@/lib/sinLibrary";
import { loadCommunitySins } from "@/lib/sinStorage";
import { fetchCommunitySins } from "@/lib/data/sin";
import type { ContributedSin } from "@/lib/sinTypes";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Badge,
  Input,
  SectionHeader,
  Select,
  Surface,
} from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface SinLibraryPanelProps {
  refreshKey: number;
}

export default function SinLibraryPanel({ refreshKey }: SinLibraryPanelProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [community, setCommunity] = useState<ContributedSin[]>([]);

  useEffect(() => {
    async function load() {
      const serverSins = await fetchCommunitySins();
      const localSins = user ? [] : loadCommunitySins();
      const merged = [...serverSins, ...localSins];
      const seen = new Set<string>();
      const unique = merged.filter((sin) => {
        const key = `${sin.petty}:${sin.translation}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setCommunity(unique);
    }
    void load();
  }, [refreshKey, user]);

  const libraryResults = useMemo(
    () => searchSins(query, category || undefined),
    [query, category]
  );

  const communityFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return community.filter((sin) => {
      if (category && sin.category !== category) return false;
      if (!q) return true;
      return (
        sin.petty.toLowerCase().includes(q) ||
        sin.translation.toLowerCase().includes(q)
      );
    });
  }, [community, query, category]);

  return (
    <div>
      <SectionHeader
        kicker="Inspiration Archive"
        title="Sin Library"
        description={`${SIN_LIBRARY.length} curated sins + ${community.length} community contributions. Browse for ideas or just feel seen.`}
        accent="terra"
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          accent="terra"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sins..."
          className="flex-1"
        />
        <Select
          accent="terra"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sm:w-48"
        >
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {communityFiltered.length > 0 && (
        <section className="mb-8">
          <h3 className={cn("mb-3 text-sm font-semibold", accentStyles.wine.text)}>
            Community Contributions ({communityFiltered.length})
          </h3>
          <div className="flex flex-col gap-3">
            {communityFiltered.map((sin) => (
              <SinLibraryCard
                key={sin.id}
                petty={sin.petty}
                translation={sin.translation}
                category={sin.category}
                badge="Community"
              />
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
              badge={DIFFICULTY_LABELS[sin.difficulty as SinDifficulty] ?? sin.difficulty}
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
    <Surface as="article" padding="sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge tone="active" size="sm">
            {CATEGORY_LABELS[category]}
          </Badge>
          <Badge tone="terra" size="sm">
            {badge}
          </Badge>
        </div>
        <p className="text-sm font-medium text-ink">{petty}</p>
        <p className="mt-1 text-xs text-ink-soft">
          {expanded ? "Hide translation" : "Tap for scripture →"}
        </p>
      </button>
      {expanded && (
        <p className="scripture-block mt-3 border-t border-rule pt-3 text-xs italic text-ink-soft">
          {translation}
        </p>
      )}
    </Surface>
  );
}

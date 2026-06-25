"use client";

import { useState, useMemo } from "react";
import { BookOpen, Search, X } from "lucide-react";
import PassageCard from "./PassageCard";
import { searchPassages } from "@/lib/biblePassages";
import { ALL_TAGS, TAG_LABELS } from "@/lib/bibleTypes";
import {
  Chip,
  ChamberHeader,
  EmptyState,
  Input,
  Label,
  PageShell,
} from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

export default function CynicsBible() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const results = useMemo(
    () => searchPassages(query, activeTags),
    [query, activeTags]
  );

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function clearFilters() {
    setQuery("");
    setActiveTags(new Set());
  }

  const hasFilters = query.trim() !== "" || activeTags.size > 0;

  return (
    <PageShell maxWidth="md">
      <ChamberHeader
        icon={BookOpen}
        accent="wine"
        title="The Cynic's TL;DR Bible"
        subtitle="Canon, abridged"
        className="mb-10 border-b border-rule pb-8"
      >
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
          The verses your Sunday school definitely skipped — with modern
          receipts. Not theology. Cultural autopsy.
        </p>
      </ChamberHeader>

      <div className="mb-6">
        <Label htmlFor="passage-search">Search</Label>
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <Input
            id="passage-search"
            accent="wine"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Book, verse, topic, or vibe (e.g. bears, slavery, shrimp)…"
            className="rounded-sm py-3 pl-10"
          />
        </div>
      </div>

      <div className="mb-8">
        <Label>Filter by category</Label>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <Chip
              key={tag}
              accent="wine"
              onClick={() => toggleTag(tag)}
              className={cn(
                activeTags.has(tag) &&
                  cn(
                    accentStyles.wine.borderMuted,
                    accentStyles.wine.bgMuted,
                    accentStyles.wine.text
                  )
              )}
            >
              {TAG_LABELS[tag]}
            </Chip>
          ))}
          {hasFilters && (
            <Chip onClick={clearFilters} className="flex items-center gap-1">
              <X className="h-3 w-3" />
              Clear
            </Chip>
          )}
        </div>
      </div>

      <p className="verse-ref mb-6 text-ink-soft">
        {results.length} passage{results.length !== 1 ? "s" : ""}
        {hasFilters ? " matching" : ""}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No passages match that search."
          description='Try "violent," "Lot," or "contradictory."'
          className="border-solid"
        />
      ) : (
        <div className="flex flex-col divide-y divide-rule border-y border-rule">
          {results.map((passage) => (
            <PassageCard key={passage.id} passage={passage} />
          ))}
        </div>
      )}

      <p className="verse-ref mt-10 text-center text-ink-soft">
        {results.length} curated passages — full searchable API coming later.
      </p>
    </PageShell>
  );
}

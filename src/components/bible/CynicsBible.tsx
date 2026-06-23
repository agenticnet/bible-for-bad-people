"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search, X } from "lucide-react";
import PassageCard from "./PassageCard";
import { searchPassages } from "@/lib/biblePassages";
import { ALL_TAGS, TAG_LABELS } from "@/lib/bibleTypes";
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
    <div className="min-h-dvh bg-parchment">
      <div className="border-b border-ivory/10 bg-binding px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-sm border border-ivory/15 px-3 py-1.5 text-sm text-binding-muted transition-colors hover:border-ivory/30 hover:text-binding-ivory"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      <div className="page-enter mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 border-b border-rule pb-8">
          <div className="mb-5 flex items-start gap-4">
            <BookOpen className="mt-1 h-6 w-6 shrink-0 text-wine" strokeWidth={1.5} />
            <div>
              <p className="verse-ref mb-2 text-ink-soft">Canon, abridged</p>
              <h1 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-ink">
                The Cynic&apos;s TL;DR Bible
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
                The verses your Sunday school definitely skipped — with modern
                receipts. Not theology. Cultural autopsy.
              </p>
            </div>
          </div>
        </header>

        <div className="mb-6">
          <label htmlFor="passage-search" className="verse-ref mb-2 block text-ink-soft">
            Search
          </label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              id="passage-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Book, verse, topic, or vibe (e.g. bears, slavery, shrimp)…"
              className="w-full rounded-sm border border-rule bg-page py-3 pr-4 pl-10 text-sm text-ink placeholder:text-ink-soft/50 focus:border-wine/40 focus:outline-none focus:ring-1 focus:ring-wine/20"
            />
          </div>
        </div>

        <div className="mb-8">
          <p className="verse-ref mb-2 text-ink-soft">Filter by category</p>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-sm border px-3 py-1 text-xs transition-colors",
                  activeTags.has(tag)
                    ? "border-wine/35 bg-wine/8 text-wine"
                    : "border-rule bg-page text-ink-soft hover:border-ink-soft/25 hover:text-ink"
                )}
              >
                {TAG_LABELS[tag]}
              </button>
            ))}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-sm border border-rule px-3 py-1 text-xs text-ink-soft hover:text-ink"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        <p className="verse-ref mb-6 text-ink-soft">
          {results.length} passage{results.length !== 1 ? "s" : ""}
          {hasFilters ? " matching" : ""}
        </p>

        {results.length === 0 ? (
          <div className="border border-dashed border-rule px-6 py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-8 w-8 text-ink-soft/30" strokeWidth={1.25} />
            <p className="text-ink-soft">No passages match that search.</p>
            <p className="mt-1 text-sm text-ink-soft/70">
              Try &ldquo;violent,&rdquo; &ldquo;Lot,&rdquo; or &ldquo;contradictory.&rdquo;
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-rule border-y border-rule">
            {results.map((passage) => (
              <PassageCard key={passage.id} passage={passage} />
            ))}
          </div>
        )}

        <p className="verse-ref mt-10 text-center text-ink-soft/70">
          {results.length} curated passages — full searchable API coming later.
        </p>
      </div>
    </div>
  );
}

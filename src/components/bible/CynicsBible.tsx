"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search, Sparkles, X } from "lucide-react";
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
    <div className="min-h-dvh bg-void">
      <div className="border-b border-ash/50 bg-void/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-ash px-3 py-1.5 text-sm text-muted transition-colors hover:border-neon-gold/50 hover:text-bone"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-gold/40 bg-neon-gold/10">
              <BookOpen className="h-6 w-6 text-neon-gold" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-neon-gold text-glow-gold sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Cynic&apos;s TL;DR Bible
              </h1>
              <p className="text-sm text-muted">
                The verses your Sunday school definitely skipped — with modern
                receipts.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/5 px-3 py-1">
              <Sparkles className="h-3 w-3 text-neon-purple" />
              <span className="text-[10px] uppercase tracking-wider text-neon-purple">
                Visions Approximate
              </span>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Search weird, violent, and contradictory scripture — then see how
            the same patterns show up in politics, workplaces, relationships,
            and the group chat. Not theology. Cultural autopsy.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by book, verse, topic, or vibe (e.g. 'bears', 'slavery', 'shrimp')..."
              className="w-full rounded-xl border border-ash bg-shadow py-3.5 pr-4 pl-11 text-sm text-bone placeholder:text-muted/50 focus:border-neon-gold/50 focus:outline-none focus:ring-1 focus:ring-neon-gold/30"
            />
          </div>
        </div>

        {/* Tag filters */}
        <div className="mb-6">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-muted">
            Filter by sin category
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-all",
                  activeTags.has(tag)
                    ? "border-neon-gold/50 bg-neon-gold/15 text-neon-gold"
                    : "border-ash bg-smoke text-muted hover:border-neon-gold/30 hover:text-bone"
                )}
              >
                {TAG_LABELS[tag]}
              </button>
            ))}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-full border border-ash px-3 py-1 text-xs text-muted hover:text-bone"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-muted">
          {results.length} passage{results.length !== 1 ? "s" : ""} found
          {hasFilters ? " matching your search" : ""}
        </p>

        {/* Results */}
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ash bg-shadow/50 px-6 py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted/30" />
            <p className="text-muted">No passages match that search.</p>
            <p className="mt-1 text-sm text-muted/60">
              Try &ldquo;violent,&rdquo; &ldquo;Lot,&rdquo; or &ldquo;contradictory.&rdquo;
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {results.map((passage) => (
              <PassageCard key={passage.id} passage={passage} />
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted/40">
          {results.length} curated passages — full searchable API coming later.
          Expand any card for the abridged verse and modern world connection.
        </p>
      </div>
    </div>
  );
}

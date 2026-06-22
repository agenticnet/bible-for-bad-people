"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Globe } from "lucide-react";
import type { BiblePassage, PassageTag } from "@/lib/bibleTypes";
import { TAG_LABELS } from "@/lib/bibleTypes";
import { cn } from "@/lib/utils";

interface PassageCardProps {
  passage: BiblePassage;
}

const TAG_COLORS: Record<PassageTag, string> = {
  violent: "border-neon-red/30 bg-neon-red/10 text-neon-red",
  weird: "border-neon-purple/30 bg-neon-purple/10 text-neon-purple",
  contradictory: "border-neon-pink/30 bg-neon-pink/10 text-neon-pink",
  absurd: "border-neon-gold/30 bg-neon-gold/10 text-neon-gold",
  cruel: "border-orange-400/30 bg-orange-400/10 text-orange-400",
  "bizarre-laws": "border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan",
  "skipped-in-church": "border-muted/30 bg-smoke text-muted",
  sexual: "border-neon-pink/30 bg-neon-pink/10 text-neon-pink",
  genocide: "border-neon-red/30 bg-neon-red/10 text-neon-red",
};

export default function PassageCard({ passage }: PassageCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-xl border border-ash bg-shadow transition-all hover:border-ash/80">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-neon-gold">
              {passage.reference}
            </span>
            <span className="rounded-full border border-ash bg-smoke px-2 py-0.5 text-[10px] text-muted">
              {passage.book}
            </span>
          </div>
          <p
            className="mb-3 text-base font-semibold leading-snug text-bone"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {passage.tldr}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {passage.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider",
                  TAG_COLORS[tag]
                )}
              >
                {TAG_LABELS[tag]}
              </span>
            ))}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-muted" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-muted" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-ash px-5 pb-5">
          <div className="mt-4">
            <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted">
              The Passage (Abridged)
            </p>
            <blockquote className="border-l-2 border-neon-gold/40 pl-4 text-sm italic leading-relaxed text-bone/80">
              &ldquo;{passage.excerpt}&rdquo;
            </blockquote>
          </div>

          <div className="mt-5 rounded-lg border border-neon-cyan/25 bg-neon-cyan/5 p-4">
            <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-neon-cyan">
              <Globe className="h-3.5 w-3.5" />
              Modern World Connection
            </p>
            <p className="text-sm leading-relaxed text-bone/90">
              {passage.modernWorld}
            </p>
          </div>

          <p className="mt-4 text-[10px] text-muted/50">
            Content warning: This database is satirical education, not theology.
            Read the full passage in context before quoting at Thanksgiving.
          </p>
        </div>
      )}
    </article>
  );
}

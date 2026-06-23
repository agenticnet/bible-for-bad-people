"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { BiblePassage, PassageTag } from "@/lib/bibleTypes";
import { TAG_LABELS } from "@/lib/bibleTypes";
import { cn } from "@/lib/utils";

interface PassageCardProps {
  passage: BiblePassage;
}

const TAG_COLORS: Record<PassageTag, string> = {
  violent: "text-ember",
  weird: "text-plum",
  contradictory: "text-terra",
  absurd: "text-wine",
  cruel: "text-ember",
  "bizarre-laws": "text-slate",
  "skipped-in-church": "text-ink-soft",
  sexual: "text-terra",
  genocide: "text-ember",
};

export default function PassageCard({ passage }: PassageCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="bg-page transition-colors hover:bg-smoke/60">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-4 px-1 py-6 text-left sm:px-2"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="verse-ref text-wine">{passage.reference}</span>
            <span className="verse-ref text-ink-soft/70">{passage.book}</span>
          </div>
          <p className="mb-3 font-serif text-lg leading-snug text-ink">
            {passage.tldr}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {passage.tags.map((tag) => (
              <span
                key={tag}
                className={cn("verse-ref text-[0.65rem]", TAG_COLORS[tag])}
              >
                {TAG_LABELS[tag]}
              </span>
            ))}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-ink-soft" />
        ) : (
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-ink-soft" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-rule px-1 pb-6 sm:px-2">
          <div className="mt-5">
            <p className="verse-ref mb-3 text-ink-soft">The passage (abridged)</p>
            <blockquote className="scripture-block border-l border-wine/30 pl-5 text-ink/90 italic">
              &ldquo;{passage.excerpt}&rdquo;
            </blockquote>
          </div>

          <div className="mt-6 border-t border-rule pt-5">
            <p className="verse-ref mb-2 text-ink-soft">Modern world connection</p>
            <p className="text-sm leading-relaxed text-ink-soft">
              {passage.modernWorld}
            </p>
          </div>

          <p className="verse-ref mt-5 text-ink-soft/60">
            Satirical education, not theology. Read in context before quoting at Thanksgiving.
          </p>
        </div>
      )}
    </article>
  );
}

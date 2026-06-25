"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { BiblePassage, PassageTag } from "@/lib/bibleTypes";
import { TAG_LABELS } from "@/lib/bibleTypes";
import { Badge, Surface } from "@/components/ui";
import type { Accent } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface PassageCardProps {
  passage: BiblePassage;
}

const TAG_ACCENTS: Partial<Record<PassageTag, Accent>> = {
  violent: "ember",
  weird: "plum",
  contradictory: "terra",
  absurd: "wine",
  cruel: "ember",
  "bizarre-laws": "slate",
  sexual: "terra",
  genocide: "ember",
};

export default function PassageCard({ passage }: PassageCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Surface
      as="article"
      padding="none"
      className="rounded-none border-0 bg-page hover:bg-smoke/60"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-4 px-1 py-6 text-left sm:px-2"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="verse-ref text-wine">{passage.reference}</span>
            <span className="verse-ref text-ink-soft">{passage.book}</span>
          </div>
          <p className="mb-3 font-serif text-lg leading-snug text-ink">
            {passage.tldr}
          </p>
          <div className="flex flex-wrap gap-2">
            {passage.tags.map((tag) => (
              <Badge
                key={tag}
                tone={TAG_ACCENTS[tag] ?? "active"}
                size="sm"
                className="normal-case tracking-normal"
              >
                {TAG_LABELS[tag]}
              </Badge>
            ))}
          </div>
        </div>
        <span
          className={cn(
            "mt-1 shrink-0 text-ink-soft transition-transform duration-200 motion-reduce:transition-none",
            expanded && "rotate-180"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-rule px-1 pb-6 sm:px-2">
            <div className="mt-5 border-t border-rule pt-5">
              <p className="verse-ref mb-3 text-ink-soft">The passage (abridged)</p>
              <blockquote className="scripture-block text-ink/90">
                &ldquo;{passage.excerpt}&rdquo;
              </blockquote>
            </div>

            <div className="mt-6 border-t border-rule pt-5">
              <p className="verse-ref mb-2 text-ink-soft">Modern world connection</p>
              <p className="text-sm leading-relaxed text-ink-soft">
                {passage.modernWorld}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Surface>
  );
}

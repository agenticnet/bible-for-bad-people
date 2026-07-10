"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { BiblePassage, PassageTag } from "@/lib/bibleTypes";
import { TAG_LABELS } from "@/lib/bibleTypes";
import { Badge, Button, Callout, Surface } from "@/components/ui";
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

const CONTENT_WARNING_TAGS: PassageTag[] = ["sexual", "genocide", "violent"];

function needsContentWarning(tags: PassageTag[]): boolean {
  return tags.some((tag) => CONTENT_WARNING_TAGS.includes(tag));
}

export default function PassageCard({ passage }: PassageCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [warningAccepted, setWarningAccepted] = useState(false);
  const showWarning = needsContentWarning(passage.tags) && !warningAccepted;

  function handleToggle() {
    if (expanded) {
      setExpanded(false);
      return;
    }
    if (showWarning) {
      setExpanded(true);
      return;
    }
    setExpanded(true);
  }

  function acceptWarning() {
    setWarningAccepted(true);
  }

  return (
    <Surface
      as="article"
      padding="none"
      className="rounded-none border-0 bg-page hover:bg-smoke/60"
    >
      <button
        type="button"
        onClick={handleToggle}
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

      {expanded && (
        <div className="border-t border-rule px-1 pb-6 sm:px-2">
          {showWarning ? (
            <Callout tone="ember" className="mt-5">
              <p className="font-medium text-ink">Content warning</p>
              <p className="mt-1 text-sm text-ink-soft">
                This passage includes{" "}
                {passage.tags
                  .filter((tag) => CONTENT_WARNING_TAGS.includes(tag))
                  .map((tag) => TAG_LABELS[tag].toLowerCase())
                  .join(", ")}
                . Scripture excerpt ahead — satire does not soften the source text.
              </p>
              <Button
                type="button"
                accent="ember"
                size="sm"
                className="mt-3"
                onClick={acceptWarning}
              >
                Show the passage
              </Button>
            </Callout>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </Surface>
  );
}

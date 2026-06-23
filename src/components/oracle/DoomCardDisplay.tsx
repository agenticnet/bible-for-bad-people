"use client";

import { cn } from "@/lib/utils";
import type { DoomCard } from "@/lib/oracleTypes";
import { OMEN_LABELS } from "@/lib/oracleTypes";
import { Badge } from "@/components/ui";
import type { Accent } from "@/components/ui/tokens";

interface DoomCardDisplayProps {
  card: DoomCard;
  label: string;
  revealed: boolean;
  delay?: number;
}

const OMEN_TONES: Record<DoomCard["omen"], Accent | "neutral"> = {
  cursed: "plum",
  doomed: "ember",
  chaotic: "terra",
  bleak: "neutral",
  "cursed-blessing": "wine",
};

export default function DoomCardDisplay({
  card,
  label,
  revealed,
  delay = 0,
}: DoomCardDisplayProps) {
  const omenTone = OMEN_TONES[card.omen];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="verse-ref text-ink-soft">{label}</p>
      <div
        className="perspective-[800px] w-full max-w-[180px]"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div
          className={cn(
            "relative h-64 w-full transition-transform duration-700 [transform-style:preserve-3d]",
            revealed && "[transform:rotateY(180deg)]"
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 border-plum/30 bg-page [backface-visibility:hidden]">
            <div className="absolute inset-2 rounded-lg border border-plum/20" />
            <span className="text-3xl opacity-60">🔮</span>
            <p className="verse-ref mt-3 text-plum">Oracle of Doom</p>
          </div>

          <div className="absolute inset-0 flex flex-col rounded-xl border-2 border-plum/40 bg-page p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <span className="mb-3 text-4xl">{card.symbol}</span>
              <h3 className="mb-2 font-serif text-sm font-bold leading-tight text-ink">
                {card.name}
              </h3>
              <Badge tone={omenTone === "neutral" ? "active" : omenTone} size="sm">
                {OMEN_LABELS[card.omen]}
              </Badge>
            </div>
            <p className="mt-2 border-t border-rule pt-2 text-center text-[11px] italic text-ink-soft">
              {card.tagline}
            </p>
          </div>
        </div>
      </div>

      {revealed && (
        <p className="max-w-[200px] text-center text-xs leading-relaxed text-ink-soft">
          {card.reading}
        </p>
      )}
    </div>
  );
}

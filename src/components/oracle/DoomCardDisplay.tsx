"use client";

import { cn } from "@/lib/utils";
import type { DoomCard } from "@/lib/oracleTypes";
import { OMEN_LABELS } from "@/lib/oracleTypes";

interface DoomCardDisplayProps {
  card: DoomCard;
  label: string;
  revealed: boolean;
  delay?: number;
}

const OMEN_STYLES = {
  cursed: "border-neon-purple/40 text-neon-purple",
  doomed: "border-neon-red/40 text-neon-red",
  chaotic: "border-neon-pink/40 text-neon-pink",
  bleak: "border-rule text-ink-soft",
  "cursed-blessing": "border-neon-gold/40 text-neon-gold",
};

export default function DoomCardDisplay({
  card,
  label,
  revealed,
  delay = 0,
}: DoomCardDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] uppercase tracking-[0.25em] text-ink-soft">
        {label}
      </p>
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
          {/* Card back */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 border-neon-purple/30 bg-gradient-to-br from-page via-parchment to-page [backface-visibility:hidden]">
            <div className="absolute inset-2 rounded-lg border border-neon-purple/20" />
            <span className="text-3xl opacity-60">🔮</span>
            <p
              className="mt-3 text-[10px] uppercase tracking-[0.3em] text-neon-purple"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Oracle of Doom
            </p>
          </div>

          {/* Card front */}
          <div className="absolute inset-0 flex flex-col rounded-xl border-2 border-neon-purple/40 bg-page p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <span className="mb-3 text-4xl">{card.symbol}</span>
              <h3
                className="mb-2 text-sm font-bold leading-tight text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {card.name}
              </h3>
              <span
                className={cn( "rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider", OMEN_STYLES[card.omen] )}
              >
                {OMEN_LABELS[card.omen]}
              </span>
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

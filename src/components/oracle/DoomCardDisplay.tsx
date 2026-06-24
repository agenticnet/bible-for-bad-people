"use client";

import { motion } from "motion/react";
import type { DoomCard } from "@/lib/oracleTypes";
import { OMEN_LABELS } from "@/lib/oracleTypes";
import { Badge } from "@/components/ui";
import type { Accent } from "@/components/ui/tokens";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, spring } from "@/lib/motion";

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
  const reducedMotion = useReducedMotion();
  const omenTone = OMEN_TONES[card.omen];
  const t = resolveTransition(
    { ...spring.gentle, delay: reducedMotion ? 0 : delay / 1000 },
    reducedMotion
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="verse-ref text-ink-soft">{label}</p>
      <div className="perspective-[800px] w-full max-w-[180px]">
        <motion.div
          className="relative h-64 w-full [transform-style:preserve-3d]"
          initial={false}
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={t}
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
        </motion.div>
      </div>

      {revealed && (
        <motion.p
          className="max-w-[200px] text-center text-xs leading-relaxed text-ink-soft"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={resolveTransition(
            { ...spring.gentle, delay: reducedMotion ? 0 : delay / 1000 + 0.2 },
            reducedMotion
          )}
        >
          {card.reading}
        </motion.p>
      )}
    </div>
  );
}

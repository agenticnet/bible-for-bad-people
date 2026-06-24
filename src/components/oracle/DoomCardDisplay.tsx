"use client";

import { motion } from "motion/react";
import type { DoomCard } from "@/lib/oracleTypes";
import { OMEN_LABELS } from "@/lib/oracleTypes";
import { Badge, Surface } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import type { Accent } from "@/components/ui/tokens";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

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
          <Surface
            accent="plum"
            accentTint
            padding="none"
            className="absolute inset-0 flex flex-col items-center justify-center rounded-sm [backface-visibility:hidden]"
          >
            <div className="absolute inset-x-3 top-3 border-t border-plum/20" />
            <span className="text-3xl opacity-60">🔮</span>
            <p className={cn("verse-ref mt-3", accentStyles.plum.text)}>Oracle of Doom</p>
            <div className="absolute inset-x-3 bottom-3 border-b border-plum/20" />
          </Surface>

          <Surface
            accent="plum"
            padding="sm"
            className="absolute inset-0 flex flex-col rounded-sm [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <div className="flex flex-1 flex-col items-center justify-center border-b border-rule pb-3 text-center">
              <span className="mb-3 text-4xl">{card.symbol}</span>
              <h3 className="mb-2 font-serif text-sm leading-tight text-ink">
                {card.name}
              </h3>
              <Badge tone={omenTone === "neutral" ? "active" : omenTone} size="sm">
                {OMEN_LABELS[card.omen]}
              </Badge>
            </div>
            <p className="mt-2 pt-2 text-center text-[11px] italic leading-relaxed text-ink-soft">
              {card.tagline}
            </p>
          </Surface>
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

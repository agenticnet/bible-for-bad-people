"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { PlagueType } from "@/lib/smiteTypes";
import { PLAGUE_ICONS } from "@/lib/smiteTypes";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, spring } from "@/lib/motion";

interface SmiteAnimationProps {
  plague: PlagueType;
  active: boolean;
  onComplete: () => void;
}

const PLAGUE_PARTICLES: Record<PlagueType, string[]> = {
  locusts: ["🦗", "🦗", "🌾", "🦗"],
  frogs: ["🐸", "🐸", "🐸", "💚"],
  boils: ["🤢", "💢", "🤕", "😖"],
  darkness: ["🌑", "⬛", "🌚", "💀"],
  hail: ["🌨️", "🔥", "❄️", "💥"],
  pestilence: ["☠️", "🤧", "🦠", "💀"],
  "blood-river": ["🩸", "🩸", "💧", "🌊"],
  gnats: ["🪰", "🪰", "🪰", "🐛"],
  "livestock-death": ["🥀", "🪴", "💀", "🐄"],
  "firstborn-wifi": ["📵", "📶", "❌", "😱"],
};

export default function SmiteAnimation({
  plague,
  active,
  onComplete,
}: SmiteAnimationProps) {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const t = resolveTransition(spring.gentle, reducedMotion);

  useEffect(() => {
    if (!active) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  const particles = PLAGUE_PARTICLES[plague];
  const mainIcon = PLAGUE_ICONS[plague];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ember/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              className="mb-4 text-8xl"
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={t}
            >
              {mainIcon}
            </motion.div>
            <motion.p
              className="text-2xl font-bold uppercase tracking-[0.3em] text-ember"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...t, delay: reducedMotion ? 0 : 0.15 }}
            >
              SMITTEN
            </motion.p>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {particles.map((emoji, i) => (
                <motion.span
                  key={i}
                  className="absolute text-3xl opacity-80"
                  style={{
                    left: `${15 + i * 20}%`,
                    top: `${10 + (i % 3) * 25}%`,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={
                    reducedMotion
                      ? { opacity: 0.8, scale: 1 }
                      : {
                          opacity: [0, 0.8, 0.6],
                          y: [0, -12, -24],
                          scale: [0.5, 1, 0.9],
                        }
                  }
                  transition={{
                    duration: reducedMotion ? 0.01 : 1 + i * 0.3,
                    delay: i * 0.15,
                    repeat: reducedMotion ? 0 : Infinity,
                    repeatType: "reverse",
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, resolveVariants, transition } from "@/lib/motion";

export default function LampVignette() {
  const reducedMotion = useReducedMotion();
  const variants = resolveVariants(
    {
      hidden: { opacity: 0, scale: 1.05 },
      visible: { opacity: 1, scale: 1 },
    },
    reducedMotion
  );
  const t = resolveTransition(
    { ...transition.slow, duration: 1 },
    reducedMotion
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={t}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 20%, oklch(0.94 0.02 75 / 0.45) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

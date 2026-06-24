import type { Transition, Variants } from "motion/react";

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  in: [0.4, 0, 0.6, 1] as const,
};

export const duration = {
  fast: 0.2,
  base: 0.45,
  slow: 0.7,
  exit: 0.34,
};

export const stagger = {
  tight: 0.06,
  loose: 0.1,
};

export const spring = {
  gentle: { type: "spring" as const, stiffness: 260, damping: 28 },
};

export const transition = {
  fast: { duration: duration.fast, ease: ease.out },
  base: { duration: duration.base, ease: ease.out },
  slow: { duration: duration.slow, ease: ease.out },
  exit: { duration: duration.exit, ease: ease.in },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeUpScale: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export const clipReveal: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  visible: { opacity: 1, clipPath: "inset(0 0 0 0)" },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: "-100%" },
  visible: { opacity: 1, y: 0 },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const staggerContainer = (
  staggerChildren = stagger.loose,
  delayChildren = 0
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function resolveVariants(
  variants: Variants,
  reducedMotion: boolean
): Variants {
  if (!reducedMotion) return variants;
  return reducedFade;
}

export function resolveTransition(
  t: Transition,
  reducedMotion: boolean
): Transition {
  if (!reducedMotion) return t;
  return { duration: 0.01 };
}

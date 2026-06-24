"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, transition } from "@/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const enterT = resolveTransition(transition.base, reducedMotion);
  const exitT = resolveTransition(transition.exit, reducedMotion);

  const variants = reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: enterT },
        exit: { opacity: 0, transition: exitT },
      }
    : {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: enterT },
        exit: { opacity: 0, y: -8, transition: exitT },
      };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        className="min-h-dvh"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  fadeUp,
  resolveTransition,
  resolveVariants,
  transition,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLMotionProps<"div"> {
  variant?: Variants;
  delay?: number;
  once?: boolean;
  animateOnMount?: boolean;
}

export default function Reveal({
  children,
  className,
  variant = fadeUp,
  delay = 0,
  once = true,
  animateOnMount = false,
  ...props
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const variants = resolveVariants(variant, reducedMotion);
  const t = resolveTransition(
    { ...transition.base, delay },
    reducedMotion
  );

  const motionProps = animateOnMount
    ? { initial: "hidden" as const, animate: "visible" as const }
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once, margin: "-10% 0px" as const },
      };

  return (
    <motion.div
      variants={variants}
      transition={t}
      className={cn(className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}

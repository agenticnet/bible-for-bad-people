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
}

export default function Reveal({
  children,
  className,
  variant = fadeUp,
  delay = 0,
  once = true,
  ...props
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const variants = resolveVariants(variant, reducedMotion);
  const t = resolveTransition(
    { ...transition.base, delay },
    reducedMotion
  );

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px" }}
      variants={variants}
      transition={t}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

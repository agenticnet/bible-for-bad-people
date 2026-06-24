"use client";

import { Children, type ReactNode } from "react";
import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  fadeUp,
  resolveTransition,
  resolveVariants,
  stagger,
  staggerContainer,
  transition,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

interface StaggerProps extends HTMLMotionProps<"div"> {
  childVariant?: Variants;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
  animateOnMount?: boolean;
}

export function Stagger({
  children,
  className,
  childVariant = fadeUp,
  staggerDelay = stagger.loose,
  delayChildren = 0,
  once = true,
  animateOnMount = false,
  ...props
}: StaggerProps) {
  const reducedMotion = useReducedMotion();
  const containerVariants = resolveVariants(
    staggerContainer(staggerDelay, delayChildren),
    reducedMotion
  );
  const itemVariants = resolveVariants(childVariant, reducedMotion);
  const t = resolveTransition(transition.base, reducedMotion);

  const motionProps = animateOnMount
    ? { initial: "hidden" as const, animate: "visible" as const }
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once, margin: "-10% 0px" as const },
      };

  return (
    <motion.div
      variants={containerVariants}
      transition={t}
      className={cn(className)}
      {...motionProps}
      {...props}
    >
      {Children.toArray(children as ReactNode).map((child, i) => (
        <motion.div key={i} variants={itemVariants} transition={t}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  variant?: Variants;
}

export function StaggerItem({
  children,
  className,
  variant = fadeUp,
  ...props
}: StaggerItemProps) {
  const reducedMotion = useReducedMotion();
  const variants = resolveVariants(variant, reducedMotion);
  const t = resolveTransition(transition.base, reducedMotion);

  return (
    <motion.div variants={variants} transition={t} className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}

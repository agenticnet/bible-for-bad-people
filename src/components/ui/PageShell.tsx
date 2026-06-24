"use client";

import { motion } from "motion/react";
import BindingBar from "./BindingBar";
import BackLink from "./BackLink";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  fadeUp,
  resolveTransition,
  resolveVariants,
  transition,
} from "@/lib/motion";

interface PageShellProps {
  children: React.ReactNode;
  backHref?: string;
  showBack?: boolean;
  maxWidth?: "md" | "lg" | "xl" | "full";
  className?: string;
}

const maxWidthClass = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-full",
};

export default function PageShell({
  children,
  backHref = "/",
  showBack = true,
  maxWidth = "lg",
  className,
}: PageShellProps) {
  const reducedMotion = useReducedMotion();
  const variants = resolveVariants(fadeUp, reducedMotion);
  const t = resolveTransition(transition.base, reducedMotion);

  return (
    <div className="min-h-dvh bg-parchment">
      {showBack && (
        <BindingBar>
          <BackLink href={backHref} />
        </BindingBar>
      )}
      <motion.div
        className={`mx-auto px-4 py-8 sm:px-6 sm:py-12 ${maxWidthClass[maxWidth]}${className ? ` ${className}` : ""}`}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={t}
      >
        {children}
      </motion.div>
    </div>
  );
}

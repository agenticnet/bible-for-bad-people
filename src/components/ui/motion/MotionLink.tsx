"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { duration } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MotionLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function MotionLink({
  href,
  className,
  children,
  disabled = false,
}: MotionLinkProps) {
  const reducedMotion = useReducedMotion();

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={reducedMotion ? undefined : { y: -2 }}
      transition={{ duration: duration.fast }}
      className="h-full"
    >
      <Link href={href} className={cn("block h-full", className)}>
        {children}
      </Link>
    </motion.div>
  );
}

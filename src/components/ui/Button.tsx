"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { accentStyles, statusStyles, type Accent } from "./tokens";

type ButtonVariant = "accent" | "ghost" | "success" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  accent?: Accent;
  size?: "sm" | "md";
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm font-semibold",
};

export default function Button({
  variant = "accent",
  accent = "wine",
  size = "md",
  className,
  children,
  type,
  ...props
}: ButtonProps) {
  const reducedMotion = useReducedMotion();

  const variantClass =
    variant === "accent"
      ? cn(
          "rounded-lg border transition-colors",
          accentStyles[accent].border,
          accentStyles[accent].bg,
          accentStyles[accent].text,
          accentStyles[accent].bgHover,
          "disabled:opacity-40"
        )
      : variant === "ghost"
        ? cn(
            "rounded-lg border border-rule text-ink-soft transition-colors hover:text-ink",
            accentStyles[accent].borderHover
          )
        : variant === "success"
          ? cn(
              "rounded-lg border transition-colors",
              statusStyles.success.border,
              "bg-green-500/15 text-green-400 hover:border-green-500/40"
            )
          : cn(
              "rounded-lg border transition-colors",
              accentStyles.ember.border,
              accentStyles.ember.bg,
              accentStyles.ember.text,
              accentStyles.ember.bgHover
            );

  return (
    <motion.div
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      className="inline-flex"
    >
      <button
        type={type ?? "button"}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          sizeStyles[size],
          variantClass,
          className
        )}
        {...props}
      >
        {children}
      </button>
    </motion.div>
  );
}

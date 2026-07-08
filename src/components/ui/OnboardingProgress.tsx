"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { accentStyles } from "./tokens";

export interface OnboardingStep {
  id: string;
  label: string;
  description?: string;
}

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  activeStep: number;
  className?: string;
}

export default function OnboardingProgress({
  steps,
  activeStep,
  className,
}: OnboardingProgressProps) {
  const reducedMotion = useReducedMotion();
  const completedCount = steps.filter((_, i) => i < activeStep).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="verse-ref text-ink-soft">Ledger assembly</p>
        <p className="verse-ref text-wine">{progressPercent}% assembled</p>
      </div>

      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-rule">
        <div
          className="h-full rounded-full bg-wine transition-all duration-500"
          style={{ width: `${Math.max(progressPercent, 33)}%` }}
        />
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => {
          const isComplete = index < activeStep;
          const isActive = index === activeStep;

          return (
            <li
              key={step.id}
              className={cn(
                "rounded-xl border p-4 transition-colors",
                isComplete && cn(accentStyles.wine.borderMuted, accentStyles.wine.bgMuted),
                isActive &&
                  cn(
                    accentStyles.wine.border,
                    "bg-page",
                    !reducedMotion && "animate-pulse"
                  ),
                !isComplete && !isActive && "border-rule bg-page opacity-70"
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    isComplete && "bg-wine text-parchment",
                    isActive && "border border-wine text-wine",
                    !isComplete && !isActive && "border border-rule text-ink-soft"
                  )}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    (isComplete || isActive) && "text-ink",
                    !isComplete && !isActive && "text-ink-soft"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {step.description && (
                <p className="text-xs leading-relaxed text-ink-soft">{step.description}</p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "access",
    label: "Chamber Access",
    description: "All nine chambers unlocked. You're already in.",
  },
  {
    id: "build",
    label: "Build Your Ledger",
    description: "Pick chambers, accents, and alerts.",
  },
  {
    id: "claim",
    label: "Claim Your Salvation",
    description: "Name yourself. Keep what you built.",
  },
];

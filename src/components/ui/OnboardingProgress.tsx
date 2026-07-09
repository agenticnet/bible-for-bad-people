"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { accentStyles } from "./tokens";
import ProgressBar from "./ProgressBar";

export interface OnboardingStep {
  id: string;
  label: string;
  description?: string;
}

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  activeStep: number;
  percent?: number;
  className?: string;
}

export default function OnboardingProgress({
  steps,
  activeStep,
  percent,
  className,
}: OnboardingProgressProps) {
  const reducedMotion = useReducedMotion();
  const completedCount = steps.filter((_, i) => i < activeStep).length;
  const stepPercent = Math.round((completedCount / steps.length) * 100);
  const progressPercent = percent ?? stepPercent;

  return (
    <div className={cn("w-full", className)}>
      <ProgressBar
        percent={progressPercent}
        label="Ledger assembly"
        showPercent
        className="mb-6"
      />

      <ol
        className={cn(
          "grid gap-3",
          steps.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
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
    id: "identity",
    label: "Your Identity",
    description: "Display name and username.",
  },
  {
    id: "claim",
    label: "Claim Ledger",
    description: "Create your account.",
  },
];

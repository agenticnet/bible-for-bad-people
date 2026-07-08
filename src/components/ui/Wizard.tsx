import { cn } from "@/lib/utils";
import type { OnboardingStep } from "./OnboardingProgress";
import ProgressBar from "./ProgressBar";

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
}

interface WizardProps {
  steps: WizardStep[] | OnboardingStep[];
  activeStep: number;
  children: React.ReactNode;
  progressSlot?: React.ReactNode;
  className?: string;
}

export default function Wizard({
  steps,
  activeStep,
  children,
  progressSlot,
  className,
}: WizardProps) {
  const completedCount = steps.filter((_, i) => i < activeStep).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className={cn("w-full", className)}>
      {progressSlot ?? (
        <ProgressBar
          percent={progressPercent}
          label="Progress"
          showPercent
          className="mb-8"
        />
      )}
      <div>{children}</div>
    </div>
  );
}

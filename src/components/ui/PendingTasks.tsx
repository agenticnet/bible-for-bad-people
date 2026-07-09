"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import {
  computeOnboardingPercent,
  getPendingTasks,
  getPendingTasksWidgetCopy,
  getPendingTaskStage,
  hasIncompleteOnboarding,
} from "@/lib/ux/pendingTasks";
import { isWelcomeComplete } from "@/lib/ux/welcome";
import LinkButton from "./LinkButton";
import ProgressBar from "./ProgressBar";
import Surface from "./Surface";

interface PendingTasksProps {
  className?: string;
}

export default function PendingTasks({ className }: PendingTasksProps) {
  const { profile } = useAuth();
  const { draft } = useOnboardingDraft();
  const [welcomeComplete, setWelcomeComplete] = useState(false);

  useEffect(() => {
    setWelcomeComplete(isWelcomeComplete());
  }, [profile?.onboarding_completed_at]);

  if (!hasIncompleteOnboarding(profile, draft, welcomeComplete)) return null;

  const tasks = getPendingTasks(profile, draft, welcomeComplete);
  const percent = computeOnboardingPercent(profile, draft, welcomeComplete);
  const stage = getPendingTaskStage(profile, welcomeComplete);
  const copy = getPendingTasksWidgetCopy(stage);
  const resumeHref = tasks[0]?.href ?? "/onboarding";

  return (
    <Surface accent="wine" accentTint className={className} padding="md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="verse-ref mb-1 text-wine">{copy.kicker}</p>
          <h3 className="font-serif text-lg text-ink">{copy.title}</h3>
        </div>
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center"
          aria-hidden
        >
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-rule"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-wine"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${percent} 100`}
              pathLength={100}
            />
          </svg>
          <span className="absolute text-[10px] font-semibold text-wine">
            {percent}%
          </span>
        </div>
      </div>

      <ProgressBar percent={percent} className="mb-4" />

      <ul className="mb-4 space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-2 text-sm text-ink-soft">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-wine/40">
              <span className="h-1.5 w-1.5 rounded-full bg-wine/60" />
            </span>
            {task.label}
          </li>
        ))}
      </ul>

      <LinkButton href={resumeHref} className="w-full sm:w-auto">
        {stage === "pre_claim" ? "Resume setup" : "Continue"}
      </LinkButton>
    </Surface>
  );
}

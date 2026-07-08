import type { OnboardingDraft } from "@/lib/auth/onboardingDraft";
import {
  DEFAULT_ACCENT,
  DEFAULT_FAVORITE_CHAMBERS,
  createDefaultDraft,
} from "@/lib/auth/smartDefaults";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface PendingTask {
  id: string;
  label: string;
  href: string;
  complete: boolean;
}

type TaskCheck = (draft: OnboardingDraft, profile: Profile | null) => boolean;

const ONBOARDING_TASK_DEFS: {
  id: string;
  label: string;
  href: string;
  check: TaskCheck;
}[] = [
  {
    id: "chambers",
    label: "Pin your chambers",
    href: "/onboarding",
    check: (draft) =>
      draft.favoriteChambers.length > 0 &&
      !arraysEqual(draft.favoriteChambers, [...DEFAULT_FAVORITE_CHAMBERS]),
  },
  {
    id: "prefs",
    label: "Choose your accent & alerts",
    href: "/onboarding?step=prefs",
    check: (draft) =>
      draft.defaultAccent !== DEFAULT_ACCENT ||
      draft.notificationPrefs.smiteAlerts !==
        createDefaultDraft().notificationPrefs.smiteAlerts,
  },
  {
    id: "identity",
    label: "Set your display name",
    href: "/onboarding?step=identity",
    check: (draft) => draft.displayName.trim().length > 0,
  },
  {
    id: "claim",
    label: "Claim your ledger",
    href: "/onboarding?step=claim",
    check: (_draft, profile) => Boolean(profile?.onboarding_completed_at),
  },
];

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

export function getPendingTasks(
  profile: Profile | null,
  draft: OnboardingDraft
): PendingTask[] {
  if (profile?.onboarding_completed_at) return [];

  return ONBOARDING_TASK_DEFS.map((def) => ({
    id: def.id,
    label: def.label,
    href: def.href,
    complete: def.check(draft, profile),
  })).filter((task) => !task.complete);
}

export function computeOnboardingPercent(
  profile: Profile | null,
  draft: OnboardingDraft
): number {
  if (profile?.onboarding_completed_at) return 100;

  const completed = ONBOARDING_TASK_DEFS.filter((def) =>
    def.check(draft, profile)
  ).length;

  return Math.round((completed / ONBOARDING_TASK_DEFS.length) * 100);
}

export function hasIncompleteOnboarding(
  profile: Profile | null,
  draft: OnboardingDraft
): boolean {
  if (profile?.onboarding_completed_at) return false;
  return getPendingTasks(profile, draft).length > 0;
}

import type { OnboardingDraft } from "@/lib/auth/onboardingDraft";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";
import {
  DEFAULT_ACCENT,
  DEFAULT_FAVORITE_CHAMBERS,
  DEFAULT_NOTIFICATION_PREFS,
} from "@/lib/auth/smartDefaults";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface PendingTask {
  id: string;
  label: string;
  href: string;
  complete: boolean;
}

export type PendingTaskStage =
  | "pre_claim"
  | "post_signup"
  | "pre_purchase"
  | "post_checkout"
  | "done";

type TaskCheck = (
  draft: OnboardingDraft,
  profile: Profile | null,
  welcomeComplete: boolean
) => boolean;

const PRE_CLAIM_TASK_DEFS: {
  id: string;
  label: string;
  href: string;
  check: TaskCheck;
}[] = [
  {
    id: "identity",
    label: "Choose your username",
    href: "/onboarding",
    check: (draft) => isValidUsername(normalizeUsername(draft.username)),
  },
  {
    id: "claim",
    label: "Claim your ledger",
    href: "/onboarding?step=claim",
    check: (_draft, profile) => Boolean(profile?.onboarding_completed_at),
  },
];

const POST_SIGNUP_TASK_DEFS: {
  id: string;
  label: string;
  href: string;
  check: TaskCheck;
}[] = [
  {
    id: "oracle",
    label: "Get your doom reading",
    href: "/oracle?welcome=1",
    check: (_draft, _profile, welcomeComplete) => welcomeComplete,
  },
];

const PRE_PURCHASE_TASK_DEFS: {
  id: string;
  label: string;
  href: string;
  check: TaskCheck;
}[] = [
  {
    id: "indulgences",
    label: "Browse indulgences",
    href: "/indulgences",
    check: (_draft, profile) => Number(profile?.total_spent ?? 0) > 0,
  },
];

const POST_CHECKOUT_TASK_DEFS: {
  id: string;
  label: string;
  href: string;
  check: TaskCheck;
}[] = [
  {
    id: "chambers",
    label: "Pin your chambers",
    href: "/settings",
    check: (_draft, profile) => hasCustomChambers(profile),
  },
  {
    id: "prefs",
    label: "Choose accent & alerts",
    href: "/settings",
    check: (_draft, profile) => hasCustomPrefs(profile),
  },
];

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

function hasCustomChambers(profile: Profile | null): boolean {
  if (!profile) return false;
  return (
    profile.favorite_chambers.length > 0 &&
    !arraysEqual(profile.favorite_chambers, [...DEFAULT_FAVORITE_CHAMBERS])
  );
}

function hasCustomPrefs(profile: Profile | null): boolean {
  if (!profile) return false;
  return (
    profile.default_accent !== DEFAULT_ACCENT ||
    profile.notification_prefs.smiteAlerts !== DEFAULT_NOTIFICATION_PREFS.smiteAlerts
  );
}

function getActiveTaskDefs(
  profile: Profile | null,
  welcomeComplete: boolean
): typeof PRE_CLAIM_TASK_DEFS {
  if (!profile?.onboarding_completed_at) {
    return PRE_CLAIM_TASK_DEFS;
  }
  if (!welcomeComplete) {
    return POST_SIGNUP_TASK_DEFS;
  }
  if (Number(profile.total_spent) <= 0) {
    return PRE_PURCHASE_TASK_DEFS;
  }
  if (!hasCustomChambers(profile) || !hasCustomPrefs(profile)) {
    return POST_CHECKOUT_TASK_DEFS;
  }
  return [];
}

export function getPendingTaskStage(
  profile: Profile | null,
  welcomeComplete: boolean
): PendingTaskStage {
  if (!profile?.onboarding_completed_at) return "pre_claim";
  if (!welcomeComplete) return "post_signup";
  if (Number(profile.total_spent) <= 0) return "pre_purchase";
  if (!hasCustomChambers(profile) || !hasCustomPrefs(profile)) return "post_checkout";
  return "done";
}

export function getPendingTasksWidgetCopy(stage: PendingTaskStage): {
  kicker: string;
  title: string;
} {
  switch (stage) {
    case "pre_claim":
      return { kicker: "Pending setup", title: "Finish claiming your ledger" };
    case "post_signup":
      return { kicker: "Get started", title: "Your next step" };
    case "pre_purchase":
      return { kicker: "Get started", title: "Your next step" };
    case "post_checkout":
      return { kicker: "Personalize", title: "Personalize your ledger" };
    case "done":
      return { kicker: "", title: "" };
    default: {
      const _exhaustive: never = stage;
      return _exhaustive;
    }
  }
}

export function getPendingTasks(
  profile: Profile | null,
  draft: OnboardingDraft,
  welcomeComplete: boolean
): PendingTask[] {
  const defs = getActiveTaskDefs(profile, welcomeComplete);
  if (defs.length === 0) return [];

  return defs
    .map((def) => ({
      id: def.id,
      label: def.label,
      href: def.href,
      complete: def.check(draft, profile, welcomeComplete),
    }))
    .filter((task) => !task.complete);
}

export function computeOnboardingPercent(
  profile: Profile | null,
  draft: OnboardingDraft,
  welcomeComplete: boolean
): number {
  const defs = getActiveTaskDefs(profile, welcomeComplete);
  if (defs.length === 0) return 100;

  const completed = defs.filter((def) =>
    def.check(draft, profile, welcomeComplete)
  ).length;

  return Math.round((completed / defs.length) * 100);
}

export function hasIncompleteOnboarding(
  profile: Profile | null,
  draft: OnboardingDraft,
  welcomeComplete: boolean
): boolean {
  return getPendingTasks(profile, draft, welcomeComplete).length > 0;
}

export function shouldShowPendingBadge(profile: Profile | null): boolean {
  return !profile?.onboarding_completed_at;
}

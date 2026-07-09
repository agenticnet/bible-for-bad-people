import type { Accent } from "@/components/ui/tokens";
import { createDefaultDraft } from "./smartDefaults";

export const ONBOARDING_DRAFT_KEY = "bfb-onboarding-draft";

export interface NotificationPrefs {
  weeklyDigest: boolean;
  sinReminders: boolean;
  smiteAlerts: boolean;
}

export interface OnboardingDraft {
  favoriteChambers: string[];
  chamberOrder: string[];
  defaultAccent: Accent;
  notificationPrefs: NotificationPrefs;
  username: string;
  starterPackId: string;
}

export interface OnboardingPreferences {
  favoriteChambers: string[];
  chamberOrder: string[];
  defaultAccent: Accent;
  notificationPrefs: NotificationPrefs;
  starterPackId: string | null;
}

export function loadOnboardingDraft(): OnboardingDraft {
  if (typeof window === "undefined") return createDefaultDraft();
  try {
    const raw = localStorage.getItem(ONBOARDING_DRAFT_KEY);
    if (!raw) return createDefaultDraft();
    const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
    const defaults = createDefaultDraft();
    return {
      ...defaults,
      ...parsed,
      notificationPrefs: {
        ...defaults.notificationPrefs,
        ...parsed.notificationPrefs,
      },
    };
  } catch {
    return createDefaultDraft();
  }
}

export function saveOnboardingDraft(draft: OnboardingDraft): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export function clearOnboardingDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ONBOARDING_DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function draftToPreferences(draft: OnboardingDraft): OnboardingPreferences {
  return {
    favoriteChambers: draft.favoriteChambers,
    chamberOrder: draft.chamberOrder,
    defaultAccent: draft.defaultAccent,
    notificationPrefs: draft.notificationPrefs,
    starterPackId: null,
  };
}

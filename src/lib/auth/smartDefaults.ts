import type { Accent } from "@/components/ui/tokens";
import { chambers } from "@/lib/chambers";
import type { NotificationPrefs, OnboardingDraft } from "./onboardingDraft";

export const DEFAULT_FAVORITE_CHAMBERS = [
  "speak-with-god",
  "oracle-of-doom",
  "sin-translation",
] as const;

export const DEFAULT_ACCENT: Accent = "wine";

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  weeklyDigest: true,
  sinReminders: true,
  smiteAlerts: false,
};

export const DEFAULT_STARTER_PACK_ID = "venial-coupon";

export const STARTER_PACK_OPTIONS = [
  "venial-coupon",
  "weekend-pass",
  "soul-insurance",
] as const;

export function getDefaultChamberOrder(): string[] {
  return chambers.filter((c) => c.status === "live").map((c) => c.id);
}

export function suggestUsername(email?: string): string {
  if (email) {
    const local = email.split("@")[0] ?? "";
    const sanitized = local
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 20);
    if (sanitized.length >= 3) return sanitized;
  }
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `petty_saint_${suffix}`;
}

export function createDefaultDraft(): OnboardingDraft {
  const order = getDefaultChamberOrder();
  return {
    favoriteChambers: [...DEFAULT_FAVORITE_CHAMBERS],
    chamberOrder: order,
    defaultAccent: DEFAULT_ACCENT,
    notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS },
    username: suggestUsername(),
    starterPackId: DEFAULT_STARTER_PACK_ID,
    started: false,
  };
}

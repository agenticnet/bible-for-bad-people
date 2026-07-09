"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { updateProfilePreferences } from "@/lib/auth/actions";
import type { NotificationPrefs } from "@/lib/auth/onboardingDraft";
import { getDefaultChamberOrder } from "@/lib/auth/smartDefaults";
import ChamberPickerStep from "@/components/onboarding/steps/ChamberPickerStep";
import AccentNotificationStep from "@/components/onboarding/steps/AccentNotificationStep";
import {
  BackLink,
  Button,
  Callout,
  LinkButton,
  PageShell,
  Surface,
} from "@/components/ui";
import type { Accent } from "@/components/ui/tokens";

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, isLoading, refreshProfile } = useAuth();

  const [favoriteChambers, setFavoriteChambers] = useState<string[]>([]);
  const [chamberOrder, setChamberOrder] = useState<string[]>([]);
  const [defaultAccent, setDefaultAccent] = useState<Accent>("wine");
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    weeklyDigest: true,
    sinReminders: true,
    smiteAlerts: false,
  });
  const [chambersSaving, setChambersSaving] = useState(false);
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [chambersMessage, setChambersMessage] = useState<string | null>(null);
  const [prefsMessage, setPrefsMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setFavoriteChambers(profile.favorite_chambers ?? []);
    setChamberOrder(
      profile.chamber_order?.length ? profile.chamber_order : getDefaultChamberOrder()
    );
    setDefaultAccent((profile.default_accent as Accent) ?? "wine");
    setNotificationPrefs(profile.notification_prefs);
  }, [profile]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?next=/settings");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <PageShell maxWidth="lg">
        <p className="py-12 text-center text-ink-soft">Loading settings...</p>
      </PageShell>
    );
  }

  if (!profile) {
    return (
      <PageShell maxWidth="md">
        <div className="py-12 text-center">
          <p className="mb-4 text-ink">Claim your ledger before changing settings.</p>
          <LinkButton href="/onboarding?step=claim&next=/settings">
            Claim your ledger
          </LinkButton>
        </div>
      </PageShell>
    );
  }

  const hasPurchased = Number(profile.total_spent) > 0;

  async function saveChambers() {
    setChambersSaving(true);
    setChambersMessage(null);
    const result = await updateProfilePreferences({
      favoriteChambers,
      chamberOrder,
    });
    setChambersSaving(false);
    if (result.error) {
      setChambersMessage(result.error);
      return;
    }
    setChambersMessage("Chamber layout saved.");
    await refreshProfile();
  }

  async function savePrefs() {
    setPrefsSaving(true);
    setPrefsMessage(null);
    const result = await updateProfilePreferences({
      defaultAccent,
      notificationPrefs,
    });
    setPrefsSaving(false);
    if (result.error) {
      setPrefsMessage(result.error);
      return;
    }
    setPrefsMessage("Accent and alerts saved.");
    await refreshProfile();
  }

  return (
    <PageShell maxWidth="lg">
      <div className="py-8">
        <div className="mb-6">
          <BackLink href="/" />
        </div>
        <p className="verse-ref mb-2 text-wine">Settings</p>
        <h1 className="mb-2 font-serif text-3xl text-ink">Your Ledger Preferences</h1>
        <p className="mb-8 max-w-xl text-sm text-ink-soft">
          Deeper customization for sinners who have invested in their salvation.
        </p>

        {!hasPurchased ? (
          <Callout tone="wine">
            <p className="font-medium text-ink">Customization unlocks after your first purchase.</p>
            <p className="mt-1 mb-4 text-sm text-ink-soft">
              Browse the indulgences marketplace to unlock chamber pinning, accent
              colors, and notification defaults.
            </p>
            <LinkButton href="/indulgences">Browse indulgences</LinkButton>
          </Callout>
        ) : (
          <div className="space-y-10">
            <Surface accent="wine" padding="lg">
              <ChamberPickerStep
                mode="profile"
                kicker="Chambers"
                value={{ favoriteChambers, chamberOrder }}
                onChange={(updates) => {
                  if (updates.favoriteChambers !== undefined) {
                    setFavoriteChambers(updates.favoriteChambers);
                  }
                  if (updates.chamberOrder !== undefined) {
                    setChamberOrder(updates.chamberOrder);
                  }
                }}
              />
              {chambersMessage && (
                <p className="mt-4 text-sm text-ink-soft">{chambersMessage}</p>
              )}
              <Button
                type="button"
                accent="wine"
                className="mt-6"
                disabled={chambersSaving}
                onClick={() => void saveChambers()}
              >
                {chambersSaving ? "Saving..." : "Save chamber layout"}
              </Button>
            </Surface>

            <Surface accent="wine" padding="lg">
              <AccentNotificationStep
                mode="profile"
                kicker="Appearance"
                value={{ defaultAccent, notificationPrefs }}
                onChange={(updates) => {
                  if (updates.defaultAccent !== undefined) {
                    setDefaultAccent(updates.defaultAccent);
                  }
                  if (updates.notificationPrefs !== undefined) {
                    setNotificationPrefs(updates.notificationPrefs);
                  }
                }}
              />
              <p className="mt-4 text-xs text-ink-soft">
                Accent color is stored for future UI theming. Notifications are saved
                for when alerts go live.
              </p>
              {prefsMessage && (
                <p className="mt-4 text-sm text-ink-soft">{prefsMessage}</p>
              )}
              <Button
                type="button"
                accent="wine"
                className="mt-6"
                disabled={prefsSaving}
                onClick={() => void savePrefs()}
              >
                {prefsSaving ? "Saving..." : "Save accent & alerts"}
              </Button>
            </Surface>
          </div>
        )}

        <p className="mt-8 text-sm text-ink-soft">
          View your public profile at{" "}
          <Link href={`/u/${profile.username}`} className="text-wine hover:underline">
            u/{profile.username}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}

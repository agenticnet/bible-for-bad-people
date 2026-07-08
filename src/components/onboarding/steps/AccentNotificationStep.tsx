"use client";

import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { Disclosure, OptionTile, SectionHeader } from "@/components/ui";
import { accentStyles, type Accent } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

const PRIMARY_ACCENTS: Accent[] = ["wine", "plum", "slate"];
const MORE_ACCENTS: Accent[] = ["terra", "ember"];

const NOTIFICATION_OPTIONS = [
  { key: "weeklyDigest" as const, label: "Weekly sin digest", hint: "A roundup of your moral decline." },
  { key: "sinReminders" as const, label: "Sin reminders", hint: "Gentle nudges to log petty crimes." },
  { key: "smiteAlerts" as const, label: "Smite alerts", hint: "When your free smites reset." },
];

export default function AccentNotificationStep() {
  const { draft, updateDraft } = useOnboardingDraft();

  function toggleNotification(key: keyof typeof draft.notificationPrefs) {
    updateDraft({
      notificationPrefs: {
        ...draft.notificationPrefs,
        [key]: !draft.notificationPrefs[key],
      },
    });
  }

  const enabledCount = Object.values(draft.notificationPrefs).filter(Boolean).length;

  return (
    <div className="space-y-8">
      <div>
        <SectionHeader
          kicker="Step 2"
          title="Choose Your Accent"
          description="The binding color for your ledger. Wine is the crowd favorite."
          accent="wine"
        />
        <div className="flex flex-wrap gap-2">
          {PRIMARY_ACCENTS.map((accent) => (
            <OptionTile
              key={accent}
              selected={draft.defaultAccent === accent}
              accent={accent}
              onClick={() => updateDraft({ defaultAccent: accent })}
            >
              <span
                className={cn(
                  "h-6 w-6 rounded-full border",
                  accentStyles[accent].border,
                  accentStyles[accent].bgMuted
                )}
              />
              <span className="text-xs capitalize">{accent}</span>
            </OptionTile>
          ))}
        </div>

        <Disclosure label="More accents" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {MORE_ACCENTS.map((accent) => (
              <OptionTile
                key={accent}
                selected={draft.defaultAccent === accent}
                accent={accent}
                onClick={() => updateDraft({ defaultAccent: accent })}
              >
                <span
                  className={cn(
                    "h-6 w-6 rounded-full border",
                    accentStyles[accent].border,
                    accentStyles[accent].bgMuted
                  )}
                />
                <span className="text-xs capitalize">{accent}</span>
              </OptionTile>
            ))}
          </div>
        </Disclosure>
      </div>

      <div>
        <SectionHeader
          kicker="Alerts"
          title="Notification Preferences"
          description="Pre-enabled for sinners who forget to log."
          accent="wine"
        />
        <Disclosure
          label="Notification preferences"
          summary={`${enabledCount} alert${enabledCount === 1 ? "" : "s"} enabled`}
        >
          <div className="space-y-2">
            {NOTIFICATION_OPTIONS.map((opt) => (
              <label
                key={opt.key}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-rule bg-page p-3"
              >
                <input
                  type="checkbox"
                  checked={draft.notificationPrefs[opt.key]}
                  onChange={() => toggleNotification(opt.key)}
                  className="mt-1 accent-wine"
                />
                <div>
                  <p className="text-sm font-medium text-ink">{opt.label}</p>
                  <p className="text-xs text-ink-soft">{opt.hint}</p>
                </div>
              </label>
            ))}
          </div>
        </Disclosure>
      </div>
    </div>
  );
}

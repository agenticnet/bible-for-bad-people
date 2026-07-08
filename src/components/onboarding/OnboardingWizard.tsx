"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { computeOnboardingPercent } from "@/lib/ux/pendingTasks";
import {
  BackLink,
  FormActions,
  OnboardingProgress,
  ONBOARDING_STEPS,
  PageShell,
  Wizard,
} from "@/components/ui";
import OnboardingPreviewPanel from "./OnboardingPreviewPanel";
import ChamberPickerStep from "./steps/ChamberPickerStep";
import AccentNotificationStep from "./steps/AccentNotificationStep";
import IdentityStarterStep from "./steps/IdentityStarterStep";
import ClaimLedgerStep from "./steps/ClaimLedgerStep";

type WizardPhase = "chambers" | "prefs" | "identity" | "claim";

const PHASE_ORDER: WizardPhase[] = ["chambers", "prefs", "identity", "claim"];

function parsePhase(step: string | null): WizardPhase {
  if (step === "prefs") return "prefs";
  if (step === "identity") return "identity";
  if (step === "claim") return "claim";
  return "chambers";
}

export default function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const { draft } = useOnboardingDraft();

  const phase = parsePhase(searchParams.get("step"));
  const phaseIndex = PHASE_ORDER.indexOf(phase);

  function goToPhase(next: WizardPhase) {
    const query = next === "chambers" ? "/onboarding" : `/onboarding?step=${next}`;
    const nextPath = searchParams.get("next");
    const suffix = nextPath ? `${query.includes("?") ? "&" : "?"}next=${encodeURIComponent(nextPath)}` : "";
    router.push(`${query}${suffix}`);
  }

  if (profile?.onboarding_completed_at) {
    return (
      <PageShell maxWidth="md">
        <div className="py-12 text-center">
          <p className="mb-4 text-ink">Your ledger is already claimed.</p>
          <BackLink href="/" />
        </div>
      </PageShell>
    );
  }

  const draftPercent = computeOnboardingPercent(profile, draft);

  return (
    <PageShell maxWidth="lg">
      <div className="py-8">
        <div className="mb-8">
          <p className="verse-ref mb-2 text-wine">Customization Builder</p>
          <h1 className="mb-2 font-serif text-3xl text-ink">Build Your Personalized Ledger</h1>
          <p className="max-w-xl text-sm text-ink-soft">
            You&apos;re not signing up — you&apos;re assembling a salvation dashboard.
            Chamber access is already yours.
          </p>
        </div>

        <Wizard
          steps={ONBOARDING_STEPS}
          activeStep={phaseIndex}
          progressSlot={
            <OnboardingProgress
              steps={ONBOARDING_STEPS}
              activeStep={phaseIndex}
              percent={draftPercent}
              className="mb-10"
            />
          }
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
            <div>
              {phase === "chambers" && <ChamberPickerStep />}
              {phase === "prefs" && <AccentNotificationStep />}
              {phase === "identity" && <IdentityStarterStep />}
              {phase === "claim" && <ClaimLedgerStep />}

              {phase !== "claim" && (
                <FormActions
                  primaryLabel="Continue"
                  onPrimary={() => goToPhase(PHASE_ORDER[phaseIndex + 1]!)}
                  onBack={
                    phaseIndex > 0
                      ? () => goToPhase(PHASE_ORDER[phaseIndex - 1]!)
                      : undefined
                  }
                />
              )}
            </div>

            <OnboardingPreviewPanel />
          </div>
        </Wizard>
      </div>
    </PageShell>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BackLink,
  Button,
  OnboardingProgress,
  ONBOARDING_STEPS,
  PageShell,
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

  const phase = parsePhase(searchParams.get("step"));
  const progressActive = phase === "claim" ? 2 : 1;

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

  const phaseIndex = PHASE_ORDER.indexOf(phase);

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

        <OnboardingProgress
          steps={ONBOARDING_STEPS}
          activeStep={progressActive}
          className="mb-10"
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div>
            {phase === "chambers" && <ChamberPickerStep />}
            {phase === "prefs" && <AccentNotificationStep />}
            {phase === "identity" && <IdentityStarterStep />}
            {phase === "claim" && <ClaimLedgerStep />}

            {phase !== "claim" && (
              <div className="mt-8 flex justify-between gap-3">
                {phaseIndex > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    accent="wine"
                    onClick={() => goToPhase(PHASE_ORDER[phaseIndex - 1]!)}
                  >
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  type="button"
                  accent="wine"
                  onClick={() => goToPhase(PHASE_ORDER[phaseIndex + 1]!)}
                >
                  Continue
                </Button>
              </div>
            )}
          </div>

          <OnboardingPreviewPanel />
        </div>
      </div>
    </PageShell>
  );
}

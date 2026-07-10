"use client";

import { useEffect, useState } from "react";
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
import IdentityStarterStep from "./steps/IdentityStarterStep";
import ClaimLedgerStep from "./steps/ClaimLedgerStep";

type WizardPhase = "identity" | "claim";

const PHASE_ORDER: WizardPhase[] = ["identity", "claim"];

function parsePhase(step: string | null): WizardPhase {
  if (step === "claim") return "claim";
  return "identity";
}

export default function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const { draft, markStarted } = useOnboardingDraft();
  const [usernameValid, setUsernameValid] = useState(false);

  const phase = parsePhase(searchParams.get("step"));
  const phaseIndex = PHASE_ORDER.indexOf(phase);

  useEffect(() => {
    markStarted();
  }, [markStarted]);

  useEffect(() => {
    const legacyStep = searchParams.get("step");
    if (legacyStep === "chambers" || legacyStep === "prefs") {
      if (profile) {
        router.replace("/settings");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [searchParams, profile, router]);

  function goToPhase(next: WizardPhase) {
    const query = next === "identity" ? "/onboarding" : `/onboarding?step=${next}`;
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

  const draftPercent = computeOnboardingPercent(profile, draft, false);

  return (
    <PageShell maxWidth="lg">
      <div className="py-8">
        <div className="mb-8">
          <p className="verse-ref mb-2 text-wine">Claim Your Ledger</p>
          <h1 className="mb-2 font-serif text-3xl text-ink">Pick Your Username. Keep Your Sins.</h1>
          <p className="max-w-xl text-sm text-ink-soft">
            Two quick steps to claim your salvation ledger. Chamber access is already
            yours.
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
          <div>
            {phase === "identity" && (
              <IdentityStarterStep onValidityChange={setUsernameValid} />
            )}
            {phase === "claim" && <ClaimLedgerStep />}

            {phase !== "claim" && (
              <FormActions
                primaryLabel="Continue"
                onPrimary={() => goToPhase(PHASE_ORDER[phaseIndex + 1]!)}
                primaryDisabled={!usernameValid}
                onBack={
                  phaseIndex > 0
                    ? () => goToPhase(PHASE_ORDER[phaseIndex - 1]!)
                    : undefined
                }
              />
            )}
          </div>
        </Wizard>
      </div>
    </PageShell>
  );
}

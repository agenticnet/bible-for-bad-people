import { Suspense } from "react";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { LoadingState } from "@/components/ui";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading builder…" />}>
      <OnboardingWizard />
    </Suspense>
  );
}

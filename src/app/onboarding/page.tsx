import { Suspense } from "react";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-ink-soft">Loading builder...</p>}>
      <OnboardingWizard />
    </Suspense>
  );
}

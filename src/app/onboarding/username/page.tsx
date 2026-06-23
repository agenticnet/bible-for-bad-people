import { Suspense } from "react";
import UsernameOnboardingForm from "./UsernameOnboardingForm";

export default function UsernameOnboardingPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-ink-soft">Loading...</p>}>
      <UsernameOnboardingForm />
    </Suspense>
  );
}

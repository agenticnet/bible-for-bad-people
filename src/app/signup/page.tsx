import { Suspense } from "react";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-ink-soft">Loading...</p>}>
      <SignupForm />
    </Suspense>
  );
}

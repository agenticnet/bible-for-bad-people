import { Suspense } from "react";
import SignupForm from "./SignupForm";
import { LoadingState } from "@/components/ui";

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading…" />}>
      <SignupForm />
    </Suspense>
  );
}

import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { LoadingState } from "@/components/ui";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading…" />}>
      <LoginForm />
    </Suspense>
  );
}

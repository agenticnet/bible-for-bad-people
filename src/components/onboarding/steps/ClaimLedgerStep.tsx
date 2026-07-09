"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProfile } from "@/lib/auth/actions";
import { draftToPreferences, clearOnboardingDraft } from "@/lib/auth/onboardingDraft";
import { postSignupRedirectPath } from "@/lib/auth/redirect";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { Button, FormActions, Input, Label, SectionHeader, SuccessMoment } from "@/components/ui";

export default function ClaimLedgerStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const { draft } = useOnboardingDraft();
  const next = postSignupRedirectPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);

  async function finishProfile() {
    const normalized = normalizeUsername(draft.username);
    if (!isValidUsername(normalized)) {
      setError("Fix your username before claiming your ledger.");
      return false;
    }

    const preferences = draftToPreferences(draft);
    const result = await createProfile(normalized, preferences);
    if (result.error) {
      setError(result.error);
      return false;
    }

    clearOnboardingDraft();
    await refreshProfile();
    setClaimed(true);
    return true;
  }

  function handleSuccessDismiss() {
    router.push(next);
    router.refresh();
  }

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalized = normalizeUsername(draft.username);
    if (!isValidUsername(normalized)) {
      setError("Username must be 3–20 characters: lowercase letters, numbers, underscores.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { pending_username: normalized } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError("Confirm your email, then log in to claim your ledger.");
      setLoading(false);
      return;
    }

    const ok = await finishProfile();
    setLoading(false);
    if (!ok) return;
  }

  async function handleGoogle() {
    setError(null);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(`/onboarding?step=claim&next=${encodeURIComponent(next)}`)}`,
      },
    });
    if (oauthError) setError(oauthError.message);
  }

  async function handleExistingUser() {
    setLoading(true);
    const ok = await finishProfile();
    setLoading(false);
    if (!ok) return;
  }

  if (claimed) {
    return (
      <SuccessMoment
        title="Ledger claimed!"
        description="Your salvation dashboard is ready. Welcome to the fold."
        autoDismissMs={2500}
        onDismiss={handleSuccessDismiss}
      />
    );
  }

  return (
    <div>
      <SectionHeader
        kicker="Step 2"
        title="Claim Your Salvation"
        description="Create your account and lock in your ledger."
        accent="wine"
      />

      {user ? (
        <FormActions
          primaryLabel={loading ? "Claiming..." : "Claim Your Ledger"}
          onPrimary={() => void handleExistingUser()}
          primaryDisabled={loading}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            size="lg"
            accent="wine"
            className="w-full sm:ml-auto sm:w-auto"
            onClick={handleGoogle}
            disabled={loading}
          >
            Continue with Google
          </Button>
          <form onSubmit={handleEmailSignup} className="flex flex-col gap-3">
            <div>
              <Label htmlFor="claim-email">Email</Label>
              <Input
                id="claim-email"
                type="email"
                accent="wine"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="claim-password">Password</Label>
              <Input
                id="claim-password"
                type="password"
                accent="wine"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-sm text-ember">{error}</p>}
            <FormActions
              primaryLabel={loading ? "Creating ledger..." : "Claim Your Ledger"}
              primaryType="submit"
              primaryDisabled={loading}
            />
          </form>
        </div>
      )}
    </div>
  );
}

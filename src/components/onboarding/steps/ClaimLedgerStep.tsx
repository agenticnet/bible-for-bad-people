"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProfile } from "@/lib/auth/actions";
import { draftToPreferences, clearOnboardingDraft } from "@/lib/auth/onboardingDraft";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { starterPackCopy } from "@/lib/auth/upsellCopy";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { Button, Input, Label, SectionHeader } from "@/components/ui";

export default function ClaimLedgerStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const { draft } = useOnboardingDraft();
  const next = safeRedirectPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    router.push(next);
    router.refresh();
    return true;
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

  return (
    <div>
      <SectionHeader
        kicker="Step 4"
        title="Claim Your Salvation"
        description="Not a sign-up form — the final step in building your ledger."
        accent="wine"
      />

      <p className="mb-6 text-sm text-ink-soft">
        {starterPackCopy(draft.starterPackId)}
      </p>

      {user ? (
        <Button accent="wine" onClick={() => void handleExistingUser()} disabled={loading}>
          {loading ? "Claiming..." : "Claim Your Ledger"}
        </Button>
      ) : (
        <div className="flex flex-col gap-4">
          <Button type="button" accent="wine" onClick={handleGoogle} disabled={loading}>
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
            <Button type="submit" accent="wine" disabled={loading}>
              {loading ? "Creating ledger..." : "Claim Your Ledger"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

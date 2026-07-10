"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProfile } from "@/lib/auth/actions";
import { draftToPreferences, loadOnboardingDraft, clearOnboardingDraft } from "@/lib/auth/onboardingDraft";
import { suggestUsername } from "@/lib/auth/smartDefaults";
import { postSignupRedirectPath } from "@/lib/auth/redirect";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";
import AuthFormShell from "@/components/auth/AuthFormShell";
import { Button, Input, Label } from "@/components/ui";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshProfile } = useAuth();
  const { draft, markStarted } = useOnboardingDraft();
  const next = postSignupRedirectPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(draft.username || suggestUsername());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    markStarted();
    setUsername(draft.username || suggestUsername());
  }, [markStarted, draft.username]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const normalized = normalizeUsername(username);
    if (!isValidUsername(normalized)) {
      setError("Username must be 3–20 characters: lowercase letters, numbers, underscores.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { pending_username: normalized },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Sign up failed. Check your email for a confirmation link.");
      setLoading(false);
      return;
    }

    if (!data.session) {
      setSuccess(
        "Account created. Confirm your email, then log in — your username will be saved automatically."
      );
      setLoading(false);
      return;
    }

    const currentDraft = loadOnboardingDraft();
    const preferences = draftToPreferences({
      ...currentDraft,
      username: normalized,
    });
    const profileResult = await createProfile(normalized, preferences);
    if (profileResult.error) {
      setError(profileResult.error);
      setLoading(false);
      return;
    }

    clearOnboardingDraft();
    await refreshProfile();
    setLoading(false);
    router.push(next);
    router.refresh();
  }

  async function handleGoogle() {
    setError(null);
    const supabase = createClient();
    const origin = window.location.origin;
    const onboardingNext = `/onboarding?step=claim&next=${encodeURIComponent(next)}`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(onboardingNext)}`,
      },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <AuthFormShell
      title="Claim Your Ledger"
      subtitle="Pick a username. Keep your sins. Customization comes later."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Button type="button" accent="wine" onClick={handleGoogle}>
          Continue with Google
        </Button>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            accent="wine"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="petty_saint"
            required
            autoComplete="username"
          />
          <p className="mt-1 text-xs text-ink-soft">3–20 chars, lowercase, numbers, underscores</p>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            accent="wine"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            accent="wine"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-sm text-ember">{error}</p>}
        {success && <p className="text-sm text-wine">{success}</p>}
        <Button type="submit" variant="ghost" accent="wine" disabled={loading || !!success}>
          {loading ? "Creating ledger..." : "Claim with email"}
        </Button>
        <p className="text-center text-sm text-ink-soft">
          Already damned?{" "}
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="text-wine hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthFormShell>
  );
}

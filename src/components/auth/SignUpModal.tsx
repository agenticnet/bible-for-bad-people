"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProfile } from "@/lib/auth/actions";
import { draftToPreferences, loadOnboardingDraft, clearOnboardingDraft } from "@/lib/auth/onboardingDraft";
import { suggestUsername } from "@/lib/auth/smartDefaults";
import { postSignupRedirectPath } from "@/lib/auth/redirect";
import { getLossCopy, getSignUpModalTitle, type LossContext } from "@/lib/auth/upsellCopy";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button, Input, Label, Modal } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
  context?: LossContext;
  nextPath?: string;
}

export default function SignUpModal({
  open,
  onClose,
  context = "generic",
  nextPath = "/",
}: SignUpModalProps) {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const draft = loadOnboardingDraft();
  const redirectPath = postSignupRedirectPath(nextPath);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(draft.username || suggestUsername());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lossCopy = getLossCopy(context);
  const title = getSignUpModalTitle(context);

  async function finishSignup(normalizedUsername: string) {
    const preferences = draftToPreferences(loadOnboardingDraft());
    const profileResult = await createProfile(normalizedUsername, preferences);
    if (profileResult.error) {
      setError(profileResult.error);
      setLoading(false);
      return;
    }

    clearOnboardingDraft();
    await refreshProfile();
    setLoading(false);
    onClose();
    router.push(redirectPath);
    router.refresh();
  }

  async function handleEmailSubmit(e: React.FormEvent) {
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
      options: { data: { pending_username: normalized } },
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
      setSuccess("Account created. Confirm your email, then log in.");
      setLoading(false);
      return;
    }

    await finishSignup(normalized);
  }

  async function handleGoogle() {
    setError(null);
    const supabase = createClient();
    const normalized = normalizeUsername(username);
    if (isValidUsername(normalized)) {
      localStorage.setItem(
        "bfb-onboarding-draft",
        JSON.stringify({ ...loadOnboardingDraft(), username: normalized })
      );
    }
    const origin = window.location.origin;
    const onboardingNext = `/onboarding?step=claim&next=${encodeURIComponent(redirectPath)}`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(onboardingNext)}`,
      },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <Modal open={open} onClose={onClose} accent="wine" closeDisabled={loading}>
      <p className="verse-ref mb-2 text-wine">Claim Your Ledger</p>
      <h3 className="mb-2 text-lg font-bold text-ink">{title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-ink-soft">{lossCopy}</p>

      {!showEmailForm ? (
        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="modal-username">Username</Label>
            <Input
              id="modal-username"
              accent="wine"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="petty_saint"
              autoComplete="username"
            />
          </div>
          <Button type="button" accent="wine" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="ghost"
            accent="wine"
            onClick={() => setShowEmailForm(true)}
          >
            Use email instead
          </Button>
          <p className="text-center text-sm text-ink-soft">
            Already damned?{" "}
            <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="text-wine hover:underline">
              Log in
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
          <div>
            <Label htmlFor="modal-username-email">Username</Label>
            <Input
              id="modal-username-email"
              accent="wine"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <Label htmlFor="modal-email">Email</Label>
            <Input
              id="modal-email"
              type="email"
              accent="wine"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="modal-password">Password</Label>
            <Input
              id="modal-password"
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
          {success && <p className={cn("text-sm", accentStyles.wine.text)}>{success}</p>}
          <Button type="submit" accent="wine" disabled={loading || !!success}>
            {loading ? "Creating ledger..." : "Claim Your Ledger"}
          </Button>
          <Button type="button" variant="ghost" accent="wine" onClick={() => setShowEmailForm(false)}>
            Back
          </Button>
        </form>
      )}
    </Modal>
  );
}

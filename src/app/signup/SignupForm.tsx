"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProfile } from "@/lib/auth/actions";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";
import AuthFormShell from "@/components/auth/AuthFormShell";
import { Button, Input, Label } from "@/components/ui";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeRedirectPath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    const profileResult = await createProfile(normalized);
    if (profileResult.error) {
      setError(profileResult.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push(next);
    router.refresh();
  }

  async function handleGoogle() {
    setError(null);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <AuthFormShell
      title="Sign Up"
      subtitle="Pick a username. The confessional will know you as u/you."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <Button type="submit" accent="wine" disabled={loading || !!success}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
        <Button type="button" variant="ghost" accent="wine" onClick={handleGoogle}>
          Continue with Google
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

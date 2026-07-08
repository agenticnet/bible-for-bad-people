"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ensureProfileFromMetadata } from "@/lib/auth/actions";
import { safeRedirectPath } from "@/lib/auth/redirect";
import AuthFormShell from "@/components/auth/AuthFormShell";
import { Button, Input, Label } from "@/components/ui";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeRedirectPath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const userId = signInData.user?.id;
    if (userId) {
      await ensureProfileFromMetadata();
    }

    const { data: profile } = userId
      ? await supabase.from("profiles").select("username").eq("id", userId).maybeSingle()
      : { data: null };

    setLoading(false);

    if (!profile) {
      router.push(`/onboarding?step=claim&next=${encodeURIComponent(next)}`);
      return;
    }

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
      title="Log In"
      subtitle="Salvation optional. Account recommended for sync."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Button type="button" accent="wine" onClick={handleGoogle}>
          Continue with Google
        </Button>
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
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-ember">{error}</p>}
        <Button type="submit" variant="ghost" accent="wine" disabled={loading}>
          {loading ? "Signing in..." : "Log in with email"}
        </Button>
        <p className="text-center text-sm text-ink-soft">
          No account?{" "}
          <Link
            href={`/signup?next=${encodeURIComponent(next)}`}
            className="text-wine hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthFormShell>
  );
}

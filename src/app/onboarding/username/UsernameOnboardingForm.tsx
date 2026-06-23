"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createProfile, checkUsernameAvailable } from "@/lib/auth/actions";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";
import AuthFormShell from "@/components/auth/AuthFormShell";
import { Button, Input, Label } from "@/components/ui";

export default function UsernameOnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalized = normalizeUsername(username);
    if (!isValidUsername(normalized)) {
      setError("Username must be 3–20 characters: lowercase letters, numbers, underscores.");
      return;
    }

    setLoading(true);
    const available = await checkUsernameAvailable(normalized);
    if (!available) {
      setError("Username is already taken.");
      setLoading(false);
      return;
    }

    const result = await createProfile(normalized);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <AuthFormShell
      title="Choose a Username"
      subtitle="Reddit-style identity. No take-backsies (probably)."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            accent="wine"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_name"
            required
          />
        </div>
        {error && <p className="text-sm text-ember">{error}</p>}
        <Button type="submit" accent="wine" disabled={loading}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </form>
    </AuthFormShell>
  );
}

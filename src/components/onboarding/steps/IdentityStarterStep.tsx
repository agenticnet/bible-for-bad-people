"use client";

import { useState } from "react";
import { checkUsernameAvailable } from "@/lib/auth/actions";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { Input, Label, SectionHeader } from "@/components/ui";

export default function IdentityStarterStep() {
  const { draft, updateDraft } = useOnboardingDraft();
  const [usernameError, setUsernameError] = useState<string | null>(null);

  async function validateUsername(value: string) {
    const normalized = normalizeUsername(value);
    if (!isValidUsername(normalized)) {
      setUsernameError("3–20 chars, lowercase, numbers, underscores.");
      return;
    }
    const available = await checkUsernameAvailable(normalized);
    setUsernameError(available ? null : "Username is already taken.");
  }

  return (
    <div className="space-y-8">
      <div>
        <SectionHeader
          kicker="Step 1"
          title="Salvation Display Name"
          description="How you appear on the leaderboard. Separate from your username."
          accent="wine"
        />
        <Label htmlFor="display-name">Display name</Label>
        <Input
          id="display-name"
          accent="wine"
          value={draft.displayName}
          onChange={(e) => updateDraft({ displayName: e.target.value })}
          placeholder="KarenWhoReturnsCarts"
          maxLength={40}
        />
      </div>

      <div>
        <SectionHeader
          kicker="Step 2"
          title="Ledger Username"
          description="Reddit-style identity. u/you in the confessional."
          accent="wine"
        />
        <Label htmlFor="onboarding-username">Username</Label>
        <Input
          id="onboarding-username"
          accent="wine"
          value={draft.username}
          onChange={(e) => {
            updateDraft({ username: e.target.value });
            void validateUsername(e.target.value);
          }}
          placeholder="petty_saint"
        />
        {usernameError && <p className="mt-1 text-sm text-ember">{usernameError}</p>}
      </div>
    </div>
  );
}

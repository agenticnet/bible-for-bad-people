"use client";

import { useCallback, useEffect, useState } from "react";
import { checkUsernameAvailable } from "@/lib/auth/actions";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { Input, Label, SectionHeader } from "@/components/ui";

interface IdentityStarterStepProps {
  onValidityChange?: (valid: boolean) => void;
}

export default function IdentityStarterStep({ onValidityChange }: IdentityStarterStepProps) {
  const { draft, updateDraft } = useOnboardingDraft();
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const validateUsername = useCallback(
    async (value: string): Promise<boolean> => {
      const normalized = normalizeUsername(value);
      if (!isValidUsername(normalized)) {
        setUsernameError("3–20 chars, lowercase, numbers, underscores.");
        onValidityChange?.(false);
        return false;
      }
      const available = await checkUsernameAvailable(normalized);
      if (!available) {
        setUsernameError("Username is already taken.");
        onValidityChange?.(false);
        return false;
      }
      setUsernameError(null);
      onValidityChange?.(true);
      return true;
    },
    [onValidityChange]
  );

  useEffect(() => {
    void validateUsername(draft.username);
  }, [draft.username, validateUsername]);

  return (
    <div>
      <SectionHeader
        kicker="Step 1"
        title="Choose your username"
        description="How you appear on the leaderboard and in the confessional."
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
  );
}

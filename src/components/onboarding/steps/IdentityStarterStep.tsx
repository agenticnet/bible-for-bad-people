"use client";

import { useState } from "react";
import { INDULGENCE_PRODUCTS } from "@/lib/indulgenceProducts";
import { STARTER_PACK_OPTIONS } from "@/lib/auth/smartDefaults";
import { checkUsernameAvailable } from "@/lib/auth/actions";
import { isValidUsername, normalizeUsername } from "@/lib/auth/types";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { Badge, Input, Label, SectionHeader } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/indulgenceProducts";

const starterProducts = INDULGENCE_PRODUCTS.filter((p) =>
  (STARTER_PACK_OPTIONS as readonly string[]).includes(p.id)
);

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
          kicker="Step 3a"
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
          kicker="Step 3b"
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

      <div>
        <SectionHeader
          kicker="Step 3c"
          title="Starter Pack"
          description="Pre-selected for new sinners. Change if you're feeling ambitious."
          accent="wine"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {starterProducts.map((product) => {
            const selected = draft.starterPackId === product.id;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => updateDraft({ starterPackId: product.id })}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  selected
                    ? cn(accentStyles.wine.borderMuted, accentStyles.wine.bgMuted)
                    : "border-rule bg-page hover:border-wine/30"
                )}
              >
                <span className="mb-2 block text-2xl">{product.icon}</span>
                <p className="mb-1 text-sm font-semibold text-ink">{product.name}</p>
                <p className="mb-2 text-xs text-ink-soft">{product.tagline}</p>
                <Badge tone="wine" size="sm">
                  {formatPrice(product.price, product.priceLabel)}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

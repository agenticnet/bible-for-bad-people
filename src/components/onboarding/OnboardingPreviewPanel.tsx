"use client";

import { chambers } from "@/lib/chambers";
import { INDULGENCE_PRODUCTS } from "@/lib/indulgenceProducts";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { MetricCard, Surface } from "@/components/ui";
import { accentStyles, type Accent } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

const ACCENT_LABELS: Record<Accent, string> = {
  wine: "Wine",
  plum: "Plum",
  slate: "Slate",
  terra: "Terra",
  ember: "Ember",
};

export default function OnboardingPreviewPanel() {
  const { draft } = useOnboardingDraft();

  const orderedChambers = draft.chamberOrder
    .map((id) => chambers.find((c) => c.id === id))
    .filter(Boolean);

  const favorites = orderedChambers.filter((c) =>
    draft.favoriteChambers.includes(c!.id)
  );

  const starterPack = INDULGENCE_PRODUCTS.find((p) => p.id === draft.starterPackId);

  return (
    <aside className="lg:sticky lg:top-8">
      <Surface accent="wine" accentTint padding="lg">
        <p className="verse-ref mb-4 text-wine">Live Preview</p>
        <h3 className="mb-4 font-serif text-lg text-ink">Your Ledger</h3>

        <div className="mb-4 grid gap-3">
          <MetricCard
            accent="wine"
            accentTint
            label="Salvation Score"
            value={
              <>
                {starterPack?.leaderboardBoost ? 50 + starterPack.leaderboardBoost : 50}
                <span className="text-sm text-ink-soft">/99</span>
              </>
            }
            hint="Estimated from starter pack"
          />
        </div>

        <div className="mb-4">
          <p className="verse-ref mb-2 text-ink-soft">Display name</p>
          <p className="text-sm font-medium text-ink">
            {draft.displayName.trim() || "Anonymous Sinner"}
          </p>
        </div>

        <div className="mb-4">
          <p className="verse-ref mb-2 text-ink-soft">Accent</p>
          <span
            className={cn(
              "inline-block rounded-sm px-2 py-1 text-xs font-medium",
              accentStyles[draft.defaultAccent].bgMuted,
              accentStyles[draft.defaultAccent].text
            )}
          >
            {ACCENT_LABELS[draft.defaultAccent]}
          </span>
        </div>

        <div className="mb-4">
          <p className="verse-ref mb-2 text-ink-soft">Favorite chambers</p>
          <ul className="space-y-1">
            {favorites.length === 0 ? (
              <li className="text-sm text-ink-soft">None selected yet</li>
            ) : (
              favorites.slice(0, 5).map((chamber) => (
                <li key={chamber!.id} className="text-sm text-ink">
                  {chamber!.title}
                </li>
              ))
            )}
          </ul>
        </div>

        {starterPack && (
          <div>
            <p className="verse-ref mb-2 text-ink-soft">Starter pack</p>
            <p className="text-sm text-ink">
              {starterPack.icon} {starterPack.name}
            </p>
          </div>
        )}
      </Surface>
    </aside>
  );
}

"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { chambers } from "@/lib/chambers";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { OptionTile, SectionHeader } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

export default function ChamberPickerStep() {
  const { draft, updateDraft } = useOnboardingDraft();

  const liveChambers = chambers.filter((c) => c.status === "live");

  function toggleFavorite(id: string) {
    const current = draft.favoriteChambers;
    const next = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    updateDraft({ favoriteChambers: next });
  }

  function moveChamber(id: string, direction: -1 | 1) {
    const order = [...draft.chamberOrder];
    const index = order.indexOf(id);
    if (index < 0) return;
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= order.length) return;
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    updateDraft({ chamberOrder: order });
  }

  return (
    <div>
      <SectionHeader
        kicker="Step 2a"
        title="Pin Your Chambers"
        description="Most sinners start here. Pick favorites and drag order on your home grid."
        accent="wine"
      />

      <p className="mb-4 text-sm text-ink-soft">
        Tap to favorite. Use arrows to reorder your dashboard.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {liveChambers.map((chamber) => {
          const selected = draft.favoriteChambers.includes(chamber.id);
          const orderIndex = draft.chamberOrder.indexOf(chamber.id);
          const Icon = chamber.icon;

          return (
            <div key={chamber.id} className="flex items-stretch gap-1">
              <OptionTile
                selected={selected}
                accent={chamber.accent}
                layout="row"
                className="flex-1"
                onClick={() => toggleFavorite(chamber.id)}
              >
                <Icon className={cn("h-4 w-4 shrink-0", accentStyles[chamber.accent].text)} />
                <span className="text-xs font-medium">{chamber.title}</span>
              </OptionTile>
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveChamber(chamber.id, -1)}
                  disabled={orderIndex <= 0}
                  className="rounded border border-rule p-1 text-ink-soft hover:text-ink disabled:opacity-30"
                  aria-label={`Move ${chamber.title} up`}
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveChamber(chamber.id, 1)}
                  disabled={orderIndex >= draft.chamberOrder.length - 1}
                  className="rounded border border-rule p-1 text-ink-soft hover:text-ink disabled:opacity-30"
                  aria-label={`Move ${chamber.title} down`}
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

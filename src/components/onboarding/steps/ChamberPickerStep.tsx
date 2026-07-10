"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { chambers } from "@/lib/chambers";
import { DEFAULT_FAVORITE_CHAMBERS } from "@/lib/auth/smartDefaults";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { Disclosure, OptionTile, SectionHeader } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { MAX_PRIMARY_OPTIONS } from "@/lib/ux/constraints";
import { cn } from "@/lib/utils";

const SUGGESTED_CHAMBER_IDS = [
  ...DEFAULT_FAVORITE_CHAMBERS,
  "modern-indulgences",
].slice(0, MAX_PRIMARY_OPTIONS);

export interface ChamberPickerValues {
  favoriteChambers: string[];
  chamberOrder: string[];
}

interface ChamberPickerStepProps {
  mode?: "draft" | "profile";
  value?: ChamberPickerValues;
  onChange?: (updates: Partial<ChamberPickerValues>) => void;
  kicker?: string;
}

export default function ChamberPickerStep({
  mode = "draft",
  value,
  onChange,
  kicker = "Step 1",
}: ChamberPickerStepProps) {
  const { draft, updateDraft } = useOnboardingDraft();

  const favoriteChambers =
    mode === "profile" ? (value?.favoriteChambers ?? []) : draft.favoriteChambers;
  const chamberOrder =
    mode === "profile" ? (value?.chamberOrder ?? []) : draft.chamberOrder;

  function applyUpdate(updates: Partial<ChamberPickerValues>) {
    if (mode === "profile") {
      onChange?.(updates);
    } else {
      updateDraft(updates);
    }
  }

  const liveChambers = chambers.filter((c) => c.status === "live");
  const suggestedChambers = liveChambers.filter((c) =>
    SUGGESTED_CHAMBER_IDS.includes(c.id)
  );
  const otherChambers = liveChambers.filter(
    (c) => !SUGGESTED_CHAMBER_IDS.includes(c.id)
  );

  function toggleFavorite(id: string) {
    const current = favoriteChambers;
    const next = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    applyUpdate({ favoriteChambers: next });
  }

  function moveChamber(id: string, direction: -1 | 1) {
    const order = [...chamberOrder];
    const index = order.indexOf(id);
    if (index < 0) return;
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= order.length) return;
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    applyUpdate({ chamberOrder: order });
  }

  function renderChamberTile(chamber: (typeof liveChambers)[number]) {
    const selected = favoriteChambers.includes(chamber.id);
    const orderIndex = chamberOrder.indexOf(chamber.id);
    const Icon = chamber.icon;

    return (
      <div key={chamber.id} className="flex min-w-0 items-stretch gap-1">
        <OptionTile
          selected={selected}
          accent={chamber.accent}
          layout="row"
          className="min-w-0 flex-1"
          onClick={() => toggleFavorite(chamber.id)}
        >
          <Icon className={cn("h-4 w-4 shrink-0", accentStyles[chamber.accent].text)} />
          <span className="min-w-0 truncate text-xs font-medium">{chamber.title}</span>
        </OptionTile>
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => moveChamber(chamber.id, -1)}
            disabled={orderIndex <= 0}
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded border border-rule text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine/40 disabled:opacity-30"
            aria-label={`Move ${chamber.title} up`}
          >
            <ChevronUp className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => moveChamber(chamber.id, 1)}
            disabled={orderIndex >= chamberOrder.length - 1}
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded border border-rule text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine/40 disabled:opacity-30"
            aria-label={`Move ${chamber.title} down`}
          >
            <ChevronDown className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        kicker={kicker}
        title="Pin Your Chambers"
        description="Pick favorites and reorder your home grid."
        accent="wine"
      />

      <p className="mb-4 text-sm text-ink-soft">
        Tap to favorite. Use arrows to reorder your dashboard.
      </p>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        {suggestedChambers.map(renderChamberTile)}
      </div>

      {otherChambers.length > 0 && (
        <Disclosure
          label="All chambers"
          summary={`${otherChambers.length} more chambers available`}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {otherChambers.map(renderChamberTile)}
          </div>
        </Disclosure>
      )}
    </div>
  );
}

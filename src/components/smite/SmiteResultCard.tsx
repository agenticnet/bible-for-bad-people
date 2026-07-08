import type { SmiteRecord } from "@/lib/smiteTypes";
import { PLAGUE_ICONS, PLAGUE_LABELS, TARGET_ICONS } from "@/lib/smiteTypes";
import { Badge, Callout, Surface } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface SmiteResultCardProps {
  record: SmiteRecord;
}

export default function SmiteResultCard({ record }: SmiteResultCardProps) {
  return (
    <Surface as="article" accent="ember" accentTint>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={cn("mono-contain font-mono text-xs", accentStyles.ember.text)}>
          {record.id}
        </span>
        {record.tier === "premium" && (
          <Badge tone="wine" size="sm">
            Premium Visual
          </Badge>
        )}
        <span className="verse-ref text-ink-soft">
          {new Date(record.smoteAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="text-2xl">{TARGET_ICONS[record.target]}</span>
        <span className="text-ink-soft">→</span>
        <span className="text-2xl">{PLAGUE_ICONS[record.plague]}</span>
        <span className="text-contain min-w-0 text-sm text-ink">
          {record.targetLabel} · {PLAGUE_LABELS[record.plague]}
        </span>
      </div>

      <p className="scripture-block mb-3 text-sm italic text-ink-soft">
        {record.result}
      </p>

      {record.visualDescription && (
        <Callout tone="wine" className="p-3">
          <p className={cn("verse-ref mb-1", accentStyles.wine.text)}>
            Premium AI Visual (Mock)
          </p>
          <p className="text-xs leading-relaxed text-ink-soft">
            {record.visualDescription}
          </p>
        </Callout>
      )}
    </Surface>
  );
}

import type { SmiteRecord } from "@/lib/smiteTypes";
import { PLAGUE_ICONS, PLAGUE_LABELS, TARGET_ICONS } from "@/lib/smiteTypes";

interface SmiteResultCardProps {
  record: SmiteRecord;
}

export default function SmiteResultCard({ record }: SmiteResultCardProps) {
  return (
    <article className="rounded-xl border border-neon-red/30 bg-neon-red/5 p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-neon-red">{record.id}</span>
        {record.tier === "premium" && (
          <span className="rounded-full border border-neon-gold/40 bg-neon-gold/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-neon-gold">
            Premium Visual
          </span>
        )}
        <span className="text-[10px] text-muted/60">
          {new Date(record.smoteAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <span className="text-2xl">{TARGET_ICONS[record.target]}</span>
        <span className="text-muted">→</span>
        <span className="text-2xl">{PLAGUE_ICONS[record.plague]}</span>
        <span className="text-sm text-bone">
          {record.targetLabel} · {PLAGUE_LABELS[record.plague]}
        </span>
      </div>

      <p
        className="mb-3 text-sm leading-relaxed text-bone/90 italic"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {record.result}
      </p>

      {record.visualDescription && (
        <div className="rounded-lg border border-neon-gold/25 bg-neon-gold/5 p-3">
          <p className="mb-1 text-[10px] uppercase tracking-wider text-neon-gold">
            Premium AI Visual (Mock)
          </p>
          <p className="text-xs leading-relaxed text-muted">
            {record.visualDescription}
          </p>
        </div>
      )}
    </article>
  );
}

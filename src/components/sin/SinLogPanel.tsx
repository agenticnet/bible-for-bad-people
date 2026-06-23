"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import type { SinLogItem } from "@/lib/sinTypes";
import { loadSinLog, saveSinLog } from "@/lib/sinStorage";

export default function SinLogPanel() {
  const [log, setLog] = useState<SinLogItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLog(loadSinLog());
  }, []);

  function refresh() {
    setLog(loadSinLog());
  }

  // Expose refresh via custom event from parent
  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("sin-log-updated", handler);
    return () => window.removeEventListener("sin-log-updated", handler);
  }, []);

  function clearLog() {
    saveSinLog([]);
    setLog([]);
  }

  if (!mounted) return null;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-neon-pink">
            Confession Record
          </p>
          <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-display)" }}>
            My Sin Log
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Every petty sin you&apos;ve checked off, translated, or confessed — stored locally
            on thy device.
          </p>
        </div>
        {log.length > 0 && (
          <button
            type="button"
            onClick={clearLog}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-rule px-3 py-1.5 text-xs text-ink-soft hover:border-neon-red/40 hover:text-neon-red"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      {log.length === 0 ? (
        <div className="rounded-xl border border-dashed border-rule bg-page/80 px-6 py-16 text-center">
          <p className="text-ink-soft">No sins logged yet.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Complete today&apos;s checklist or translate a custom sin to start your record.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {log.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-rule bg-page p-4"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-neon-pink/30 bg-neon-pink/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-neon-pink">
                  {item.source}
                </span>
                <span className="text-[10px] text-ink-soft">
                  {new Date(item.completedAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="mb-2 text-sm font-medium text-ink">{item.petty}</p>
              <p
                className="text-xs italic leading-relaxed text-ink-soft"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.translation}
              </p>
            </article>
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-ink-soft">
        {log.length} sin{log.length !== 1 ? "s" : ""} on record. Absolution sold separately.
      </p>
    </div>
  );
}

export function notifySinLogUpdate() {
  window.dispatchEvent(new Event("sin-log-updated"));
}

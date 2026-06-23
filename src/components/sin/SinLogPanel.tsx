"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import type { SinLogItem } from "@/lib/sinTypes";
import { fetchSinLog, clearSinLog } from "@/lib/data/sin";
import {
  Badge,
  Button,
  EmptyState,
  SectionHeader,
  Surface,
} from "@/components/ui";

export default function SinLogPanel() {
  const [log, setLog] = useState<SinLogItem[]>([]);
  const [mounted, setMounted] = useState(false);

  async function refresh() {
    const items = await fetchSinLog();
    setLog(items);
  }

  useEffect(() => {
    setMounted(true);
    void refresh();
  }, []);

  useEffect(() => {
    const handler = () => void refresh();
    window.addEventListener("sin-log-updated", handler);
    return () => window.removeEventListener("sin-log-updated", handler);
  }, []);

  async function handleClearLog() {
    await clearSinLog();
    setLog([]);
  }

  if (!mounted) return null;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <SectionHeader
          kicker="Confession Record"
          title="My Sin Log"
          description="Every petty sin you've checked off, translated, or confessed — synced to your account."
          accent="terra"
        />
        {log.length > 0 && (
          <Button variant="ghost" accent="ember" size="sm" onClick={() => void handleClearLog()}>
            <Trash2 className="h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
      </div>

      {log.length === 0 ? (
        <EmptyState
          title="No sins logged yet."
          description="Complete today's checklist or translate a custom sin to start your record."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {log.map((item) => (
            <Surface key={item.id} as="article" padding="sm">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone="terra" size="sm">
                  {item.source}
                </Badge>
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
              <p className="scripture-block text-xs italic text-ink-soft">
                {item.translation}
              </p>
            </Surface>
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

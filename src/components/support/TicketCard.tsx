"use client";

import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";
import type { PrayerTicket } from "@/lib/supportTypes";
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@/lib/supportTypes";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  ticket: PrayerTicket;
}

const STATUS_STYLES = {
  processing: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  queued: "border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan",
  resolved: "border-green-500/30 bg-green-500/10 text-green-400",
};

const PRIORITY_STYLES = {
  low: "text-ink-soft",
  medium: "text-neon-gold",
  high: "text-orange-400",
  urgent: "text-neon-red",
};

export default function TicketCard({ ticket }: TicketCardProps) {
  const [expanded, setExpanded] = useState(ticket.status === "resolved");

  return (
    <div className="rounded-xl border border-rule bg-page overflow-hidden transition-all hover:border-rule">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-neon-cyan">
              {ticket.ticketNumber}
            </span>
            <span
              className={cn( "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider", STATUS_STYLES[ticket.status] )}
            >
              {ticket.status === "processing" && (
                <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
              )}
              {STATUS_LABELS[ticket.status]}
            </span>
            <span className="rounded-full border border-rule bg-smoke px-2 py-0.5 text-[10px] text-ink-soft">
              {CATEGORY_LABELS[ticket.category]}
            </span>
          </div>
          <h3 className="truncate font-semibold text-ink">{ticket.subject}</h3>
          <p className="mt-1 text-xs text-ink-soft">
            Submitted{" "}
            {ticket.submittedAt.toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" · "}
            <span className={PRIORITY_STYLES[ticket.priority]}>
              {PRIORITY_LABELS[ticket.priority].split(" — ")[0]}
            </span>
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-ink-soft" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-ink-soft" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-rule px-5 pb-5">
          <div className="mt-4">
            <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-soft">
              Your Request
            </p>
            <p className="text-sm leading-relaxed text-ink-soft">
              {ticket.description}
            </p>
          </div>

          {ticket.status === "processing" && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
              <p className="text-sm text-yellow-400">
                Routing to Heavenly Administration...
              </p>
            </div>
          )}

          {ticket.status === "queued" && (
            <div className="mt-4 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 px-4 py-3">
              <p className="text-sm text-neon-cyan">
                Your ticket is in the Divine Queue. Position:{" "}
                {ticket.ticketNumber.replace(/\D/g, "").slice(0, 6) || "847291"}.
                Estimated wait: 400 years.
              </p>
            </div>
          )}

          {ticket.response && (
            <div className="mt-4 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-4">
              <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-neon-cyan">
                <span>Response from Heavenly Administration</span>
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                {ticket.response}
              </p>
              {ticket.resolvedAt && (
                <p className="mt-3 text-[10px] text-ink-soft">
                  Resolved{" "}
                  {ticket.resolvedAt.toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" · "}
                  Do not reply to this message. GOD does not read follow-ups.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

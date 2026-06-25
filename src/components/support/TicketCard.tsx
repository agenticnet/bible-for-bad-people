"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import type { PrayerTicket } from "@/lib/supportTypes";
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@/lib/supportTypes";
import { Badge, Callout, Surface } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  ticket: PrayerTicket;
}

const STATUS_TONES = {
  processing: "warning",
  queued: "slate",
  resolved: "success",
} as const;

const PRIORITY_TEXT = {
  low: "text-ink-soft",
  medium: "text-wine",
  high: "text-orange-400",
  urgent: "text-ember",
};

export default function TicketCard({ ticket }: TicketCardProps) {
  const [expanded, setExpanded] = useState(ticket.status === "resolved");

  return (
    <Surface padding="none" hover className="overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-slate">{ticket.ticketNumber}</span>
            <Badge tone={STATUS_TONES[ticket.status]}>
              {ticket.status === "processing" && (
                <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
              )}
              {STATUS_LABELS[ticket.status]}
            </Badge>
            <Badge tone="active">{CATEGORY_LABELS[ticket.category]}</Badge>
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
            <span className={PRIORITY_TEXT[ticket.priority]}>
              {PRIORITY_LABELS[ticket.priority].split(" — ")[0]}
            </span>
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 text-ink-soft transition-transform duration-200 motion-reduce:transition-none",
            expanded && "rotate-180"
          )}
        >
          <ChevronDown className="h-5 w-5" />
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-rule px-5 pb-5">
            <div className="mt-4">
              <p className="verse-ref mb-1 text-ink-soft">Your Request</p>
              <p className="text-sm leading-relaxed text-ink-soft">
                {ticket.description}
              </p>
            </div>

            {ticket.status === "processing" && (
              <Callout tone="warning" className="mt-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Routing to Heavenly Administration...
              </Callout>
            )}

            {ticket.status === "queued" && (
              <Callout tone="slate" className="mt-4">
                Your ticket is in the Divine Queue. Position:{" "}
                {ticket.ticketNumber.replace(/\D/g, "").slice(0, 6) || "847291"}.
                Estimated wait: 400 years.
              </Callout>
            )}

            {ticket.response && (
              <Callout tone="slate" className="mt-4 p-4">
                <p className={cn("verse-ref mb-2", accentStyles.slate.text)}>
                  Response from Heavenly Administration
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                  {ticket.response}
                </p>
                {ticket.resolvedAt && (
                  <p className="verse-ref mt-3 text-ink-soft">
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
              </Callout>
            )}
          </div>
        </div>
      </div>
    </Surface>
  );
}

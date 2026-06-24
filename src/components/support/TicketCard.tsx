"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { PrayerTicket } from "@/lib/supportTypes";
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@/lib/supportTypes";
import { Badge, Callout, Surface } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeIn, resolveTransition, transition } from "@/lib/motion";

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
  const reducedMotion = useReducedMotion();
  const expandT = resolveTransition(transition.base, reducedMotion);
  const badgeT = resolveTransition(transition.fast, reducedMotion);

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
            <AnimatePresence mode="wait">
              <motion.span
                key={ticket.status}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeIn}
                transition={badgeT}
              >
                <Badge tone={STATUS_TONES[ticket.status]}>
                  {ticket.status === "processing" && (
                    <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
                  )}
                  {STATUS_LABELS[ticket.status]}
                </Badge>
              </motion.span>
            </AnimatePresence>
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
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={expandT}
          className="shrink-0 text-ink-soft"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={expandT}
            className="overflow-hidden"
          >
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
                </Callout>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Surface>
  );
}

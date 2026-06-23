"use client";

import { useState } from "react";
import { Clock, Sparkles, Ticket, Users } from "lucide-react";
import TicketForm from "./TicketForm";
import TicketCard from "./TicketCard";
import type { PrayerTicket } from "@/lib/supportTypes";
import {
  generateTicketNumber,
  getMockSupportResponse,
} from "@/lib/mockSupportResponses";
import {
  ChamberHeader,
  EmptyState,
  PageShell,
  StatTile,
  Surface,
} from "@/components/ui";

export default function SupportDesk() {
  const [tickets, setTickets] = useState<PrayerTicket[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(data: {
    subject: string;
    category: PrayerTicket["category"];
    priority: PrayerTicket["priority"];
    description: string;
  }) {
    if (isSubmitting) return;

    const ticketNumber = generateTicketNumber();
    const id = `ticket-${Date.now()}`;

    const newTicket: PrayerTicket = {
      id,
      ticketNumber,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      description: data.description,
      status: "processing",
      submittedAt: new Date(),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setIsSubmitting(true);

    setTimeout(() => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "queued" as const } : t
        )
      );
    }, 800);

    setTimeout(() => {
      const response = getMockSupportResponse(
        data.category,
        data.priority,
        ticketNumber,
        data.subject
      );

      setTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: "resolved" as const,
                response,
                resolvedAt: new Date(),
              }
            : t
        )
      );
      setIsSubmitting(false);
    }, 2500);
  }

  const openCount = tickets.filter((t) => t.status !== "resolved").length;

  return (
    <PageShell maxWidth="lg">
      <ChamberHeader
        icon={Ticket}
        accent="slate"
        title="The Divine Support Desk"
        subtitle="Heavenly Administration — Prayer Ticket System v4.0.0"
        badge="Visions Approximate"
      >
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile icon={Clock} label="Queue Time" value="400 yrs" accent="slate" />
          <StatTile icon={Ticket} label="Your Open Tickets" value={String(openCount)} accent="wine" />
          <StatTile icon={Users} label="Agents Online" value="0" accent="plum" />
          <StatTile icon={Sparkles} label="Satisfaction Rate" value="12%" accent="terra" />
        </div>
      </ChamberHeader>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Surface className="sticky top-4" padding="lg">
            <h2 className="mb-1 text-lg font-semibold text-ink">Submit a Prayer Ticket</h2>
            <p className="mb-6 text-sm text-ink-soft">
              File your request with Heavenly Administration. Response times may
              vary by sin level and planetary alignment.
            </p>
            <TicketForm onSubmit={handleSubmit} disabled={isSubmitting} />
          </Surface>
        </div>

        <div className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold text-ink">
            Your Tickets
            {tickets.length > 0 && (
              <span className="ml-2 text-sm font-normal text-ink-soft">
                ({tickets.length})
              </span>
            )}
          </h2>

          {tickets.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No tickets yet."
              description="Submit a prayer request to get a corporate-style divine response."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

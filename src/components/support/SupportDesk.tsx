"use client";

import { useState, useEffect } from "react";
import { Clock, Sparkles, Ticket, Users } from "lucide-react";
import TicketForm from "./TicketForm";
import TicketCard from "./TicketCard";
import type { PrayerTicket } from "@/lib/supportTypes";
import {
  generateTicketNumber,
  getMockSupportResponse,
} from "@/lib/mockSupportResponses";
import { fetchSupportTickets, createSupportTicket, updateSupportTicket } from "@/lib/data/chat-support";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthGate from "@/components/auth/AuthGate";
import {
  ChamberHeader,
  EmptyState,
  PageShell,
  StatTile,
  Surface,
} from "@/components/ui";

export default function SupportDesk() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<PrayerTicket[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTickets([]);
      return;
    }
    void fetchSupportTickets().then(setTickets);
  }, [user]);

  function handleSubmit(data: {
    subject: string;
    category: PrayerTicket["category"];
    priority: PrayerTicket["priority"];
    description: string;
  }) {
    if (isSubmitting || !user) return;

    setSubmitError(null);
    const ticketNumber = generateTicketNumber();

    const newTicket: PrayerTicket = {
      id: `ticket-${Date.now()}`,
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

    void createSupportTicket({
      ticketNumber,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      description: data.description,
      status: "processing",
    }).then((result) => {
      if (result.error || !result.ticket) {
        setTickets((prev) => prev.filter((t) => t.ticketNumber !== ticketNumber));
        setSubmitError(result.error ?? "Could not file your ticket. Try again in a moment.");
        setIsSubmitting(false);
        return;
      }

      const saved = result.ticket;

      setTickets((prev) =>
        prev.map((t) => (t.ticketNumber === ticketNumber ? saved : t))
      );

      setTimeout(() => {
        void updateSupportTicket(saved.id, { status: "queued" }).then((queued) => {
          if (queued.ticket) {
            setTickets((prev) =>
              prev.map((t) => (t.id === saved.id ? queued.ticket! : t))
            );
          }
        });
      }, 800);

      setTimeout(() => {
        const response = getMockSupportResponse(
          data.category,
          data.priority,
          ticketNumber,
          data.subject
        );
        const resolvedAt = new Date();

        void updateSupportTicket(saved.id, {
          status: "resolved",
          response,
          resolvedAt,
        }).then((resolved) => {
          if (resolved.ticket) {
            setTickets((prev) =>
              prev.map((t) => (t.id === saved.id ? resolved.ticket! : t))
            );
          }
          setIsSubmitting(false);
        });
      }, 2500);
    });
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
          <AuthGate
            mode="block"
            tone="slate"
            lossContext="support"
            title="Sign in to file a ticket"
            description="Browse the support desk for free. Log in to submit prayer tickets and track responses."
            saveLabel="Sign in to submit"
          >
            <Surface className="sticky top-4" padding="lg">
              <h2 className="mb-1 text-lg font-semibold text-ink">Submit a Prayer Ticket</h2>
              <p className="mb-6 text-sm text-ink-soft">
                File your request with Heavenly Administration. Response times may
                vary by sin level and planetary alignment.
              </p>
              {submitError && (
                <p className="mb-4 text-sm text-ember" role="alert">
                  {submitError}
                </p>
              )}
              <TicketForm onSubmit={handleSubmit} disabled={isSubmitting} />
            </Surface>
          </AuthGate>
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
              description="Sign in and submit a prayer request to get a corporate-style divine response."
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

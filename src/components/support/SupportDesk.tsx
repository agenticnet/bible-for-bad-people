"use client";

import { useState } from "react";
import { ArrowLeft, Clock, Sparkles, Ticket, Users } from "lucide-react";
import Link from "next/link";
import TicketForm from "./TicketForm";
import TicketCard from "./TicketCard";
import type { PrayerTicket } from "@/lib/supportTypes";
import {
  generateTicketNumber,
  getMockSupportResponse,
} from "@/lib/mockSupportResponses";

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
    <div className="min-h-dvh bg-parchment">
      {/* Top bar */}
      <div className="border-b border-ivory/10 bg-binding px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm border border-ivory/15 px-3 py-1.5 text-sm text-binding-muted transition-colors hover:border-ivory/30 hover:text-binding-ivory"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-cyan/40 bg-neon-cyan/10">
              <Ticket className="h-6 w-6 text-neon-cyan" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-neon-cyan sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Divine Support Desk
              </h1>
              <p className="text-sm text-ink-soft">
                Heavenly Administration — Prayer Ticket System v4.0.0
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/5 px-3 py-1">
              <Sparkles className="h-3 w-3 text-neon-purple" />
              <span className="text-[10px] uppercase tracking-wider text-neon-purple">
                Visions Approximate
              </span>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={Clock}
              label="Queue Time"
              value="400 yrs"
              accent="cyan"
            />
            <StatCard
              icon={Ticket}
              label="Your Open Tickets"
              value={String(openCount)}
              accent="gold"
            />
            <StatCard
              icon={Users}
              label="Agents Online"
              value="0"
              accent="purple"
            />
            <StatCard
              icon={Sparkles}
              label="Satisfaction Rate"
              value="12%"
              accent="pink"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-4 rounded-xl border border-rule bg-page p-6">
              <h2 className="mb-1 text-lg font-semibold text-ink">
                Submit a Prayer Ticket
              </h2>
              <p className="mb-6 text-sm text-ink-soft">
                File your request with Heavenly Administration. Response times
                may vary by sin level and planetary alignment.
              </p>
              <TicketForm onSubmit={handleSubmit} disabled={isSubmitting} />
            </div>
          </div>

          {/* Ticket list */}
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
              <div className="rounded-xl border border-dashed border-rule bg-page/80 px-6 py-16 text-center">
                <Ticket className="mx-auto mb-4 h-10 w-10 text-ink-soft" />
                <p className="text-ink-soft">No tickets yet.</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Submit a prayer request to get a corporate-style divine
                  response.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: "cyan" | "gold" | "purple" | "pink";
}) {
  const colors = {
    cyan: "border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan",
    gold: "border-neon-gold/20 bg-neon-gold/5 text-neon-gold",
    purple: "border-neon-purple/20 bg-neon-purple/5 text-neon-purple",
    pink: "border-neon-pink/20 bg-neon-pink/5 text-neon-pink",
  };

  return (
    <div className={`rounded-lg border px-4 py-3 ${colors[accent]}`}>
      <div className="mb-1 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 opacity-70" />
        <span className="text-[10px] uppercase tracking-wider opacity-70">
          {label}
        </span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

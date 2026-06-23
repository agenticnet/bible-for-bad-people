"use server";

import { createClient } from "@/lib/supabase/server";
import type { Message } from "@/lib/chatTypes";
import type { PrayerTicket } from "@/lib/supportTypes";

type ChatChamber = "god" | "lucifer" | "support";

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function fetchChatMessages(chamber: ChatChamber): Promise<Message[]> {
  const userId = await requireUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", userId)
    .eq("chamber", chamber)
    .order("created_at", { ascending: true });

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    role: row.role as Message["role"],
    content: row.content,
    timestamp: new Date(row.created_at),
  }));
}

export async function saveChatMessage(
  chamber: ChatChamber,
  message: { role: string; content: string }
): Promise<{ id?: string; error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in to chat." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      user_id: userId,
      chamber,
      role: message.role,
      content: message.content,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: data.id };
}

export async function fetchSupportTickets(): Promise<PrayerTicket[]> {
  const userId = await requireUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    ticketNumber: row.ticket_number,
    subject: row.subject,
    category: row.category as PrayerTicket["category"],
    priority: row.priority as PrayerTicket["priority"],
    description: row.description,
    status: row.status as PrayerTicket["status"],
    response: row.response ?? undefined,
    submittedAt: new Date(row.submitted_at),
    resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined,
  }));
}

export async function createSupportTicket(
  ticket: Omit<PrayerTicket, "id" | "submittedAt" | "resolvedAt">
): Promise<{ ticket?: PrayerTicket; error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in to file a ticket." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: userId,
      ticket_number: ticket.ticketNumber,
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      description: ticket.description,
      status: ticket.status,
      response: ticket.response ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return { error: error?.message ?? "Failed to create ticket." };

  return { ticket: mapSupportTicketRow(data) };
}

function mapSupportTicketRow(row: {
  id: string;
  ticket_number: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  status: string;
  response: string | null;
  submitted_at: string;
  resolved_at: string | null;
}): PrayerTicket {
  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    subject: row.subject,
    category: row.category as PrayerTicket["category"],
    priority: row.priority as PrayerTicket["priority"],
    description: row.description,
    status: row.status as PrayerTicket["status"],
    response: row.response ?? undefined,
    submittedAt: new Date(row.submitted_at),
    resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined,
  };
}

export async function updateSupportTicket(
  ticketId: string,
  updates: {
    status?: PrayerTicket["status"];
    response?: string;
    resolvedAt?: Date;
  }
): Promise<{ ticket?: PrayerTicket; error?: string }> {
  const userId = await requireUserId();
  if (!userId) return { error: "Sign in to update tickets." };

  const supabase = await createClient();
  const payload: {
    status?: string;
    response?: string;
    resolved_at?: string | null;
  } = {};

  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.response !== undefined) payload.response = updates.response;
  if (updates.resolvedAt !== undefined) {
    payload.resolved_at = updates.resolvedAt.toISOString();
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .update(payload)
    .eq("id", ticketId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) return { error: error?.message ?? "Failed to update ticket." };

  return { ticket: mapSupportTicketRow(data) };
}

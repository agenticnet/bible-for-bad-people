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
      resolved_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error || !data) return { error: error?.message ?? "Failed to create ticket." };

  return {
    ticket: {
      id: data.id,
      ticketNumber: data.ticket_number,
      subject: data.subject,
      category: data.category as PrayerTicket["category"],
      priority: data.priority as PrayerTicket["priority"],
      description: data.description,
      status: data.status as PrayerTicket["status"],
      response: data.response ?? undefined,
      submittedAt: new Date(data.submitted_at),
      resolvedAt: data.resolved_at ? new Date(data.resolved_at) : undefined,
    },
  };
}

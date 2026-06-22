export type TicketCategory =
  | "smite-request"
  | "miracle-request"
  | "relationship"
  | "career"
  | "vengeance"
  | "general-grievance";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus = "processing" | "queued" | "resolved";

export interface PrayerTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  status: TicketStatus;
  response?: string;
  submittedAt: Date;
  resolvedAt?: Date;
}

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  "smite-request": "Smite Request",
  "miracle-request": "Miracle Request",
  relationship: "Relationship Drama",
  career: "Career Guidance",
  vengeance: "Righteous Vengeance",
  "general-grievance": "General Grievance",
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Low — God will get to it",
  medium: "Medium — Mildly concerning",
  high: "High — Sinfully urgent",
  urgent: "URGENT — Do not die on us",
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  processing: "Processing",
  queued: "In Divine Queue",
  resolved: "Resolved (Automated)",
};

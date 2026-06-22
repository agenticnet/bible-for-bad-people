"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import type { TicketCategory, TicketPriority } from "@/lib/supportTypes";
import { CATEGORY_LABELS, PRIORITY_LABELS } from "@/lib/supportTypes";

interface TicketFormProps {
  onSubmit: (data: {
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    description: string;
  }) => void;
  disabled?: boolean;
}

export default function TicketForm({ onSubmit, disabled }: TicketFormProps) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("general-grievance");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [description, setDescription] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || disabled) return;

    onSubmit({ subject, category, priority, description });
    setSubject("");
    setDescription("");
    setCategory("general-grievance");
    setPriority("medium");
  }

  const inputClass =
    "w-full rounded-lg border border-ash bg-abyss px-3 py-2.5 text-sm text-bone placeholder:text-muted/50 focus:border-neon-cyan/50 focus:outline-none focus:ring-1 focus:ring-neon-cyan/30 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Smite my landlord"
          disabled={disabled}
          className={inputClass}
          maxLength={120}
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as TicketCategory)}
          disabled={disabled}
          className={inputClass}
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TicketPriority)}
          disabled={disabled}
          className={inputClass}
        >
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
          Prayer Details
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your request in detail. The more dramatic, the better..."
          disabled={disabled}
          rows={5}
          className={`${inputClass} resize-none`}
          maxLength={1000}
        />
      </div>

      <button
        type="submit"
        disabled={!subject.trim() || !description.trim() || disabled}
        className="flex items-center justify-center gap-2 rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 px-4 py-3 text-sm font-semibold text-neon-cyan transition-all hover:border-neon-cyan hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send className="h-4 w-4" />
        {disabled ? "Processing..." : "Submit Ticket"}
      </button>
    </form>
  );
}

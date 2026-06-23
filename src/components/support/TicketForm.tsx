"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import type { TicketCategory, TicketPriority } from "@/lib/supportTypes";
import { CATEGORY_LABELS, PRIORITY_LABELS } from "@/lib/supportTypes";
import { Button, Input, Label, Select, Textarea } from "@/components/ui";

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          accent="slate"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Smite my landlord"
          disabled={disabled}
          maxLength={120}
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          accent="slate"
          value={category}
          onChange={(e) => setCategory(e.target.value as TicketCategory)}
          disabled={disabled}
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          id="priority"
          accent="slate"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TicketPriority)}
          disabled={disabled}
        >
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Prayer Details</Label>
        <Textarea
          id="description"
          accent="slate"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your request in detail. The more dramatic, the better..."
          disabled={disabled}
          rows={5}
          maxLength={1000}
        />
      </div>

      <Button type="submit" accent="slate" className="w-full py-3" disabled={!subject.trim() || !description.trim() || disabled}>
        <Send className="h-4 w-4" />
        {disabled ? "Processing..." : "Submit Ticket"}
      </Button>
    </form>
  );
}

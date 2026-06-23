"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { Confession } from "@/lib/confessionalTypes";
import { generateAnonymousLabel, generateConfessionId } from "@/lib/confessionalPosts";
import { addUserPost } from "@/lib/confessionalStorage";
import { Button, Surface, Textarea } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface SubmitConfessionFormProps {
  onSubmitted: (post: Confession) => void;
}

export default function SubmitConfessionForm({ onSubmitted }: SubmitConfessionFormProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);

    const post: Confession = {
      id: generateConfessionId(),
      content: trimmed,
      absolveVotes: 0,
      condemnVotes: 0,
      createdAt: new Date().toISOString(),
      authorLabel: generateAnonymousLabel(),
      isUser: true,
    };

    addUserPost(post);
    onSubmitted(post);
    setContent("");
    setSubmitting(false);
  }

  return (
    <Surface as="form" accent="plum" accentTint onSubmit={handleSubmit}>
      <p className={cn("verse-ref mb-1", accentStyles.plum.text)}>
        Anonymous Confession
      </p>
      <h2 className="mb-3 font-serif text-lg font-semibold text-ink">Unburden Thyself</h2>
      <Textarea
        accent="plum"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Confess a sin, grievance, or petty crime. You'll get a random anonymous username. Judgment from strangers included."
        rows={4}
        maxLength={500}
        className="mb-3"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] text-ink-soft">{content.length}/500</span>
        <Button type="submit" accent="plum" disabled={!content.trim() || submitting}>
          <Send className="h-4 w-4" />
          Post to the Confessional
        </Button>
      </div>
    </Surface>
  );
}

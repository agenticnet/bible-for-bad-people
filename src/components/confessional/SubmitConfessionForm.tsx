"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { Confession } from "@/lib/confessionalTypes";
import { generateAnonymousLabel, generateConfessionId } from "@/lib/confessionalPosts";
import { addUserPost } from "@/lib/confessionalStorage";

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
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-neon-purple/30 bg-neon-purple/5 p-5"
    >
      <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-neon-purple">
        Anonymous Confession
      </p>
      <h2 className="mb-3 text-lg font-semibold text-bone">Unburden Thyself</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Confess a sin, grievance, or petty crime. You’ll get a random anonymous username. Judgment from strangers included."
        rows={4}
        maxLength={500}
        className="mb-3 w-full resize-none rounded-lg border border-ash bg-shadow px-4 py-3 text-sm text-bone placeholder:text-muted/50 focus:border-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-neon-purple/30"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] text-muted/60">{content.length}/500</span>
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="flex items-center gap-2 rounded-lg border border-neon-purple/50 bg-neon-purple/15 px-5 py-2.5 text-sm font-semibold text-neon-purple transition-all hover:bg-neon-purple/25 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
          Post to the Confessional
        </button>
      </div>
    </form>
  );
}

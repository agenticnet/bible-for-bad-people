"use client";

import { useState } from "react";
import { Send, Eye } from "lucide-react";
import type { Confession } from "@/lib/confessionalTypes";
import { submitConfession } from "@/lib/data/confessional";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { usePathname } from "next/navigation";
import { getLossCopy } from "@/lib/auth/upsellCopy";
import AuthGate from "@/components/auth/AuthGate";
import { Button, Surface, Textarea } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface SubmitConfessionFormProps {
  onSubmitted: (post: Confession) => void;
}

function ConfessionForm({ onSubmitted }: SubmitConfessionFormProps) {
  const { profile, user } = useAuth();
  const { openSignUp } = useAuthModal();
  const pathname = usePathname();
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    if (!user) {
      setPreview(true);
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await submitConfession(trimmed);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    if (result.confession) onSubmitted(result.confession);

    setContent("");
    setPreview(false);
    setSubmitting(false);
  }

  if (preview && !user) {
    return (
      <Surface accent="plum" accentTint padding="lg">
        <p className={cn("verse-ref mb-2", accentStyles.plum.text)}>Confession Preview</p>
        <p className="mb-4 text-sm leading-relaxed text-ink">{content.trim()}</p>
        <p className="mb-4 text-sm text-ink-soft">{getLossCopy("confessional")}</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            accent="plum"
            onClick={() => openSignUp("confessional", pathname)}
          >
            Post as you
          </Button>
          <Button type="button" variant="ghost" accent="plum" onClick={() => setPreview(false)}>
            Edit
          </Button>
        </div>
      </Surface>
    );
  }

  return (
    <Surface as="form" accent="plum" accentTint onSubmit={handleSubmit}>
      <p className={cn("verse-ref mb-1", accentStyles.plum.text)}>
        {profile ? `Posting as ${profile.username}` : "Confession"}
      </p>
      <h2 className="mb-3 font-serif text-lg font-semibold text-ink">Unburden Thyself</h2>
      <Textarea
        accent="plum"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Confess a sin, grievance, or petty crime. Judgment from strangers included."
        rows={4}
        maxLength={500}
        className="mb-3"
      />
      {error && <p className="mb-2 text-sm text-ember">{error}</p>}
      <div className="flex items-center justify-between gap-3">
        <span className="verse-ref text-ink-soft">{content.length}/500</span>
        <Button type="submit" accent="plum" disabled={!content.trim() || submitting}>
          {user ? (
            <>
              <Send className="h-4 w-4" />
              {submitting ? "Posting..." : "Confess"}
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Preview confession
            </>
          )}
        </Button>
      </div>
    </Surface>
  );
}

export default function SubmitConfessionForm(props: SubmitConfessionFormProps) {
  return (
    <AuthGate mode="preview" lossContext="confessional">
      <ConfessionForm {...props} />
    </AuthGate>
  );
}

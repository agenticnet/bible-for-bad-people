"use client";

import { useState } from "react";
import { ScrollText } from "lucide-react";
import { translatePettySin, generateSinId } from "@/lib/sinTranslationEngine";
import { addToSinLog } from "@/lib/sinStorage";
import { SIN_LIBRARY } from "@/lib/sinLibrary";

interface SinTranslatorFormProps {
  onLogUpdate: () => void;
}

export default function SinTranslatorForm({ onLogUpdate }: SinTranslatorFormProps) {
  const [input, setInput] = useState("");
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  function handleTranslate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTranslating) return;

    setIsTranslating(true);
    setTranslation(null);

    setTimeout(() => {
      const result = translatePettySin(trimmed);
      setTranslation(result);
      setIsTranslating(false);
    }, 800);
  }

  function logTranslation() {
    if (!translation || !input.trim()) return;
    addToSinLog({
      id: generateSinId(),
      petty: input.trim(),
      translation,
      completedAt: new Date().toISOString(),
      source: "custom",
    });
    onLogUpdate();
    setInput("");
    setTranslation(null);
  }

  function fillSuggestion(petty: string) {
    setInput(petty);
    setTranslation(null);
  }

  const suggestions = SIN_LIBRARY.slice(0, 6);

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-neon-pink">
          Confession Booth
        </p>
        <h2 className="text-xl font-bold text-bone" style={{ fontFamily: "var(--font-display)" }}>
          Translate Your Sin
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Type a petty thing you did. Our engine converts it to dramatic King James-style
          prose. Grok API coming soon — for now, template sorcery.
        </p>
      </div>

      <form onSubmit={handleTranslate} className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. I stole my coworker's lunch from the fridge..."
          rows={3}
          className="mb-3 w-full resize-none rounded-xl border border-ash bg-shadow px-4 py-3 text-sm text-bone placeholder:text-muted/50 focus:border-neon-pink/50 focus:outline-none focus:ring-1 focus:ring-neon-pink/30"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTranslating}
          className="flex items-center gap-2 rounded-lg border border-neon-pink/50 bg-neon-pink/10 px-5 py-2.5 text-sm font-semibold text-neon-pink transition-all hover:border-neon-pink hover:bg-neon-pink/20 disabled:opacity-40"
        >
          <ScrollText className="h-4 w-4" />
          {isTranslating ? "Translating..." : "Translate to Scripture"}
        </button>
      </form>

      {translation && (
        <div className="mb-6 rounded-xl border border-neon-pink/30 bg-neon-pink/5 p-5">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-neon-pink">
            King James-ish Translation
          </p>
          <p
            className="mb-4 text-base leading-relaxed text-bone italic"
            style={{ fontFamily: "var(--font-display)" }}
          >
            &ldquo;{translation}&rdquo;
          </p>
          <button
            type="button"
            onClick={logTranslation}
            className="text-sm text-neon-pink hover:underline"
          >
            Log this sin to my confession record →
          </button>
        </div>
      )}

      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-muted">
          Quick suggestions — tap to fill
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((sin) => (
            <button
              key={sin.id}
              type="button"
              onClick={() => fillSuggestion(sin.petty)}
              className="rounded-full border border-ash bg-smoke px-3 py-1.5 text-xs text-muted transition-colors hover:border-neon-pink/40 hover:text-bone"
            >
              {sin.petty.length > 45 ? `${sin.petty.slice(0, 45)}…` : sin.petty}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ScrollText } from "lucide-react";
import { translatePettySin, generateSinId } from "@/lib/sinTranslationEngine";
import { addToSinLog } from "@/lib/sinStorage";
import { SIN_LIBRARY } from "@/lib/sinLibrary";
import {
  Button,
  Chip,
  SectionHeader,
  Surface,
  Textarea,
} from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

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
      setTranslation(translatePettySin(trimmed));
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
      <SectionHeader
        kicker="Confession Booth"
        title="Translate Your Sin"
        description="Type a petty thing you did. Our engine converts it to dramatic King James-style prose. Grok API coming soon — for now, template sorcery."
        accent="terra"
      />

      <form onSubmit={handleTranslate} className="mb-4">
        <Textarea
          accent="terra"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. I stole my coworker's lunch from the fridge..."
          rows={3}
          className="mb-3 rounded-xl"
        />
        <Button type="submit" accent="terra" disabled={!input.trim() || isTranslating}>
          <ScrollText className="h-4 w-4" />
          {isTranslating ? "Translating..." : "Translate to Scripture"}
        </Button>
      </form>

      {translation && (
        <Surface accent="terra" accentTint className="mb-6">
          <p className={cn("verse-ref mb-2", accentStyles.terra.text)}>
            King James-ish Translation
          </p>
          <p className="scripture-block mb-4 text-base italic text-ink">
            &ldquo;{translation}&rdquo;
          </p>
          <button
            type="button"
            onClick={logTranslation}
            className={cn("text-sm hover:underline", accentStyles.terra.text)}
          >
            Log this sin to my confession record →
          </button>
        </Surface>
      )}

      <div>
        <p className="verse-ref mb-2 text-ink-soft">Quick suggestions — tap to fill</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((sin) => (
            <Chip
              key={sin.id}
              accent="terra"
              onClick={() => fillSuggestion(sin.petty)}
            >
              {sin.petty.length > 45 ? `${sin.petty.slice(0, 45)}…` : sin.petty}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

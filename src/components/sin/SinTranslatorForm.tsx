"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollText } from "lucide-react";
import { translatePettySin } from "@/lib/sinTranslationEngine";
import { addSinLogItem } from "@/lib/data/sin";
import { addToSinLog } from "@/lib/sinStorage";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { usePathname } from "next/navigation";
import { getLossCopy } from "@/lib/auth/upsellCopy";
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
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clipReveal, resolveTransition, resolveVariants, transition } from "@/lib/motion";

interface SinTranslatorFormProps {
  onLogUpdate: () => void;
}

export default function SinTranslatorForm({ onLogUpdate }: SinTranslatorFormProps) {
  const { user } = useAuth();
  const { openSignUp } = useAuthModal();
  const pathname = usePathname();
  const [input, setInput] = useState("");
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const reducedMotion = useReducedMotion();
  const revealVariants = resolveVariants(clipReveal, reducedMotion);
  const revealT = resolveTransition(transition.slow, reducedMotion);

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

  async function logTranslation() {
    if (!translation || !input.trim()) return;

    if (user) {
      await addSinLogItem({
        petty: input.trim(),
        translation,
        completedAt: new Date().toISOString(),
        source: "custom",
      });
    } else {
      addToSinLog({
        id: `sin-${Date.now()}`,
        petty: input.trim(),
        translation,
        completedAt: new Date().toISOString(),
        source: "custom",
      });
    }
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
        description="Type a petty thing you did. Our engine converts it to dramatic King James-style prose."
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

      <AnimatePresence>
        {translation && (
          <motion.div
            key={translation}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={revealVariants}
            transition={revealT}
          >
            <Surface accent="terra" accentTint className="mb-6">
              <p className={cn("verse-ref mb-2", accentStyles.terra.text)}>
                King James-ish Translation
              </p>
              <p className="scripture-block mb-4 text-base italic text-ink">
                &ldquo;{translation}&rdquo;
              </p>
              {user ? (
                <button
                  type="button"
                  onClick={() => void logTranslation()}
                  className={cn("text-sm hover:underline", accentStyles.terra.text)}
                >
                  Log this sin to my confession record →
                </button>
              ) : (
                <div className="border-t border-rule pt-4">
                  <p className="mb-3 text-sm text-ink-soft">{getLossCopy("sin")}</p>
                  <button
                    type="button"
                    onClick={() => {
                      addToSinLog({
                        id: `sin-${Date.now()}`,
                        petty: input.trim(),
                        translation,
                        completedAt: new Date().toISOString(),
                        source: "custom",
                      });
                      onLogUpdate();
                      openSignUp("sin", pathname);
                    }}
                    className={cn("text-sm font-medium hover:underline", accentStyles.terra.text)}
                  >
                    Add to sin log →
                  </button>
                </div>
              )}
            </Surface>
          </motion.div>
        )}
      </AnimatePresence>

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

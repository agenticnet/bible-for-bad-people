"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import type { SinCategory } from "@/lib/sinTypes";
import { CATEGORY_LABELS } from "@/lib/sinTypes";
import { translatePettySin, generateSinId } from "@/lib/sinTranslationEngine";
import { saveCommunitySin } from "@/lib/sinStorage";

interface ContributeSinFormProps {
  onContributed: () => void;
}

export default function ContributeSinForm({ onContributed }: ContributeSinFormProps) {
  const [petty, setPetty] = useState("");
  const [category, setCategory] = useState<SinCategory>("social");
  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handlePreview(e: React.FormEvent) {
    e.preventDefault();
    if (!petty.trim()) return;
    setPreview(translatePettySin(petty.trim()));
  }

  function handleSubmit() {
    if (!petty.trim() || !preview) return;

    saveCommunitySin({
      id: generateSinId(),
      petty: petty.trim(),
      translation: preview,
      category,
      difficulty: "mild",
      submittedAt: new Date().toISOString(),
    });

    setSubmitted(true);
    setPetty("");
    setPreview(null);
    onContributed();

    setTimeout(() => setSubmitted(false), 3000);
  }

  const inputClass =
    "w-full rounded-lg border border-rule bg-page px-3 py-2.5 text-sm text-ink focus:border-neon-pink/50 focus:outline-none focus:ring-1 focus:ring-neon-pink/30";

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-neon-pink">
          Community Depravity
        </p>
        <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-display)" }}>
          Contribute a New Sin
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Invent a petty sin for the library. We&apos;ll auto-translate it to scripture
          and add it to the community pool on your device. When Grok API arrives,
          daily lists get AI-generated — your contributions feed the chaos.
        </p>
      </div>

      {submitted && (
        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Sin submitted to the community pool. The archive grows. Thank you for your service.
        </div>
      )}

      <form onSubmit={handlePreview} className="flex flex-col gap-4">
        <div>
          <label htmlFor="petty-sin" className="mb-1.5 block text-xs uppercase tracking-wider text-ink-soft">
            Petty sin (plain English)
          </label>
          <textarea
            id="petty-sin"
            value={petty}
            onChange={(e) => {
              setPetty(e.target.value);
              setPreview(null);
            }}
            placeholder="e.g. Pretended not to see my neighbor so I wouldn't have to chat..."
            rows={3}
            className={`${inputClass} resize-none`}
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="sin-category" className="mb-1.5 block text-xs uppercase tracking-wider text-ink-soft">
            Category
          </label>
          <select
            id="sin-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as SinCategory)}
            className={inputClass}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!petty.trim()}
          className="rounded-lg border border-neon-pink/50 bg-neon-pink/10 px-5 py-2.5 text-sm font-semibold text-neon-pink hover:bg-neon-pink/20 disabled:opacity-40"
        >
          Preview Translation
        </button>
      </form>

      {preview && (
        <div className="mt-6 rounded-xl border border-neon-pink/30 bg-neon-pink/5 p-5">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-neon-pink">
            Preview
          </p>
          <p
            className="mb-4 text-sm italic leading-relaxed text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            &ldquo;{preview}&rdquo;
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-lg border border-neon-gold/50 bg-neon-gold/10 px-5 py-2.5 text-sm font-semibold text-neon-gold hover:bg-neon-gold/20"
          >
            <PlusCircle className="h-4 w-4" />
            Add to Community Pool
          </button>
        </div>
      )}
    </div>
  );
}

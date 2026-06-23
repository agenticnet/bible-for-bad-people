"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import type { SinCategory } from "@/lib/sinTypes";
import { CATEGORY_LABELS } from "@/lib/sinTypes";
import { translatePettySin } from "@/lib/sinTranslationEngine";
import { contributeSin } from "@/lib/data/sin";
import {
  Button,
  Callout,
  Label,
  SectionHeader,
  Select,
  Surface,
  Textarea,
} from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

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

  async function handleSubmit() {
    if (!petty.trim() || !preview) return;

    const result = await contributeSin({
      petty: petty.trim(),
      translation: preview,
      category,
      difficulty: "mild",
    });

    if (result.error) return;

    setSubmitted(true);
    setPetty("");
    setPreview(null);
    onContributed();

    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div>
      <SectionHeader
        kicker="Community Depravity"
        title="Contribute a New Sin"
        description="Invent a petty sin for the library. We'll auto-translate it to scripture and add it to the community pool."
        accent="terra"
      />

      {submitted && (
        <Callout tone="success" className="mb-4 text-sm">
          Sin submitted to the community pool. The archive grows.
        </Callout>
      )}

      <form onSubmit={handlePreview} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="petty-sin">Petty sin (plain English)</Label>
          <Textarea
            id="petty-sin"
            accent="terra"
            value={petty}
            onChange={(e) => {
              setPetty(e.target.value);
              setPreview(null);
            }}
            placeholder="e.g. Pretended not to see my neighbor so I wouldn't have to chat..."
            rows={3}
            maxLength={200}
          />
        </div>

        <div>
          <Label htmlFor="sin-category">Category</Label>
          <Select
            id="sin-category"
            accent="terra"
            value={category}
            onChange={(e) => setCategory(e.target.value as SinCategory)}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <Button type="submit" accent="terra" disabled={!petty.trim()}>
          Preview Translation
        </Button>
      </form>

      {preview && (
        <Surface accent="terra" accentTint className="mt-6">
          <p className={cn("verse-ref mb-2", accentStyles.terra.text)}>Preview</p>
          <p className="scripture-block mb-4 text-sm italic text-ink">
            &ldquo;{preview}&rdquo;
          </p>
          <Button accent="wine" onClick={() => void handleSubmit()}>
            <PlusCircle className="h-4 w-4" />
            Add to Community Pool
          </Button>
        </Surface>
      )}
    </div>
  );
}

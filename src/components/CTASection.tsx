"use client";

import { ArrowRight } from "lucide-react";
import { LinkButton, Reveal } from "@/components/ui";

export default function CTASection() {
  return (
    <section className="border-t border-rule px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 font-serif text-[clamp(1.75rem,4vw,2.5rem)] text-ink">
          Ready to unload your sins?
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-ink-soft">
          The confessional is open 24/7. GOD is listening — probably.
          Responses may vary in divine indifference.
        </p>
        <LinkButton href="/chat" className="gap-2">
          Open the Confessional
          <ArrowRight className="h-5 w-5" />
        </LinkButton>
      </Reveal>
    </section>
  );
}

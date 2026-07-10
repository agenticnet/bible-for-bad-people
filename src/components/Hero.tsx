"use client";

import { ArrowRight } from "lucide-react";
import { LinkButton, Stagger } from "@/components/ui";
import { fadeUp, stagger } from "@/lib/motion";

export default function Hero() {
  return (
    <section className="relative border-b border-rule px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <Stagger
          animateOnMount
          childVariant={fadeUp}
          staggerDelay={stagger.loose}
          delayChildren={0.05}
          className="flex flex-col items-center"
        >
          <p className="verse-ref mb-6 text-ink-soft">
            Est. whenever guilt became optional
          </p>

          <h1 className="mb-6 font-serif text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.08] font-normal tracking-[-0.02em]">
            <span className="block text-ink">Bible for</span>
            <span className="block text-wine">Bad People</span>
          </h1>

          <p className="mx-auto mb-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Vent to the divine. Skip the piety. Get answers you probably
            didn&apos;t deserve — delivered with zero judgment and maximum
            sarcasm.
          </p>

          <p className="mx-auto mb-10 max-w-lg text-sm leading-relaxed text-ink-soft">
            A provocative sanctuary for the spiritually exhausted, morally
            flexible, and delightfully unhinged.
          </p>

          <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <LinkButton href="/chat" className="group">
              Speak with GOD
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </LinkButton>
            <LinkButton href="/#chambers" variant="secondary">
              Explore the Chambers
            </LinkButton>
          </div>
        </Stagger>
      </div>
    </section>
  );
}

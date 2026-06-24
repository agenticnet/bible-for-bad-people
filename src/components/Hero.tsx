"use client";

import { ArrowRight } from "lucide-react";
import { LinkButton, Stagger, StaggerItem } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  clipReveal,
  fadeUp,
  resolveVariants,
  stagger,
} from "@/lib/motion";

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const fadeVariants = resolveVariants(fadeUp, reducedMotion);
  const clipVariants = resolveVariants(clipReveal, reducedMotion);

  return (
    <section className="relative border-b border-rule px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <Stagger
          animateOnMount
          staggerDelay={stagger.loose}
          delayChildren={0.05}
          className="flex flex-col items-center"
        >
          <StaggerItem variant={fadeVariants}>
            <p className="verse-ref mb-6 text-ink-soft">
              Est. whenever guilt became optional
            </p>
          </StaggerItem>

          <StaggerItem variant={fadeVariants}>
            <h1 className="mb-1 font-serif text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.08] font-normal tracking-[-0.02em] text-ink">
              Bible for
            </h1>
          </StaggerItem>

          <StaggerItem variant={clipVariants}>
            <h1 className="mb-6 font-serif text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.08] font-normal tracking-[-0.02em] text-wine">
              Bad People
            </h1>
          </StaggerItem>

          <StaggerItem variant={fadeVariants}>
            <p className="mx-auto mb-4 max-w-xl text-lg leading-relaxed text-ink-soft">
              Vent to the divine. Skip the piety. Get answers you probably
              didn&apos;t deserve — delivered with zero judgment and maximum
              sarcasm.
            </p>
          </StaggerItem>

          <StaggerItem variant={fadeVariants}>
            <p className="mx-auto mb-10 max-w-lg text-sm leading-relaxed text-ink-soft">
              A provocative sanctuary for the spiritually exhausted, morally
              flexible, and delightfully unhinged.
            </p>
          </StaggerItem>

          <StaggerItem variant={fadeVariants}>
            <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <LinkButton href="/chat" className="group">
                Speak with GOD
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </LinkButton>
              <LinkButton href="/#chambers" variant="secondary">
                Explore the Chambers
              </LinkButton>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

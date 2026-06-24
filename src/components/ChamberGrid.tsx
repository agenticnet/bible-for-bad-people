"use client";

import { ArrowUpRight, Lock } from "lucide-react";
import { motion } from "motion/react";
import {
  MotionLink,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { chambers, accentStyles } from "@/lib/chambers";
import { fadeUpScale, duration, resolveVariants, stagger } from "@/lib/motion";

export default function ChamberGrid() {
  const reducedMotion = useReducedMotion();
  const cardVariants = resolveVariants(fadeUpScale, reducedMotion);

  return (
    <section id="chambers" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl">
          <h2 className="mb-4 font-serif text-3xl text-ink sm:text-4xl">
            Chambers for the Faithless
          </h2>
          <p className="text-base leading-relaxed text-ink-soft">
            Your complete digital purgatory — all nine chambers stand open. Visions
            approximate today; true prophecy when the APIs arrive.
          </p>
        </Reveal>

        <Stagger staggerDelay={stagger.tight} className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {chambers.map((chamber) => {
            const styles = accentStyles[chamber.accent];
            const Icon = chamber.icon;
            const isOpen = chamber.status === "live";

            const cardContent = (
              <>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <motion.div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border ${styles.border} ${styles.bg}`}
                    whileHover={isOpen && !reducedMotion ? { y: -1 } : undefined}
                    transition={{ duration: duration.fast }}
                  >
                    <Icon className={`h-4 w-4 ${styles.icon}`} />
                  </motion.div>
                  {isOpen ? (
                    <span className="verse-ref rounded-sm border border-wine/25 bg-wine/8 px-2 py-0.5 text-[0.65rem] text-wine">
                      Open
                    </span>
                  ) : (
                    <span className="verse-ref flex items-center gap-1 rounded-sm border border-rule bg-smoke px-2 py-0.5 text-[0.65rem] text-ink-soft">
                      <Lock className="h-2.5 w-2.5" />
                      Sealed
                    </span>
                  )}
                </div>
                <h3 className="mb-2 font-serif text-lg text-ink">{chamber.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {chamber.description}
                </p>
                {isOpen && (
                  <div className="mt-4 flex items-center gap-1 text-sm text-wine">
                    Enter
                    <motion.span
                      className="inline-flex"
                      whileHover={!reducedMotion ? { x: 2 } : undefined}
                      transition={{ duration: duration.fast }}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </motion.span>
                  </div>
                )}
              </>
            );

            const surfaceClass = `group relative bg-page p-6 transition-colors duration-200 hover:bg-smoke ${isOpen ? styles.glow : ""}`;

            return (
              <StaggerItem key={chamber.id} variant={cardVariants}>
                {isOpen && chamber.href ? (
                  <MotionLink href={chamber.href} className={surfaceClass}>
                    {cardContent}
                  </MotionLink>
                ) : (
                  <div className={`${surfaceClass} opacity-75 hover:opacity-100`}>
                    {cardContent}
                  </div>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

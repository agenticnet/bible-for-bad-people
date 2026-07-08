"use client";

import { useMemo } from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import { motion } from "motion/react";
import { MotionLink, Reveal, Badge, accentStyles } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAuth } from "@/components/auth/AuthProvider";
import { useOnboardingDraft } from "@/components/auth/OnboardingDraftProvider";
import { chambers } from "@/lib/chambers";
import { duration } from "@/lib/motion";

function sortChambers(order: string[]) {
  if (order.length === 0) return chambers;
  const orderMap = new Map(order.map((id, i) => [id, i]));
  return [...chambers].sort((a, b) => {
    const aIdx = orderMap.get(a.id) ?? 999;
    const bIdx = orderMap.get(b.id) ?? 999;
    return aIdx - bIdx;
  });
}

export default function ChamberGrid() {
  const reducedMotion = useReducedMotion();
  const { profile } = useAuth();
  const { draft } = useOnboardingDraft();

  const orderedChambers = useMemo(() => {
    if (profile?.chamber_order && profile.chamber_order.length > 0) {
      return sortChambers(profile.chamber_order);
    }
    if (draft.chamberOrder.length > 0) {
      return sortChambers(draft.chamberOrder);
    }
    return chambers;
  }, [profile?.chamber_order, draft.chamberOrder]);

  const hasCustomLayout =
    (profile?.chamber_order && profile.chamber_order.length > 0) ||
    draft.chamberOrder.length > 0;

  return (
    <section id="chambers" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-14 max-w-2xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-3xl text-ink sm:text-4xl">
              Chambers for the Faithless
            </h2>
            {hasCustomLayout && (
              <Badge tone="wine" size="sm">
                Your layout
              </Badge>
            )}
          </div>
          <p className="text-base leading-relaxed text-ink-soft">
            Your complete digital purgatory — all nine chambers stand open. Visions
            approximate today; true prophecy when the APIs arrive.
          </p>
        </Reveal>

        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {orderedChambers.map((chamber) => {
            const styles = accentStyles[chamber.accent];
            const Icon = chamber.icon;
            const isOpen = chamber.status === "live";
            const isFavorite =
              profile?.favorite_chambers?.includes(chamber.id) ||
              draft.favoriteChambers.includes(chamber.id);

            const cardContent = (
              <>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <motion.div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border ${styles.borderMuted} ${styles.bgMuted}`}
                    whileHover={isOpen && !reducedMotion ? { y: -1 } : undefined}
                    transition={{ duration: duration.fast }}
                  >
                    <Icon className={`h-4 w-4 ${styles.text}`} />
                  </motion.div>
                  <div className="flex flex-col items-end gap-1">
                    {isFavorite && isOpen && (
                      <Badge tone="wine" size="sm" className="verse-ref rounded-sm normal-case tracking-normal">
                        Pinned
                      </Badge>
                    )}
                    {isOpen ? (
                      <Badge tone="wine" size="sm" className="verse-ref rounded-sm normal-case tracking-normal">
                        Open
                      </Badge>
                    ) : (
                      <Badge tone="active" size="sm" className="verse-ref flex items-center gap-1 rounded-sm normal-case tracking-normal">
                        <Lock className="h-2.5 w-2.5" />
                        Sealed
                      </Badge>
                    )}
                  </div>
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

            const surfaceClass = `group relative border border-transparent bg-page p-6 transition-colors duration-200 hover:bg-smoke ${isOpen ? styles.borderHover : ""}`;

            return isOpen && chamber.href ? (
              <MotionLink key={chamber.id} href={chamber.href} className={surfaceClass}>
                {cardContent}
              </MotionLink>
            ) : (
              <div
                key={chamber.id}
                className={`${surfaceClass} opacity-75 hover:opacity-100`}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

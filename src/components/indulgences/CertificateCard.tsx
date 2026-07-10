"use client";

import { motion } from "motion/react";
import { Crown } from "lucide-react";
import type { PurchasedIndulgence } from "@/lib/indulgenceTypes";
import { Surface } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, spring } from "@/lib/motion";

interface CertificateCardProps {
  purchase: PurchasedIndulgence;
}

export default function CertificateCard({ purchase }: CertificateCardProps) {
  const reducedMotion = useReducedMotion();
  const t = resolveTransition(spring.gentle, reducedMotion);

  return (
    <motion.div
      initial={
        reducedMotion
          ? false
          : { rotateX: -12, opacity: 0, transformPerspective: 800 }
      }
      animate={{ rotateX: 0, opacity: 1 }}
      transition={t}
      style={{ transformPerspective: 800 }}
    >
      <Surface
        accent="wine"
        className="relative overflow-hidden border-2"
        padding="lg"
      >
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 h-16 w-16 rounded-full border-2 border-wine" />
          <div className="absolute right-4 bottom-4 h-24 w-24 rounded-full border border-wine" />
        </div>

        <div className="relative text-center">
          <Crown className={cn("mx-auto mb-3 h-8 w-8", accentStyles.wine.text)} />
          <p className={cn("verse-ref mb-1", accentStyles.wine.text)}>
            Heavenly Administration
          </p>
          <h3 className={cn("mb-2 font-serif text-lg font-bold", accentStyles.wine.text)}>
            Certificate of Indulgence
          </h3>
          <p className="mb-4 text-sm font-semibold text-ink">{purchase.productName}</p>

          <Surface accent="wine" accentTint className="mx-auto mb-4 max-w-xs" padding="sm">
            <p className="verse-ref text-ink-soft">Certificate ID</p>
            <p className={cn("mono-contain font-mono text-sm", accentStyles.wine.text)}>
              {purchase.certificateId}
            </p>
          </Surface>

          <p className="text-xs text-ink-soft">
            Issued{" "}
            {new Date(purchase.purchasedAt).toLocaleDateString([], {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            {" · "}
            Paid ${purchase.pricePaid.toFixed(2)} (no real charge)
          </p>

          <p className="verse-ref mt-4 italic text-ink-soft">
            This certificate has no legal, spiritual, or cosmic validity. Display at your own risk.
          </p>
        </div>
      </Surface>
    </motion.div>
  );
}

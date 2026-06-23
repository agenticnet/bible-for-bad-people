"use client";

import { Crown } from "lucide-react";
import type { PurchasedIndulgence } from "@/lib/indulgenceTypes";

interface CertificateCardProps {
  purchase: PurchasedIndulgence;
}

export default function CertificateCard({ purchase }: CertificateCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-neon-gold/40 bg-gradient-to-br from-page via-parchment to-page p-6">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 h-16 w-16 rounded-full border-2 border-neon-gold" />
        <div className="absolute bottom-4 right-4 h-24 w-24 rounded-full border border-neon-gold" />
      </div>

      <div className="relative text-center">
        <Crown className="mx-auto mb-3 h-8 w-8 text-neon-gold" />
        <p className="mb-1 text-[10px] uppercase tracking-[0.4em] text-neon-gold">
          Heavenly Administration
        </p>
        <h3
          className="mb-2 text-lg font-bold text-neon-gold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Certificate of Indulgence
        </h3>
        <p className="mb-4 text-sm font-semibold text-ink">{purchase.productName}</p>

        <div className="mx-auto mb-4 max-w-xs rounded-lg border border-neon-gold/20 bg-neon-gold/5 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">Certificate ID</p>
          <p className="font-mono text-sm text-neon-gold">{purchase.certificateId}</p>
        </div>

        <p className="text-xs text-ink-soft">
          Issued{" "}
          {new Date(purchase.purchasedAt).toLocaleDateString([], {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          {" · "}
          Paid ${purchase.pricePaid.toFixed(2)} (mock)
        </p>

        <p className="mt-4 text-[10px] italic text-ink-soft">
          This certificate has no legal, spiritual, or cosmic validity. Display at your own risk.
        </p>
      </div>
    </div>
  );
}

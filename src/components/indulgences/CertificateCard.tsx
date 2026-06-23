import { Crown } from "lucide-react";
import type { PurchasedIndulgence } from "@/lib/indulgenceTypes";
import { Surface } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
  purchase: PurchasedIndulgence;
}

export default function CertificateCard({ purchase }: CertificateCardProps) {
  return (
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
          <p className={cn("font-mono text-sm", accentStyles.wine.text)}>
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
          Paid ${purchase.pricePaid.toFixed(2)} (mock)
        </p>

        <p className="mt-4 text-[10px] italic text-ink-soft">
          This certificate has no legal, spiritual, or cosmic validity. Display at your own risk.
        </p>
      </div>
    </Surface>
  );
}

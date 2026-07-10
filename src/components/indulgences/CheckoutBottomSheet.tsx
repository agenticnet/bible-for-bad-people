"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import {
  formatPrice,
  generateCertificateId,
  INDULGENCE_PRODUCTS,
} from "@/lib/indulgenceProducts";
import { addIndulgencePurchase } from "@/lib/data/indulgences";
import {
  AnchoredPrice,
  useCollectiblesOptional,
} from "@/components/collectibles";
import {
  ResponsiveOverlay,
  SuccessMoment,
  Surface,
  THUMB_CTA_MIN_HEIGHT,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const SOUL_INSURANCE = INDULGENCE_PRODUCTS.find((p) => p.id === "soul-insurance");
const RESERVATION_MS = 5 * 60 * 1000;

type CheckoutStep = "anchor" | "confirmation";

interface CheckoutBottomSheetProps {
  open: boolean;
  onClose: () => void;
  product: IndulgenceProduct;
  displayName: string;
  addInsurance: boolean;
  onAddInsuranceChange: (value: boolean) => void;
  onPurchased: () => void;
  showContrast?: boolean;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function useReservationCountdown(active: boolean) {
  const [remainingMs, setRemainingMs] = useState(RESERVATION_MS);

  useEffect(() => {
    if (!active) {
      setRemainingMs(RESERVATION_MS);
      return;
    }

    const endsAt = Date.now() + RESERVATION_MS;
    const tick = () => {
      const left = Math.max(0, endsAt - Date.now());
      setRemainingMs(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [active]);

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds, expired: remainingMs <= 0 };
}

const EXPRESS_OPTIONS = [
  { id: "apple", label: "Apple Pay", icon: "" },
  { id: "google", label: "Google Pay", icon: "G" },
  { id: "wallet", label: "Saved Wallet", icon: "💳" },
] as const;

export default function CheckoutBottomSheet({
  open,
  onClose,
  product,
  displayName,
  addInsurance,
  onAddInsuranceChange,
  onPurchased,
  showContrast = true,
}: CheckoutBottomSheetProps) {
  const collectibles = useCollectiblesOptional();
  const [step, setStep] = useState<CheckoutStep>("anchor");
  const [processing, setProcessing] = useState(false);
  const [serverPending, setServerPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const countdown = useReservationCountdown(open);

  const reset = useCallback(() => {
    setStep("anchor");
    setProcessing(false);
    setServerPending(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleExpressPay = useCallback(
    async () => {
      if (processing || countdown.expired) return;
      setProcessing(true);
      setError(null);

      setStep("confirmation");

      const purchasePromise = addIndulgencePurchase({
        productId: product.id,
        productName: product.name,
        purchasedAt: new Date().toISOString(),
        certificateId: generateCertificateId(),
        pricePaid: product.price,
      });

      setServerPending(true);

      if (addInsurance && SOUL_INSURANCE) {
        void addIndulgencePurchase({
          productId: SOUL_INSURANCE.id,
          productName: SOUL_INSURANCE.name,
          purchasedAt: new Date().toISOString(),
          certificateId: generateCertificateId(),
          pricePaid: SOUL_INSURANCE.price,
        });
      }

      const result = await purchasePromise;
      setServerPending(false);
      setProcessing(false);

      if (result.error) {
        setError(result.error);
        setStep("anchor");
        return;
      }

      onPurchased();
      void collectibles?.refreshInventory();

      setTimeout(() => {
        onClose();
        reset();
      }, 2500);
    },
    [
      processing,
      countdown.expired,
      product,
      addInsurance,
      onPurchased,
      collectibles,
      onClose,
      reset,
    ]
  );

  return (
    <ResponsiveOverlay
      open={open}
      onClose={() => !processing && onClose()}
      accent="wine"
      title={`Checkout — ${product.name}`}
      closeDisabled={processing}
      snapHeight="max-h-[85dvh]"
      className="md:max-w-lg"
    >
      {step === "anchor" && (
        <>
          <div className="mb-4 flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-rule bg-smoke/40 text-3xl">
              {product.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="verse-ref mb-1 text-wine">Step 1 — Anchor</p>
              <h3 className="truncate font-bold text-ink">{product.name}</h3>
              <AnchoredPrice product={product} size="lg" className="mt-1" />
            </div>
          </div>

          <div className="mb-4 rounded-lg border border-ember/30 bg-ember/5 px-3 py-2">
            <p className="text-sm text-ink">
              Reservation holds for{" "}
              <span className="font-mono font-semibold tabular-nums text-ember">
                {pad(countdown.minutes)}:{pad(countdown.seconds)}
              </span>
            </p>
            <p className="text-xs text-ink-soft">
              Lose this price if you leave. Classic loss aversion.
            </p>
          </div>

          {error && (
            <p className="mb-4 text-sm text-ember">{error}</p>
          )}

          {SOUL_INSURANCE && product.id !== SOUL_INSURANCE.id && (
            <Surface accent="slate" accentTint className="mb-4" padding="sm">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={addInsurance}
                  onChange={(e) => onAddInsuranceChange(e.target.checked)}
                  className="mt-1 accent-slate"
                />
                <div>
                  <p className="text-sm font-medium text-ink">
                    Add {SOUL_INSURANCE.name} —{" "}
                    {formatPrice(SOUL_INSURANCE.price, SOUL_INSURANCE.priceLabel)}
                  </p>
                  <p className="text-xs text-ink-soft">
                    Covers 3 unexpected sins. Makes your main purchase feel trivial.
                  </p>
                </div>
              </label>
            </Surface>
          )}

          {showContrast && (
            <p className="mb-4 text-xs text-ink-soft">
              Satirical checkout — no real payment. Purchasing as {displayName || "you"}.
            </p>
          )}

          <p className="verse-ref mb-3 text-ink-soft">Step 2 — Express checkout</p>
          <div className="space-y-3">
            {EXPRESS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={countdown.expired || processing}
                onClick={() => void handleExpressPay()}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg border border-rule bg-ink px-4 font-semibold text-parchment transition-opacity hover:opacity-90 disabled:opacity-40",
                  THUMB_CTA_MIN_HEIGHT
                )}
              >
                {opt.id === "apple" ? (
                  <span className="text-lg tracking-tight"> Pay</span>
                ) : (
                  <>
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {step === "confirmation" && (
        <div className="relative py-4">
          <SuccessMoment
            title="Purchase Complete!"
            description="Certificate added to your vault. Salvation score updated."
            icon={<span className="text-3xl">{product.icon}</span>}
          />
          <p className="mt-4 text-center text-sm text-ink-soft">
            Want to make it yours?{" "}
            <Link href="/settings" className="text-wine hover:underline">
              Pin chambers and set your accent in Settings
            </Link>
            .
          </p>
          {serverPending && (
            <div className="absolute inset-x-0 top-2 flex justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-wine/30 border-t-wine" />
            </div>
          )}
        </div>
      )}
    </ResponsiveOverlay>
  );
}

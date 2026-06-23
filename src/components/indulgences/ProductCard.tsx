"use client";

import { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import { formatPrice, generateCertificateId } from "@/lib/indulgenceProducts";
import { addPurchase } from "@/lib/indulgenceStorage";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: IndulgenceProduct;
  onPurchased: () => void;
  displayName: string;
}

export default function ProductCard({
  product,
  onPurchased,
  displayName,
}: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  function handlePurchase() {
    if (processing) return;
    setProcessing(true);

    setTimeout(() => {
      addPurchase(
        {
          id: `purchase-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          purchasedAt: new Date().toISOString(),
          certificateId: generateCertificateId(),
          pricePaid: product.price,
        },
        displayName || "Anonymous Sinner"
      );
      setProcessing(false);
      setSuccess(true);
      onPurchased();

      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 2500);
    }, 1500);
  }

  const tierStyles = {
    basic: "border-rule hover:border-neon-gold/30",
    premium: "border-neon-gold/20 hover:border-neon-gold/40",
    ultimate: "border-neon-purple/30 hover:border-neon-purple/50",
    subscription: "border-neon-cyan/20 hover:border-neon-cyan/40",
  };

  return (
    <>
      <article
        className={cn( "flex flex-col rounded-xl border bg-page p-5 transition-all", tierStyles[product.tier] )}
      >
        <div className="mb-3 flex items-start justify-between">
          <span className="text-3xl">{product.icon}</span>
          {product.tier === "ultimate" && (
            <span className="rounded-full border border-neon-purple/40 bg-neon-purple/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-neon-purple">
              Ultimate
            </span>
          )}
        </div>
        <h3 className="mb-1 font-semibold text-ink">{product.name}</h3>
        <p className="mb-3 text-xs text-neon-gold">{product.tagline}</p>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-soft">
          {product.description}
        </p>
        {product.leaderboardBoost && (
          <p className="mb-3 text-[10px] text-neon-cyan">
            +{product.leaderboardBoost} Salvation Score
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-neon-gold">
            {formatPrice(product.price, product.priceLabel)}
          </span>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-neon-gold/50 bg-neon-gold/10 px-4 py-2 text-sm font-semibold text-neon-gold transition-all hover:bg-neon-gold/20 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            <ShoppingCart className="h-4 w-4" />
            Buy
          </button>
        </div>
      </article>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-parchment p-4">
          <div className="relative w-full max-w-md rounded-xl border border-neon-gold/30 bg-page p-6">
            <button
              type="button"
              onClick={() => !processing && setShowModal(false)}
              className="absolute top-4 right-4 text-ink-soft hover:text-ink"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {!success ? (
              <>
                <p className="mb-2 text-[10px] uppercase tracking-wider text-neon-gold">
                  Mock Checkout
                </p>
                <h3 className="mb-4 text-lg font-bold text-ink">{product.name}</h3>
                <p className="mb-6 text-2xl font-bold text-neon-gold">
                  {formatPrice(product.price, product.priceLabel)}
                </p>
                <p className="mb-6 text-sm text-ink-soft">
                  No real payment processed. This is satire. Your soul remains
                  your own problem. Stripe integration coming never (maybe).
                </p>
                <button
                  type="button"
                  onClick={handlePurchase}
                  disabled={processing}
                  className="w-full rounded-lg border border-neon-gold/50 bg-neon-gold/15 py-3 text-sm font-semibold text-neon-gold hover:bg-neon-gold/25 disabled:opacity-50"
                >
                  {processing
                    ? "Processing divine transaction..."
                    : "Confirm Mock Purchase"}
                </button>
              </>
            ) : (
              <div className="py-6 text-center">
                <span className="mb-4 block text-5xl">{product.icon}</span>
                <p className="mb-2 text-lg font-bold text-neon-gold">Purchase Complete!</p>
                <p className="text-sm text-ink-soft">
                  Certificate added to your vault. Salvation score updated.
                  The LORD&apos;s accounting department has been notified (not really).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

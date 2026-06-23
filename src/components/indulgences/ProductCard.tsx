"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import { formatPrice, generateCertificateId } from "@/lib/indulgenceProducts";
import { addPurchase } from "@/lib/indulgenceStorage";
import { Badge, Button, Modal, Surface } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: IndulgenceProduct;
  onPurchased: () => void;
  displayName: string;
}

const tierAccents = {
  basic: undefined,
  premium: "wine",
  ultimate: "plum",
  subscription: "slate",
} as const;

export default function ProductCard({
  product,
  onPurchased,
  displayName,
}: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const accent = tierAccents[product.tier];

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

  return (
    <>
      <Surface
        as="article"
        accent={accent}
        className={cn(
          "flex flex-col",
          accent && accentStyles[accent].borderHover
        )}
      >
        <div className="mb-3 flex items-start justify-between">
          <span className="text-3xl">{product.icon}</span>
          {product.tier === "ultimate" && <Badge tone="plum">Ultimate</Badge>}
        </div>
        <h3 className="mb-1 font-semibold text-ink">{product.name}</h3>
        <p className="mb-3 text-xs text-wine">{product.tagline}</p>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-soft">
          {product.description}
        </p>
        {product.leaderboardBoost && (
          <p className="mb-3 text-[10px] text-slate">
            +{product.leaderboardBoost} Salvation Score
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-wine">
            {formatPrice(product.price, product.priceLabel)}
          </span>
          <Button accent="wine" size="sm" onClick={() => setShowModal(true)}>
            <ShoppingCart className="h-4 w-4" />
            Buy
          </Button>
        </div>
      </Surface>

      <Modal
        open={showModal}
        onClose={() => !processing && setShowModal(false)}
        accent="wine"
        closeDisabled={processing}
      >
        {!success ? (
          <>
            <p className="verse-ref mb-2 text-wine">Mock Checkout</p>
            <h3 className="mb-4 text-lg font-bold text-ink">{product.name}</h3>
            <p className="mb-6 text-2xl font-bold text-wine">
              {formatPrice(product.price, product.priceLabel)}
            </p>
            <p className="mb-6 text-sm text-ink-soft">
              No real payment processed. This is satire. Your soul remains your
              own problem. Stripe integration coming never (maybe).
            </p>
            <Button
              accent="wine"
              className="w-full py-3"
              onClick={handlePurchase}
              disabled={processing}
            >
              {processing
                ? "Processing divine transaction..."
                : "Confirm Mock Purchase"}
            </Button>
          </>
        ) : (
          <div className="py-6 text-center">
            <span className="mb-4 block text-5xl">{product.icon}</span>
            <p className="mb-2 text-lg font-bold text-wine">Purchase Complete!</p>
            <p className="text-sm text-ink-soft">
              Certificate added to your vault. Salvation score updated. The
              LORD&apos;s accounting department has been notified (not really).
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}

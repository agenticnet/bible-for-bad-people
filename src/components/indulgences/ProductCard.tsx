"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import { formatPrice, generateCertificateId, INDULGENCE_PRODUCTS } from "@/lib/indulgenceProducts";
import { addIndulgencePurchase } from "@/lib/data/indulgences";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { Badge, Button, Modal, Surface } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: IndulgenceProduct;
  onPurchased: () => void;
  displayName: string;
  showContrast?: boolean;
}

const tierAccents = {
  basic: undefined,
  premium: "wine",
  ultimate: "plum",
  subscription: "slate",
} as const;

const ANCHOR_PRODUCT = INDULGENCE_PRODUCTS.find((p) => p.id === "total-absolution");
const SOUL_INSURANCE = INDULGENCE_PRODUCTS.find((p) => p.id === "soul-insurance");

export default function ProductCard({
  product,
  onPurchased,
  displayName,
  showContrast = true,
}: ProductCardProps) {
  const { user } = useAuth();
  const { openSignUp } = useAuthModal();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);
  const accent = tierAccents[product.tier];

  async function handlePurchase() {
    if (processing || !user) return;
    setProcessing(true);

    setTimeout(async () => {
      const result = await addIndulgencePurchase({
        productId: product.id,
        productName: product.name,
        purchasedAt: new Date().toISOString(),
        certificateId: generateCertificateId(),
        pricePaid: product.price,
      });

      if (addInsurance && SOUL_INSURANCE) {
        await addIndulgencePurchase({
          productId: SOUL_INSURANCE.id,
          productName: SOUL_INSURANCE.name,
          purchasedAt: new Date().toISOString(),
          certificateId: generateCertificateId(),
          pricePaid: SOUL_INSURANCE.price,
        });
      }

      setProcessing(false);
      if (result.error) return;

      setSuccess(true);
      onPurchased();

      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setAddInsurance(false);
      }, 2500);
    }, 1500);
  }

  function handleBuyClick() {
    if (!user) {
      openSignUp("indulgences", pathname);
      return;
    }
    setShowModal(true);
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
          {product.pricingTier === "recommended" && <Badge tone="wine">Popular</Badge>}
        </div>
        <h3 className="mb-1 font-semibold text-ink">{product.name}</h3>
        <p className="mb-3 text-xs text-wine">{product.tagline}</p>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-soft">
          {product.description}
        </p>
        {product.leaderboardBoost && (
          <p className="verse-ref mb-3 text-slate">
            +{product.leaderboardBoost} Salvation Score
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-wine">
            {formatPrice(product.price, product.priceLabel)}
          </span>
          <Button accent="wine" size="sm" onClick={handleBuyClick}>
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

            {showContrast && ANCHOR_PRODUCT && product.id !== ANCHOR_PRODUCT.id && (
              <p className="mb-3 text-sm text-ink-soft">
                Total Absolution runs {formatPrice(ANCHOR_PRODUCT.price)}. This{" "}
                {product.name.split(" ")[0]?.toLowerCase() ?? "item"}:{" "}
                <span className="font-semibold text-wine">
                  {formatPrice(product.price, product.priceLabel)}
                </span>
              </p>
            )}

            <p className="mb-6 text-2xl font-bold text-wine">
              {formatPrice(product.price, product.priceLabel)}
            </p>

            {SOUL_INSURANCE && product.id !== SOUL_INSURANCE.id && (
              <Surface accent="slate" accentTint className="mb-6" padding="sm">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={addInsurance}
                    onChange={(e) => setAddInsurance(e.target.checked)}
                    className="mt-1 accent-slate"
                  />
                  <div>
                    <p className="text-sm font-medium text-ink">
                      Add {SOUL_INSURANCE.name} — {formatPrice(SOUL_INSURANCE.price, SOUL_INSURANCE.priceLabel)}
                    </p>
                    <p className="text-xs text-ink-soft">
                      Covers 3 unexpected sins. Makes your main purchase feel trivial.
                    </p>
                  </div>
                </label>
              </Surface>
            )}

            <p className="mb-6 text-sm text-ink-soft">
              No real payment processed. Purchasing as {displayName || "you"}.
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
              Certificate added to your vault. Salvation score updated.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}

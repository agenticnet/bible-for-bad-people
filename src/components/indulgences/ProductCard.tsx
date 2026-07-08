"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Eye, ShoppingCart } from "lucide-react";
import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import { formatPrice, generateCertificateId, INDULGENCE_PRODUCTS } from "@/lib/indulgenceProducts";
import { addIndulgencePurchase } from "@/lib/data/indulgences";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import {
  AnchoredPrice,
  CartPressureIndicator,
  CollectibleInspectModal,
  InventoryCounter,
  isDropUnavailable,
  isProductSoldOut,
  RevealAnimation,
  useCollectiblesOptional,
} from "@/components/collectibles";
import {
  Badge,
  Button,
  FeaturedCard,
  FormActions,
  Modal,
  SuccessMoment,
  Surface,
} from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: IndulgenceProduct;
  onPurchased: () => void;
  displayName: string;
  showContrast?: boolean;
  featured?: boolean;
  hero?: boolean;
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
  featured = false,
  hero = false,
}: ProductCardProps) {
  const { user } = useAuth();
  const { openSignUp } = useAuthModal();
  const pathname = usePathname();
  const collectibles = useCollectiblesOptional();
  const [showModal, setShowModal] = useState(false);
  const [showInspect, setShowInspect] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const accent = tierAccents[product.tier];

  const soldOut = isProductSoldOut(product.id, collectibles);
  const dropBlocked = isDropUnavailable(product.id, collectibles);
  const cannotBuy = soldOut || !!dropBlocked;

  useEffect(() => {
    if (!showModal || !collectibles) return;
    const cleanup = collectibles.registerCartInterest(product.id);
    return cleanup;
  }, [showModal, collectibles, product.id]);

  async function handlePurchase() {
    if (processing || !user || cannotBuy) return;
    setProcessing(true);
    setPurchaseError(null);

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
      if (result.error) {
        setPurchaseError(result.error);
        return;
      }

      setSuccess(true);
      onPurchased();
      void collectibles?.refreshInventory();

      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setAddInsurance(false);
      }, 2500);
    }, 1500);
  }

  function handleBuyClick() {
    if (cannotBuy) return;
    if (!user) {
      openSignUp("indulgences", pathname);
      return;
    }
    if (product.isMysteryPack) {
      setShowReveal(true);
      return;
    }
    setShowModal(true);
  }

  const card = (
    <Surface
      as="article"
      accent={accent}
      className={cn(
        "flex h-full flex-col",
        accent && accentStyles[accent].borderHover,
        hero && "pt-2"
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <span className="text-3xl">{product.icon}</span>
        <div className="flex flex-wrap gap-1.5">
          <InventoryCounter productId={product.id} />
          {product.tier === "ultimate" && <Badge tone="plum">Ultimate</Badge>}
          {product.pricingTier === "recommended" && !hero && (
            <Badge tone="wine">Popular</Badge>
          )}
          {product.isMysteryPack && <Badge tone="plum">Mystery</Badge>}
        </div>
      </div>

      <CartPressureIndicator productId={product.id} />

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
      <div className="flex items-end justify-between gap-3">
        <AnchoredPrice product={product} />
        <div className="flex shrink-0 flex-col gap-2">
          <Button accent="wine" variant="ghost" size="sm" onClick={() => setShowInspect(true)}>
            <Eye className="h-4 w-4" />
            Inspect
          </Button>
          <Button
            accent="wine"
            size="lg"
            className="w-full min-w-[7rem]"
            onClick={handleBuyClick}
            disabled={cannotBuy}
          >
            <ShoppingCart className="h-4 w-4" />
            {soldOut ? "Sold Out" : dropBlocked ? "Unavailable" : "Buy"}
          </Button>
        </div>
      </div>
    </Surface>
  );

  return (
    <>
      <FeaturedCard featured={featured} hero={hero}>
        {card}
      </FeaturedCard>

      <CollectibleInspectModal
        product={product}
        open={showInspect}
        onClose={() => setShowInspect(false)}
      />

      <RevealAnimation
        product={product}
        active={showReveal}
        onComplete={() => {
          setShowReveal(false);
          onPurchased();
          void collectibles?.refreshInventory();
        }}
        onError={(msg) => {
          setShowReveal(false);
          setPurchaseError(msg);
        }}
      />

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

            <div className="mb-6">
              <AnchoredPrice product={product} size="lg" />
            </div>

            {purchaseError && (
              <p className="mb-4 text-sm text-ember">{purchaseError}</p>
            )}

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
            <FormActions
              primaryLabel={
                processing
                  ? "Processing divine transaction..."
                  : "Confirm Mock Purchase"
              }
              onPrimary={() => void handlePurchase()}
              primaryDisabled={processing || cannotBuy}
            />
          </>
        ) : (
          <SuccessMoment
            title="Purchase Complete!"
            description="Certificate added to your vault. Salvation score updated."
            icon={<span className="text-3xl">{product.icon}</span>}
          />
        )}
      </Modal>
    </>
  );
}

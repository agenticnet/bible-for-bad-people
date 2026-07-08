"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Eye, ShoppingCart } from "lucide-react";
import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import {
  AnchoredPrice,
  CartPressureIndicator,
  CollectibleInspectModal,
  InventoryCounter,
  isDropUnavailable,
  isProductSoldOut,
  MysteryReveal,
  useCollectiblesOptional,
} from "@/components/collectibles";
import CheckoutBottomSheet from "@/components/indulgences/CheckoutBottomSheet";
import {
  Badge,
  Button,
  FeaturedCard,
  Surface,
  THUMB_CTA_MIN_HEIGHT,
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
  const [showCheckout, setShowCheckout] = useState(false);
  const [showInspect, setShowInspect] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const accent = tierAccents[product.tier];

  const soldOut = isProductSoldOut(product.id, collectibles);
  const dropBlocked = isDropUnavailable(product.id, collectibles);
  const cannotBuy = soldOut || !!dropBlocked;

  useEffect(() => {
    if (!showCheckout || !collectibles) return;
    const cleanup = collectibles.registerCartInterest(product.id);
    return cleanup;
  }, [showCheckout, collectibles, product.id]);

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
    setShowCheckout(true);
  }

  const buyLabel = soldOut ? "Sold Out" : dropBlocked ? "Unavailable" : "Buy";

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

      <div className="mt-auto space-y-3">
        <AnchoredPrice product={product} />

        {purchaseError && (
          <p className="text-sm text-ember">{purchaseError}</p>
        )}

        <div className="flex gap-2">
          <Button
            accent="wine"
            variant="ghost"
            size="lg"
            className={cn("shrink-0", THUMB_CTA_MIN_HEIGHT)}
            onClick={() => setShowInspect(true)}
          >
            <Eye className="h-4 w-4" />
            Inspect
          </Button>
          <Button
            accent="wine"
            size="lg"
            className={cn("min-w-0 flex-1", THUMB_CTA_MIN_HEIGHT)}
            onClick={handleBuyClick}
            disabled={cannotBuy}
          >
            <ShoppingCart className="h-4 w-4" />
            {buyLabel}
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

      <MysteryReveal
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

      <CheckoutBottomSheet
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        product={product}
        displayName={displayName}
        addInsurance={addInsurance}
        onAddInsuranceChange={setAddInsurance}
        onPurchased={onPurchased}
        showContrast={showContrast}
      />
    </>
  );
}

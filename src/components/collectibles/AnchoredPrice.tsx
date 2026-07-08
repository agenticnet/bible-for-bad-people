"use client";

import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import { formatPrice } from "@/lib/indulgenceProducts";
import { cn } from "@/lib/utils";

interface AnchoredPriceProps {
  product: IndulgenceProduct;
  size?: "sm" | "lg";
  className?: string;
}

export default function AnchoredPrice({
  product,
  size = "sm",
  className,
}: AnchoredPriceProps) {
  const current = formatPrice(product.price, product.priceLabel);
  const anchors = [product.historicalHigh, product.estimatedMarketValue].filter(
    (v): v is number => v !== undefined && v > product.price
  );
  const topAnchor = anchors.length ? Math.max(...anchors) : undefined;
  const savingsPct =
    topAnchor && topAnchor > product.price
      ? Math.round(((topAnchor - product.price) / topAnchor) * 100)
      : null;

  const priceClass = size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {topAnchor !== undefined && (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm text-ink-soft line-through">
            Est. market value {formatPrice(topAnchor)}
          </span>
          {product.historicalHigh !== undefined &&
            product.estimatedMarketValue !== undefined &&
            product.historicalHigh !== product.estimatedMarketValue && (
              <span className="verse-ref text-ink-soft line-through">
                High {formatPrice(product.historicalHigh)}
              </span>
            )}
        </div>
      )}
      <span className={cn("font-bold text-wine", priceClass)}>{current}</span>
      {savingsPct !== null && savingsPct > 0 && (
        <span className="verse-ref text-wine">You save {savingsPct}%</span>
      )}
    </div>
  );
}

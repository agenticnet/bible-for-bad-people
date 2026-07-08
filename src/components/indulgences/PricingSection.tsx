"use client";

import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import ProductCard from "@/components/indulgences/ProductCard";
import { SectionHeader, Surface } from "@/components/ui";
import { accentStyles } from "@/components/ui/tokens";
import { cn } from "@/lib/utils";

export type PricingTier = "anchor" | "recommended" | "everyday" | "subscription";

export interface PricedProduct extends IndulgenceProduct {
  pricingTier: PricingTier;
}

interface PricingSectionProps {
  title: string;
  description?: string;
  products: PricedProduct[];
  displayName: string;
  onPurchased: () => void;
  variant?: "anchor" | "recommended" | "everyday" | "subscription";
}

const variantStyles = {
  anchor: {
    surface: "plum" as const,
    hint: "Reference pricing — for context, not your wallet.",
  },
  recommended: {
    surface: "wine" as const,
    hint: "Most sinners stop here.",
  },
  everyday: {
    surface: undefined,
    hint: undefined,
  },
  subscription: {
    surface: "slate" as const,
    hint: "Compare monthly peace of mind.",
  },
};

export default function PricingSection({
  title,
  description,
  products,
  displayName,
  onPurchased,
  variant = "everyday",
}: PricingSectionProps) {
  const styles = variantStyles[variant];

  return (
    <section className="mb-10">
      <SectionHeader
        kicker={variant === "anchor" ? "Anchor Tier" : variant === "subscription" ? "Subscriptions" : "Marketplace"}
        title={title}
        description={description ?? styles.hint}
        accent={styles.surface ?? "wine"}
      />

      {variant === "anchor" && (
        <Surface accent="plum" accentTint className="mb-4 px-4 py-3">
          <p className={cn("text-sm", accentStyles.plum.text)}>
            These prices exist so everything else looks reasonable. Capitalism meets eschatology.
          </p>
        </Surface>
      )}

      <div
        className={cn(
          "grid gap-4",
          variant === "anchor" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            displayName={displayName}
            onPurchased={onPurchased}
            showContrast={variant !== "anchor"}
          />
        ))}
      </div>
    </section>
  );
}

export function groupProductsByTier(products: PricedProduct[]) {
  return {
    anchor: products.filter((p) => p.pricingTier === "anchor"),
    recommended: products.filter((p) => p.pricingTier === "recommended"),
    everyday: products.filter((p) => p.pricingTier === "everyday"),
    subscription: products.filter((p) => p.pricingTier === "subscription"),
  };
}

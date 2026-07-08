"use client";

import {
  CollectiblesProvider,
  LiveActivityFeed,
} from "@/components/collectibles";
import { INDULGENCE_PRODUCTS } from "@/lib/indulgenceProducts";

const PRODUCT_IDS = INDULGENCE_PRODUCTS.map((p) => p.id);

export default function CollectiblesRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CollectiblesProvider productIds={PRODUCT_IDS}>
      {children}
      <LiveActivityFeed />
    </CollectiblesProvider>
  );
}

export type IndulgenceTier = "basic" | "premium" | "ultimate" | "subscription";

export type PricingTier = "anchor" | "recommended" | "everyday" | "subscription";

export type PreviewAssetType = "emoji" | "image";
export type InspectMode = "magnifier" | "3d" | "auto";

export interface PreviewAsset {
  type: PreviewAssetType;
  src: string;
}

export interface IndulgenceProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  priceLabel?: string;
  tier: IndulgenceTier;
  pricingTier?: PricingTier;
  icon: string;
  leaderboardBoost?: number;
  absolutionLevel?: "partial" | "total" | "weekend";
  estimatedMarketValue?: number;
  historicalHigh?: number;
  isMysteryPack?: boolean;
  previewAssets?: PreviewAsset[];
  inspectMode?: InspectMode;
}

export interface ProductInventoryRow {
  productId: string;
  stockTotal: number;
  stockRemaining: number;
  lowStockThreshold: number;
  isLow: boolean;
  isSoldOut: boolean;
}

export interface TimedDrop {
  productId: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface PurchaseActivityEvent {
  id: string;
  productId: string;
  productName: string;
  displayName: string;
  city: string | null;
  createdAt: string;
}

export interface MysteryReward {
  productId: string;
  productName: string;
  icon: string;
  rarity: "common" | "rare" | "legendary";
}

export interface PurchasedIndulgence {
  id: string;
  productId: string;
  productName: string;
  purchasedAt: string;
  certificateId: string;
  pricePaid: number;
}

export interface LeaderboardEntry {
  id: string;
  displayName: string;
  salvationScore: number;
  isUser?: boolean;
  badge?: string;
}

export interface UserSalvationProfile {
  displayName: string;
  salvationScore: number;
  totalSpent: number;
  purchases: PurchasedIndulgence[];
}

export type IndulgenceTier = "basic" | "premium" | "ultimate" | "subscription";

export interface IndulgenceProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  priceLabel?: string;
  tier: IndulgenceTier;
  icon: string;
  leaderboardBoost?: number;
  absolutionLevel?: "partial" | "total" | "weekend";
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

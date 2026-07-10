import type { PurchasedIndulgence, UserSalvationProfile } from "./indulgenceTypes";
import {
  calculateBaseSalvationScore,
  getBoostForProduct,
  sumPurchaseBoosts,
} from "./indulgenceProducts";
import { loadSinLog } from "./sinStorage";

const PROFILE_KEY = "indulgence-profile";

const DEFAULT_PROFILE: UserSalvationProfile = {
  displayName: "",
  salvationScore: 0,
  totalSpent: 0,
  purchases: [],
};

export function loadProfile(): UserSalvationProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE };
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserSalvationProfile) : { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: UserSalvationProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function computeSalvationScore(profile: UserSalvationProfile): number {
  const sinCount = loadSinLog().length;
  const base = calculateBaseSalvationScore(sinCount);
  const boost = sumPurchaseBoosts(profile.purchases.map((p) => p.productId));
  return Math.min(base + boost, 99);
}

export function addPurchase(
  purchase: PurchasedIndulgence,
  displayName?: string
): UserSalvationProfile {
  const profile = loadProfile();
  const updated: UserSalvationProfile = {
    ...profile,
    displayName: displayName || profile.displayName,
    purchases: [purchase, ...profile.purchases],
    totalSpent: profile.totalSpent + purchase.pricePaid,
  };
  updated.salvationScore = computeSalvationScore(updated);
  saveProfile(updated);
  return updated;
}

export function updateDisplayName(name: string): UserSalvationProfile {
  const profile = loadProfile();
  const updated = { ...profile, displayName: name.trim() };
  updated.salvationScore = computeSalvationScore(updated);
  saveProfile(updated);
  return updated;
}

export { getBoostForProduct };

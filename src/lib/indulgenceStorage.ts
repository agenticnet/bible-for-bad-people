import type { PurchasedIndulgence, UserSalvationProfile } from "./indulgenceTypes";
import { calculateBaseSalvationScore } from "./indulgenceProducts";
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
  const boost = profile.purchases.reduce((sum, p) => {
    const product = p.productId;
    if (product === "leaderboard-boost") return sum + 50;
    return sum + getBoostForProduct(product);
  }, 0);

  return Math.min(base + boost, 99);
}

function getBoostForProduct(productId: string): number {
  const boosts: Record<string, number> = {
    "total-absolution": 25,
    "weekend-pass": 5,
    "venial-coupon": 1,
    "sin-bundle-5": 3,
    "hell-free-card": 40,
    "leaderboard-boost": 50,
    "celebrity-prayer-jump": 10,
    "probably-fine-registry": 15,
    "soul-insurance": 8,
    "indulgence-subscription": 12,
  };
  return boosts[productId] ?? 0;
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

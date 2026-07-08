import type { IndulgenceProduct, LeaderboardEntry } from "./indulgenceTypes";

export const INDULGENCE_PRODUCTS: IndulgenceProduct[] = [
  {
    id: "total-absolution",
    name: "Total Absolution™ Certificate",
    tagline: "Wipe the slate. All of it. Probably.",
    description:
      "Official-looking digital certificate granting Total Absolution for past, present, and future sins. Does not apply to tweets, group chats, or things your ex has screenshots of. Non-refundable in this life or the next.",
    price: 999,
    tier: "ultimate",
    pricingTier: "anchor",
    icon: "📜",
    absolutionLevel: "total",
    leaderboardBoost: 25,
  },
  {
    id: "weekend-pass",
    name: "Weekend Mortal Sin Pass",
    tagline: "Fri–Sun only. Plan accordingly.",
    description:
      "Mortal sins committed between 5 PM Friday and 11:59 PM Sunday are pre-forgiven. Monday morning regret sold separately.",
    price: 49,
    tier: "premium",
    pricingTier: "recommended",
    icon: "🎫",
    absolutionLevel: "weekend",
    leaderboardBoost: 5,
  },
  {
    id: "venial-coupon",
    name: "Single Venial Sin Coupon",
    tagline: "One petty sin, zero guilt.",
    description:
      "Redeem for one approved venial sin: white lie, minor theft from office fridge, subtweet. Expires never, shame lasts forever.",
    price: 4.99,
    tier: "basic",
    pricingTier: "everyday",
    icon: "🎟️",
    absolutionLevel: "partial",
    leaderboardBoost: 1,
  },
  {
    id: "sin-bundle-5",
    name: "Petty Sin Bundle (5-Pack)",
    tagline: "Bulk absolution for the chronically petty.",
    description:
      "Five venial sin coupons at a discount. Perfect for people who checked off the entire daily sin checklist before noon.",
    price: 19.99,
    tier: "basic",
    pricingTier: "everyday",
    icon: "📦",
    absolutionLevel: "partial",
    leaderboardBoost: 3,
  },
  {
    id: "hell-free-card",
    name: "Get Out of Hell Free Card",
    tagline: "Limited edition. Legally distinct from Monopoly.",
    description:
      "One emergency exit from eternal damnation. Single use. Cannot be combined with other offers. Lucifer reserves the right to reject.",
    price: 666,
    tier: "ultimate",
    pricingTier: "anchor",
    icon: "🃏",
    leaderboardBoost: 40,
  },
  {
    id: "leaderboard-boost",
    name: "Salvation Score Boost (+50)",
    tagline: "Buy your way toward sainthood.",
    description:
      "Instantly increase your Least Likely to Go to Hell ranking. No virtue required. The medieval church would be proud and horrified.",
    price: 29.99,
    tier: "premium",
    pricingTier: "recommended",
    icon: "📈",
    leaderboardBoost: 50,
  },
  {
    id: "celebrity-prayer-jump",
    name: "Celebrity Prayer Queue Jump",
    tagline: "Skip 400 years of wait time.",
    description:
      "Your prayer goes to the front of the Divine Support Desk queue. Same automated response, but faster. VIP suffering.",
    price: 199,
    tier: "premium",
    pricingTier: "everyday",
    icon: "⭐",
    leaderboardBoost: 10,
  },
  {
    id: "probably-fine-registry",
    name: '"Probably Fine" Name Registry',
    tagline: "Officially probably fine.",
    description:
      "Your name entered into the Heavenly Probably Fine Registry™. Not canonized, not condemned — just vibes-based salvation.",
    price: 79,
    tier: "premium",
    pricingTier: "everyday",
    icon: "✅",
    leaderboardBoost: 15,
  },
  {
    id: "soul-insurance",
    name: "Premium Soul Insurance",
    tagline: "$0 deductible on minor damnation.",
    description:
      "Covers up to 3 unexpected sins per month. Excludes pre-existing conditions like 'being yourself' and 'Twitter.'",
    price: 14.99,
    priceLabel: "$14.99/mo",
    tier: "subscription",
    pricingTier: "subscription",
    icon: "🛡️",
    leaderboardBoost: 8,
  },
  {
    id: "indulgence-subscription",
    name: "Indulgence+ Subscription",
    tagline: "Forgiveness as a service.",
    description:
      "Monthly auto-absolution for low-tier sins, 10% off all marketplace items, and a badge that says you're trying (you're not).",
    price: 9.99,
    priceLabel: "$9.99/mo",
    tier: "subscription",
    pricingTier: "subscription",
    icon: "👑",
    leaderboardBoost: 12,
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "lb-1", displayName: "KarenWhoReturnsCarts", salvationScore: 98, badge: "Cart Saint" },
  { id: "lb-2", displayName: "ActuallyTipped25Percent", salvationScore: 94, badge: "Service Industry Hero" },
  { id: "lb-3", displayName: "NeverReplyAllGuy", salvationScore: 91, badge: "Corporate Angel" },
  { id: "lb-4", displayName: "PickedUpDogPoopTwice", salvationScore: 88, badge: "Sidewalk Savior" },
  { id: "lb-5", displayName: "ApologizedFirst", salvationScore: 85, badge: "Conflict Avoider" },
  { id: "lb-6", displayName: "DonatedAndDidntPost", salvationScore: 82, badge: "Quiet Giver" },
  { id: "lb-7", displayName: "MutedNotBlocked", salvationScore: 78, badge: "Peacekeeper" },
  { id: "lb-8", displayName: "ReturnedBorrowedBook", salvationScore: 74, badge: "Miracle Worker" },
  { id: "lb-9", displayName: "DidTheGroupProject", salvationScore: 70, badge: "Academic Martyr" },
  { id: "lb-10", displayName: "SaidNoToMultiLevelMarketing", salvationScore: 67, badge: "Pyramid Resister" },
  { id: "lb-11", displayName: "StillHasExsNetflix", salvationScore: 42, badge: "Streaming Sinner" },
  { id: "lb-12", displayName: "ReheatedFishInOffice", salvationScore: 28, badge: "Break Room Demon" },
  { id: "lb-13", displayName: "GhostedAfter3Dates", salvationScore: 19, badge: "Haunting Pending" },
  { id: "lb-14", displayName: "SoldWeddingGiftOnFB", salvationScore: 11, badge: "Marketplace of Souls" },
  { id: "lb-15", displayName: "DoubleDippedAtFuneral", salvationScore: 3, badge: "Condemned (Probably)" },
];

export function generateCertificateId(): string {
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `IND-${num}`;
}

export function formatPrice(price: number, label?: string): string {
  if (label) return label;
  return price >= 100 ? `$${price.toFixed(0)}` : `$${price.toFixed(2)}`;
}

export function calculateBaseSalvationScore(sinCount: number): number {
  const base = 50;
  const penalty = Math.min(sinCount * 2, 45);
  return Math.max(base - penalty, 5);
}

export function buildLeaderboard(
  userName: string | null,
  userScore: number,
  mockEntries: LeaderboardEntry[] = MOCK_LEADERBOARD
): LeaderboardEntry[] {
  const entries = [...mockEntries];

  if (userName && userScore > 0) {
    entries.push({
      id: "user-entry",
      displayName: userName,
      salvationScore: userScore,
      isUser: true,
      badge: "Paid Sinner",
    });
  }

  return entries.sort((a, b) => b.salvationScore - a.salvationScore);
}

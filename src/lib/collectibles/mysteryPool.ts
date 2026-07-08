import type { MysteryReward } from "@/lib/indulgenceTypes";

interface WeightedReward extends MysteryReward {
  weight: number;
}

const MYSTERY_POOL: WeightedReward[] = [
  {
    productId: "venial-coupon",
    productName: "Single Venial Sin Coupon",
    icon: "🎟️",
    rarity: "common",
    weight: 45,
  },
  {
    productId: "sin-bundle-5",
    productName: "Petty Sin Bundle (5-Pack)",
    icon: "📦",
    rarity: "common",
    weight: 25,
  },
  {
    productId: "weekend-pass",
    productName: "Weekend Mortal Sin Pass",
    icon: "🎫",
    rarity: "rare",
    weight: 18,
  },
  {
    productId: "leaderboard-boost",
    productName: "Salvation Score Boost (+50)",
    icon: "📈",
    rarity: "rare",
    weight: 10,
  },
  {
    productId: "hell-free-card",
    productName: "Get Out of Hell Free Card",
    icon: "🃏",
    rarity: "legendary",
    weight: 2,
  },
];

export function rollMysteryReward(): MysteryReward {
  const total = MYSTERY_POOL.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;

  for (const item of MYSTERY_POOL) {
    roll -= item.weight;
    if (roll <= 0) {
      return {
        productId: item.productId,
        productName: item.productName,
        icon: item.icon,
        rarity: item.rarity,
      };
    }
  }

  const fallback = MYSTERY_POOL[0];
  return {
    productId: fallback.productId,
    productName: fallback.productName,
    icon: fallback.icon,
    rarity: fallback.rarity,
  };
}

export { MYSTERY_POOL };

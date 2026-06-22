export type SmiteTarget =
  | "traffic"
  | "boss"
  | "neighbor"
  | "landlord"
  | "ex"
  | "slow-walker"
  | "coworker"
  | "customer"
  | "custom";

export type PlagueType =
  | "locusts"
  | "frogs"
  | "boils"
  | "darkness"
  | "hail"
  | "pestilence"
  | "blood-river"
  | "gnats"
  | "livestock-death"
  | "firstborn-wifi";

export type SmiteTier = "free" | "premium";

export interface SmiteRecord {
  id: string;
  target: SmiteTarget;
  targetLabel: string;
  customName?: string;
  plague: PlagueType;
  tier: SmiteTier;
  result: string;
  visualDescription?: string;
  smoteAt: string;
  pricePaid: number;
}

export const TARGET_LABELS: Record<SmiteTarget, string> = {
  traffic: "Traffic",
  boss: "Your Boss",
  neighbor: "That Neighbor",
  landlord: "Your Landlord",
  ex: "Your Ex",
  "slow-walker": "Slow Walker",
  coworker: "Annoying Coworker",
  customer: "Terrible Customer",
  custom: "Custom Target",
};

export const TARGET_ICONS: Record<SmiteTarget, string> = {
  traffic: "🚗",
  boss: "👔",
  neighbor: "🏠",
  landlord: "🔑",
  ex: "💔",
  "slow-walker": "🐌",
  coworker: "💼",
  customer: "🛒",
  custom: "🎯",
};

export const PLAGUE_LABELS: Record<PlagueType, string> = {
  locusts: "Locusts",
  frogs: "Frogs",
  boils: "Boils",
  darkness: "Three Days Darkness",
  hail: "Fire & Hail",
  pestilence: "Pestilence",
  "blood-river": "River of Blood",
  gnats: "Gnats Everywhere",
  "livestock-death": "Dead Livestock",
  "firstborn-wifi": "Firstborn WiFi Outage",
};

export const PLAGUE_ICONS: Record<PlagueType, string> = {
  locusts: "🦗",
  frogs: "🐸",
  boils: "🤢",
  darkness: "🌑",
  hail: "🌨️",
  pestilence: "☠️",
  "blood-river": "🩸",
  gnats: "🪰",
  "livestock-death": "🐄",
  "firstborn-wifi": "📵",
};

export const FREE_DAILY_LIMIT = 3;
export const PREMIUM_PRICE = 2.99;

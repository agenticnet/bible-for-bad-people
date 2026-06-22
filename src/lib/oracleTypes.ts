export type OmenType = "cursed" | "doomed" | "chaotic" | "bleak" | "cursed-blessing";

export interface DoomCard {
  id: string;
  name: string;
  symbol: string;
  omen: OmenType;
  tagline: string;
  reading: string;
}

export interface DailyReading {
  dateKey: string;
  cards: DoomCard[];
  doomScore: number;
  summary: string;
  revealed: boolean;
}

export const OMEN_LABELS: Record<OmenType, string> = {
  cursed: "Cursed",
  doomed: "Doomed",
  chaotic: "Chaotic",
  bleak: "Bleak",
  "cursed-blessing": "Cursed Blessing",
};

export const SPREAD_LABELS = ["What You've Done", "What's Coming", "The Verdict"];

export type SinCategory =
  | "work"
  | "social"
  | "digital"
  | "petty-crime"
  | "relationship"
  | "selfish"
  | "food"
  | "lazy"
  | "passive-aggressive";

export type SinDifficulty = "trivial" | "mild" | "moderate";

export type SinSource = "library" | "daily" | "custom" | "community";

export interface SinEntry {
  id: string;
  petty: string;
  translation: string;
  category: SinCategory;
  difficulty: SinDifficulty;
}

export interface SinLogItem {
  id: string;
  sinId?: string;
  petty: string;
  translation: string;
  completedAt: string;
  source: SinSource;
}

export interface ContributedSin extends SinEntry {
  submittedAt: string;
}

export const CATEGORY_LABELS: Record<SinCategory, string> = {
  work: "Workplace Wickedness",
  social: "Social Sabotage",
  digital: "Digital Depravity",
  "petty-crime": "Petty Crime",
  relationship: "Relationship Ruin",
  selfish: "Selfish Acts",
  food: "Gluttony & Food Crimes",
  lazy: "Sloth & Laziness",
  "passive-aggressive": "Passive-Aggressive Prophecy",
};

export const DIFFICULTY_LABELS: Record<SinDifficulty, string> = {
  trivial: "Trivial",
  mild: "Mildly Damned",
  moderate: "Moderately Condemned",
};

export type SinTab = "daily" | "translate" | "log" | "contribute" | "library";

export type PassageTag =
  | "violent"
  | "weird"
  | "contradictory"
  | "absurd"
  | "cruel"
  | "bizarre-laws"
  | "skipped-in-church"
  | "sexual"
  | "genocide";

export interface BiblePassage {
  id: string;
  reference: string;
  book: string;
  excerpt: string;
  tldr: string;
  modernWorld: string;
  tags: PassageTag[];
}

export const TAG_LABELS: Record<PassageTag, string> = {
  violent: "Violent",
  weird: "Weird",
  contradictory: "Contradictory",
  absurd: "Absurd",
  cruel: "Cruel",
  "bizarre-laws": "Bizarre Laws",
  "skipped-in-church": "Skipped in Church",
  sexual: "Sexual",
  genocide: "Genocide",
};

export const ALL_TAGS = Object.keys(TAG_LABELS) as PassageTag[];

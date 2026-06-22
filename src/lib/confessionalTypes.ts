export type ConfessionSort = "hot" | "new" | "absolved" | "condemned";

export type VoteType = "absolve" | "condemn";

export interface Confession {
  id: string;
  content: string;
  absolveVotes: number;
  condemnVotes: number;
  createdAt: string;
  authorLabel: string;
  isUser?: boolean;
}

export const SORT_LABELS: Record<ConfessionSort, string> = {
  hot: "Hot",
  new: "New",
  absolved: "Most Absolved",
  condemned: "Most Condemned",
};

export function getVerdict(absolve: number, condemn: number): "absolved" | "condemned" | "split" {
  if (absolve > condemn * 1.5) return "absolved";
  if (condemn > absolve * 1.5) return "condemned";
  return "split";
}

export function getScore(absolve: number, condemn: number): number {
  return absolve - condemn;
}

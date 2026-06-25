import type { Confession, ConfessionSort } from "./confessionalTypes";

export function sortConfessions(
  confessions: Confession[],
  sort: ConfessionSort
): Confession[] {
  const sorted = [...confessions];

  switch (sort) {
    case "new":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "absolved":
      return sorted.sort((a, b) => b.absolveVotes - a.absolveVotes);
    case "condemned":
      return sorted.sort((a, b) => b.condemnVotes - a.condemnVotes);
    case "hot":
    default:
      return sorted.sort((a, b) => {
        const engA = a.absolveVotes + a.condemnVotes;
        const engB = b.absolveVotes + b.condemnVotes;
        return engB - engA;
      });
  }
}

export function getLeaderboardTop(
  confessions: Confession[],
  type: "absolved" | "condemned",
  limit = 5
): Confession[] {
  if (type === "absolved") {
    return [...confessions]
      .sort((a, b) => b.absolveVotes - a.absolveVotes)
      .slice(0, limit);
  }
  return [...confessions]
    .sort((a, b) => b.condemnVotes - a.condemnVotes)
    .slice(0, limit);
}

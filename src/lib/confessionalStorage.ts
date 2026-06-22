import type { Confession, ConfessionSort, VoteType } from "./confessionalTypes";
import { SEED_CONFESSIONS } from "./confessionalPosts";

const USER_POSTS_KEY = "confessional-posts";
const VOTES_KEY = "confessional-votes";
const VOTE_COUNTS_KEY = "confessional-vote-counts";

export function loadVoteCounts(): Record<string, { absolveVotes: number; condemnVotes: number }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VOTE_COUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveVoteCounts(
  counts: Record<string, { absolveVotes: number; condemnVotes: number }>
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VOTE_COUNTS_KEY, JSON.stringify(counts));
  } catch {
    // ignore
  }
}

function applyVoteCounts(confessions: Confession[]): Confession[] {
  const counts = loadVoteCounts();
  return confessions.map((c) => {
    const override = counts[c.id];
    if (!override) return c;
    return { ...c, ...override };
  });
}

export function loadUserPosts(): Confession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USER_POSTS_KEY);
    return raw ? (JSON.parse(raw) as Confession[]) : [];
  } catch {
    return [];
  }
}

export function saveUserPosts(posts: Confession[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_POSTS_KEY, JSON.stringify(posts));
  } catch {
    // ignore
  }
}

export function addUserPost(post: Confession): Confession[] {
  const posts = loadUserPosts();
  const updated = [post, ...posts];
  saveUserPosts(updated);
  return updated;
}

export function loadVotes(): Record<string, VoteType> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VOTES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, VoteType>) : {};
  } catch {
    return {};
  }
}

export function saveVotes(votes: Record<string, VoteType>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch {
    // ignore
  }
}

export function getAllConfessions(): Confession[] {
  const userPosts = loadUserPosts();
  return applyVoteCounts([...userPosts, ...SEED_CONFESSIONS]);
}

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

export function castVote(
  confessionId: string,
  vote: VoteType,
  allConfessions: Confession[]
): { confessions: Confession[]; userVote: VoteType | null } {
  const votes = loadVotes();
  const previous = votes[confessionId];

  const updatedConfessions = allConfessions.map((c) => {
    if (c.id !== confessionId) return c;

    let absolve = c.absolveVotes;
    let condemn = c.condemnVotes;

    if (previous === "absolve") absolve--;
    if (previous === "condemn") condemn--;

    if (previous === vote) {
      delete votes[confessionId];
      return { ...c, absolveVotes: absolve, condemnVotes: condemn };
    }

    if (vote === "absolve") absolve++;
    else condemn++;

    votes[confessionId] = vote;
    return { ...c, absolveVotes: absolve, condemnVotes: condemn };
  });

  saveVotes(votes);

  const counts = loadVoteCounts();
  const updated = updatedConfessions.find((c) => c.id === confessionId);
  if (updated) {
    counts[confessionId] = {
      absolveVotes: updated.absolveVotes,
      condemnVotes: updated.condemnVotes,
    };
    saveVoteCounts(counts);
  }

  const userPosts = loadUserPosts();
  const updatedUserPosts = userPosts.map((p) => {
    const match = updatedConfessions.find((c) => c.id === p.id);
    return match ?? p;
  });
  saveUserPosts(updatedUserPosts);

  return {
    confessions: updatedConfessions,
    userVote: votes[confessionId] ?? null,
  };
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

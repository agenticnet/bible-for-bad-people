import type { Confession } from "./confessionalTypes";

const USER_POSTS_KEY = "confessional-posts";

export function loadUserPosts(): Confession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USER_POSTS_KEY);
    return raw ? (JSON.parse(raw) as Confession[]) : [];
  } catch {
    return [];
  }
}

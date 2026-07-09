/** Same-origin relative path only — blocks open redirects via `//` or `@`. */
export function safeRedirectPath(next: string | null | undefined): string {
  if (!next) return "/";

  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/";
  if (trimmed.includes("\\") || trimmed.includes("@")) return "/";

  return trimmed;
}

export const DEFAULT_POST_SIGNUP_PATH = "/oracle?welcome=1";

/** Use explicit chamber upsell `next` when provided; otherwise Oracle welcome. */
export function postSignupRedirectPath(next: string | null | undefined): string {
  const safe = safeRedirectPath(next);
  if (safe !== "/") return safe;
  return DEFAULT_POST_SIGNUP_PATH;
}

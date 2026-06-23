/** Same-origin relative path only — blocks open redirects via `//` or `@`. */
export function safeRedirectPath(next: string | null | undefined): string {
  if (!next) return "/";

  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/";
  if (trimmed.includes("\\") || trimmed.includes("@")) return "/";

  return trimmed;
}

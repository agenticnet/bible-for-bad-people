export const WELCOME_COMPLETE_KEY = "bfb-welcome-complete";

export function isWelcomeComplete(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(WELCOME_COMPLETE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markWelcomeComplete(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WELCOME_COMPLETE_KEY, "1");
  } catch {
    // ignore
  }
}

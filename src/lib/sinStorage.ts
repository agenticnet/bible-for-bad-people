import type { ContributedSin, SinLogItem } from "./sinTypes";

const LOG_KEY = "sin-log";
const COMMUNITY_KEY = "sin-community";
const DAILY_DONE_PREFIX = "sin-daily-done";

export function loadSinLog(): SinLogItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as SinLogItem[]) : [];
  } catch {
    return [];
  }
}

export function saveSinLog(log: SinLogItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch {
    // ignore
  }
}

export function addToSinLog(item: SinLogItem): SinLogItem[] {
  const log = loadSinLog();
  const updated = [item, ...log];
  saveSinLog(updated);
  return updated;
}

export function loadCommunitySins(): ContributedSin[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    return raw ? (JSON.parse(raw) as ContributedSin[]) : [];
  } catch {
    return [];
  }
}

export function saveCommunitySin(sin: ContributedSin): ContributedSin[] {
  const existing = loadCommunitySins();
  const updated = [sin, ...existing];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(COMMUNITY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return updated;
}

export function loadDailyCompleted(dateKey: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(`${DAILY_DONE_PREFIX}-${dateKey}`);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveDailyCompleted(dateKey: string, ids: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${DAILY_DONE_PREFIX}-${dateKey}`,
      JSON.stringify([...ids])
    );
  } catch {
    // ignore
  }
}

export function markDailySinDone(dateKey: string, sinId: string): Set<string> {
  const completed = loadDailyCompleted(dateKey);
  completed.add(sinId);
  saveDailyCompleted(dateKey, completed);
  return completed;
}

export function unmarkDailySinDone(dateKey: string, sinId: string): Set<string> {
  const completed = loadDailyCompleted(dateKey);
  completed.delete(sinId);
  saveDailyCompleted(dateKey, completed);
  return completed;
}

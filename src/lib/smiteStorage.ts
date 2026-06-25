import type { SmiteRecord } from "./smiteTypes";
import { getDateKey } from "./dateKey";

const HISTORY_KEY = "smite-history";
const DAILY_COUNT_PREFIX = "smite-daily-count";

export function loadSmiteHistory(): SmiteRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as SmiteRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveSmiteHistory(history: SmiteRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function addSmiteRecord(record: SmiteRecord): SmiteRecord[] {
  const history = loadSmiteHistory();
  const updated = [record, ...history].slice(0, 50);
  saveSmiteHistory(updated);
  return updated;
}

export function getDailySmiteCount(dateKey = getDateKey()): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(`${DAILY_COUNT_PREFIX}-${dateKey}`);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementDailySmiteCount(dateKey = getDateKey()): number {
  const count = getDailySmiteCount(dateKey) + 1;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`${DAILY_COUNT_PREFIX}-${dateKey}`, String(count));
    } catch {
      // ignore
    }
  }
  return count;
}

export function getTotalSpentOnSmite(): number {
  return loadSmiteHistory()
    .filter((r) => r.tier === "premium")
    .reduce((sum, r) => sum + r.pricePaid, 0);
}

import { loadUserPosts } from "@/lib/confessionalStorage";
import { loadProfile } from "@/lib/indulgenceStorage";
import { loadSinLog } from "@/lib/sinStorage";
import { loadSmiteHistory } from "@/lib/smiteStorage";
import { loadReading, STORAGE_KEY_PREFIX } from "@/lib/mockOracleDeck";
import { getDateKey } from "@/lib/dateKey";

export interface LocalDataSummary {
  sinCount: number;
  smiteCount: number;
  confessionCount: number;
  oracleRevealed: boolean;
  oracleDoomScore: number | null;
  indulgenceDraftCount: number;
  chatPreviewUsed: boolean;
}

const CHAT_PREVIEW_KEY = "bfb-chat-preview-used";

export function getLocalDataSummary(): LocalDataSummary {
  if (typeof window === "undefined") {
    return {
      sinCount: 0,
      smiteCount: 0,
      confessionCount: 0,
      oracleRevealed: false,
      oracleDoomScore: null,
      indulgenceDraftCount: 0,
      chatPreviewUsed: false,
    };
  }

  const dateKey = getDateKey();
  const oracleReading = loadReading(dateKey);
  const indulgenceProfile = loadProfile();

  return {
    sinCount: loadSinLog().length,
    smiteCount: loadSmiteHistory().length,
    confessionCount: loadUserPosts().length,
    oracleRevealed: oracleReading?.revealed ?? false,
    oracleDoomScore: oracleReading?.revealed ? oracleReading.doomScore : null,
    indulgenceDraftCount: indulgenceProfile.purchases.length,
    chatPreviewUsed: localStorage.getItem(CHAT_PREVIEW_KEY) === "1",
  };
}

export function markChatPreviewUsed(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHAT_PREVIEW_KEY, "1");
  } catch {
    // ignore
  }
}

export function countOracleReadings(): number {
  if (typeof window === "undefined") return 0;
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_KEY_PREFIX)) count++;
  }
  return count;
}

export function getTotalLocalItems(): number {
  const summary = getLocalDataSummary();
  return (
    summary.sinCount +
    summary.smiteCount +
    summary.confessionCount +
    countOracleReadings() +
    summary.indulgenceDraftCount
  );
}

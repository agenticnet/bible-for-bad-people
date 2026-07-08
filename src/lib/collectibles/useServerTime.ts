"use client";

import { useCallback, useEffect, useState } from "react";

interface ServerTimeResponse {
  serverTime: string;
  unixMs: number;
}

const SYNC_INTERVAL_MS = 60_000;

async function fetchServerTime(): Promise<ServerTimeResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const endpoints = [
    supabaseUrl ? `${supabaseUrl}/functions/v1/server-time` : null,
    "/api/server-time",
  ].filter(Boolean) as string[];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        return (await res.json()) as ServerTimeResponse;
      }
    } catch {
      // try next endpoint
    }
  }

  const now = Date.now();
  return { serverTime: new Date(now).toISOString(), unixMs: now };
}

export function useServerTime() {
  const [offsetMs, setOffsetMs] = useState(0);
  const [isSynced, setIsSynced] = useState(false);

  const sync = useCallback(async () => {
    const { unixMs } = await fetchServerTime();
    setOffsetMs(unixMs - Date.now());
    setIsSynced(true);
  }, []);

  useEffect(() => {
    void sync();
    const interval = setInterval(() => void sync(), SYNC_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [sync]);

  const now = () => Date.now() + offsetMs;

  return { offsetMs, isSynced, now, resync: sync };
}

export function useDropCountdown(
  startsAt: string | undefined,
  endsAt: string | undefined,
  offsetMs: number
) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  void tick;

  if (!startsAt || !endsAt) {
    return {
      phase: "none" as const,
      label: "",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEndingSoon: false,
    };
  }

  const now = Date.now() + offsetMs;
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();

  if (now < start) {
    const remaining = start - now;
    const days = Math.floor(remaining / 86_400_000);
    const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
    const minutes = Math.floor((remaining % 3_600_000) / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1000);
    return {
      phase: "upcoming" as const,
      label: "Drop starts in",
      days,
      hours,
      minutes,
      seconds,
      isEndingSoon: false,
    };
  }

  if (now >= end) {
    return {
      phase: "ended" as const,
      label: "Drop ended",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEndingSoon: false,
    };
  }

  const remaining = end - now;
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  const isEndingSoon = remaining <= 3_600_000;

  return {
    phase: "live" as const,
    label: "Drop ends in",
    days,
    hours,
    minutes,
    seconds,
    isEndingSoon,
  };
}

export function useInspectTracking() {
  const [inspectDurationMs, setInspectDurationMs] = useState(0);
  const [isInspecting, setIsInspecting] = useState(false);

  useEffect(() => {
    if (!isInspecting) return;
    const start = Date.now();
    const interval = setInterval(() => {
      setInspectDurationMs((prev) => prev + (Date.now() - start));
    }, 500);
    return () => clearInterval(interval);
  }, [isInspecting]);

  return {
    inspectDurationMs,
    startInspecting: () => setIsInspecting(true),
    stopInspecting: () => setIsInspecting(false),
  };
}

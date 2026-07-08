"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  loadOnboardingDraft,
  saveOnboardingDraft,
  type OnboardingDraft,
} from "@/lib/auth/onboardingDraft";
import { createDefaultDraft } from "@/lib/auth/smartDefaults";

interface OnboardingDraftContextValue {
  draft: OnboardingDraft;
  updateDraft: (patch: Partial<OnboardingDraft>) => void;
  resetDraft: () => void;
}

const OnboardingDraftContext = createContext<OnboardingDraftContextValue | null>(null);

export function OnboardingDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(createDefaultDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDraft(loadOnboardingDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveOnboardingDraft(draft);
  }, [draft, hydrated]);

  const updateDraft = useCallback((patch: Partial<OnboardingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => {
    const defaults = createDefaultDraft();
    setDraft(defaults);
    saveOnboardingDraft(defaults);
  }, []);

  const value = useMemo(
    () => ({ draft, updateDraft, resetDraft }),
    [draft, updateDraft, resetDraft]
  );

  return (
    <OnboardingDraftContext.Provider value={value}>{children}</OnboardingDraftContext.Provider>
  );
}

export function useOnboardingDraft(): OnboardingDraftContextValue {
  const context = useContext(OnboardingDraftContext);
  if (!context) {
    throw new Error("useOnboardingDraft must be used within OnboardingDraftProvider");
  }
  return context;
}

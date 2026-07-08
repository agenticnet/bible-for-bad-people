"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { LossContext } from "@/lib/auth/upsellCopy";

interface AuthModalState {
  open: boolean;
  context: LossContext;
  nextPath: string;
}

interface AuthModalContextValue {
  openSignUp: (context?: LossContext, nextPath?: string) => void;
  closeSignUp: () => void;
  modalState: AuthModalState;
}

const defaultState: AuthModalState = {
  open: false,
  context: "generic",
  nextPath: "/",
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<AuthModalState>(defaultState);

  const openSignUp = useCallback((context: LossContext = "generic", nextPath = "/") => {
    setModalState({ open: true, context, nextPath });
  }, []);

  const closeSignUp = useCallback(() => {
    setModalState((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo(
    () => ({ openSignUp, closeSignUp, modalState }),
    [openSignUp, closeSignUp, modalState]
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal(): AuthModalContextValue {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
}

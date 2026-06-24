"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ReducedMotionContext = createContext(true);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    function onChange(event: MediaQueryListEvent) {
      setReducedMotion(event.matches);
    }

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <ReducedMotionContext.Provider value={reducedMotion}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion(): boolean {
  return useContext(ReducedMotionContext);
}

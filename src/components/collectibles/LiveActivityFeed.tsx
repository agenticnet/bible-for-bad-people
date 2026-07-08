"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Surface } from "@/components/ui";
import { fadeUp, resolveTransition, transition } from "@/lib/motion";
import { useCollectiblesOptional } from "./CollectiblesProvider";
import type { PurchaseActivityEvent } from "@/lib/indulgenceTypes";

const TOAST_TTL_MS = 5000;
const MAX_VISIBLE = 3;

interface ToastItem extends PurchaseActivityEvent {
  toastKey: string;
}

export default function LiveActivityFeed() {
  const ctx = useCollectiblesOptional();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!ctx?.activityEvents.length) return;

    const fresh = ctx.activityEvents.filter((e) => !seenIds.has(e.id));
    if (!fresh.length) return;

    setSeenIds((prev) => {
      const next = new Set(prev);
      fresh.forEach((e) => next.add(e.id));
      return next;
    });

    const newToasts = fresh.map((e) => ({
      ...e,
      toastKey: `${e.id}-${Date.now()}`,
    }));

    setToasts((prev) => [...newToasts, ...prev].slice(0, MAX_VISIBLE));
  }, [ctx?.activityEvents, seenIds]);

  useEffect(() => {
    if (!toasts.length) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(0, -1));
    }, TOAST_TTL_MS);
    return () => clearTimeout(timer);
  }, [toasts]);

  if (!ctx) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-24 left-4 z-40 flex max-w-sm flex-col-reverse gap-2 md:bottom-24 md:left-auto md:right-6"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.toastKey}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={resolveTransition(transition.base, false)}
          >
            <Surface accent="wine" accentTint className="px-4 py-3 shadow-lg" padding="sm">
              <p className="text-contain text-sm text-ink">
                <span className="font-semibold">{toast.displayName}</span>
                {toast.city ? ` in ${toast.city}` : ""} just acquired{" "}
                <span className="text-wine">{toast.productName}</span>
              </p>
            </Surface>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

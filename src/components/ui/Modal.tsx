"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TOUCH_TARGET_MIN } from "@/lib/ux/constraints";
import {
  fadeIn,
  fadeUpScale,
  resolveTransition,
  resolveVariants,
  transition,
} from "@/lib/motion";
import { accentStyles, focusVisibleRing, surfaceBase, type Accent } from "./tokens";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  accent?: Accent;
  /** Accessible name — required for screen readers */
  title: string;
  children: React.ReactNode;
  className?: string;
  closeDisabled?: boolean;
}

export default function Modal({
  open,
  onClose,
  accent = "wine",
  title,
  children,
  className,
  closeDisabled = false,
}: ModalProps) {
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropVariants = resolveVariants(fadeIn, reducedMotion);
  const panelVariants = resolveVariants(fadeUpScale, reducedMotion);
  const enterT = resolveTransition(transition.base, reducedMotion);

  useFocusTrap(open, panelRef);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !closeDisabled) onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, closeDisabled, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="absolute inset-0 bg-parchment/80"
            variants={backdropVariants}
            transition={enterT}
            onClick={closeDisabled ? undefined : onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            className={cn(
              surfaceBase,
              "relative z-10 w-full max-w-md p-6 outline-none",
              accentStyles[accent].borderMuted,
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            transition={enterT}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={closeDisabled}
              className={cn(
                "absolute top-4 end-4 inline-flex items-center justify-center rounded-sm text-ink-soft transition-colors hover:text-ink disabled:opacity-50",
                TOUCH_TARGET_MIN,
                focusVisibleRing
              )}
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  BOTTOM_SHEET_HEIGHT,
  SAFE_BOTTOM,
  TOUCH_TARGET_MIN,
  Z_BOTTOM_SHEET,
} from "@/lib/ux/constraints";
import {
  fadeIn,
  resolveTransition,
  resolveVariants,
  spring,
  transition,
} from "@/lib/motion";
import { accentStyles, focusVisibleRing, surfaceBase, type Accent } from "./tokens";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  accent?: Accent;
  /** Accessible name — required for screen readers */
  title: string;
  children: React.ReactNode;
  className?: string;
  closeDisabled?: boolean;
  snapHeight?: string;
}

const DISMISS_VELOCITY = 400;
const DISMISS_OFFSET = 120;

export default function BottomSheet({
  open,
  onClose,
  accent = "wine",
  title,
  children,
  className,
  closeDisabled = false,
  snapHeight = BOTTOM_SHEET_HEIGHT,
}: BottomSheetProps) {
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropVariants = resolveVariants(fadeIn, reducedMotion);
  const enterT = resolveTransition(transition.base, reducedMotion);
  const dragT = resolveTransition(spring.gentle, reducedMotion);

  useFocusTrap(open, panelRef);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (closeDisabled) return;
      if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY) {
        onClose();
      }
    },
    [closeDisabled, onClose]
  );

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
          className={cn("fixed inset-0", Z_BOTTOM_SHEET)}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="absolute inset-0 bg-binding/60 backdrop-blur-sm"
            variants={backdropVariants}
            transition={enterT}
            onClick={closeDisabled ? undefined : onClose}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            drag={reducedMotion ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className={cn(
              "absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl outline-none",
              surfaceBase,
              snapHeight,
              SAFE_BOTTOM,
              accentStyles[accent].borderMuted,
              "border-b-0",
              className
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={dragT}
          >
            <div className="flex shrink-0 justify-center py-3">
              <div className="h-1 w-10 rounded-full bg-rule" aria-hidden />
            </div>

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

            <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

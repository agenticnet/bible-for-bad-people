"use client";

import { useCallback, useRef, useState } from "react";
import { motion, type PanInfo } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { THUMB_CTA_MIN_HEIGHT } from "@/lib/ux/constraints";
import Button from "./Button";

interface TearSliderProps {
  label?: string;
  onComplete: () => void;
  className?: string;
}

const TRACK_WIDTH = 280;
const THUMB_SIZE = 56;
const COMPLETE_RATIO = 0.9;

export default function TearSlider({
  label = "Slide to tear open",
  onComplete,
  className,
}: TearSliderProps) {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const maxDrag = TRACK_WIDTH - THUMB_SIZE;
  const trackRef = useRef<HTMLDivElement>(null);

  const handleComplete = useCallback(() => {
    if (completed) return;
    setCompleted(true);
    setProgress(1);
    onComplete();
  }, [completed, onComplete]);

  const handleDrag = useCallback(
    (_: unknown, info: PanInfo) => {
      if (completed) return;
      const offset = Math.max(0, Math.min(info.offset.x, maxDrag));
      const ratio = offset / maxDrag;
      setProgress(ratio);
      if (ratio >= COMPLETE_RATIO) {
        handleComplete();
      }
    },
    [completed, maxDrag, handleComplete]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (completed) return;
      const offset = Math.max(0, Math.min(info.offset.x, maxDrag));
      const ratio = offset / maxDrag;
      if (ratio >= COMPLETE_RATIO) {
        handleComplete();
      } else {
        setProgress(0);
      }
    },
    [completed, maxDrag, handleComplete]
  );

  if (reducedMotion) {
    return (
      <div className={cn("w-full max-w-xs", className)}>
        <Button
          accent="wine"
          size="lg"
          className={cn("w-full", THUMB_CTA_MIN_HEIGHT)}
          onClick={handleComplete}
          disabled={completed}
        >
          {completed ? "Opening…" : "Tap to open"}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-xs", className)}>
      <p className="verse-ref mb-3 text-center text-ink-soft">{label}</p>
      <div
        ref={trackRef}
        className={cn(
          "relative rounded-full border border-wine/30 bg-smoke/40",
          THUMB_CTA_MIN_HEIGHT
        )}
        style={{ width: TRACK_WIDTH }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-wine/20 transition-none"
          style={{ width: `${progress * 100}%` }}
        />
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className={cn(
            "absolute top-1/2 left-0 flex -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-wine/50 bg-wine/15 active:cursor-grabbing",
            completed && "tear-complete"
          )}
          style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xl">✂️</span>
        </motion.div>
      </div>
    </div>
  );
}

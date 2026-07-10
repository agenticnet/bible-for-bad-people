"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
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

const THUMB_SIZE = 56;
const COMPLETE_RATIO = 0.9;

function useIsRtl() {
  const [isRtl, setIsRtl] = useState(false);
  useEffect(() => {
    setIsRtl(document.documentElement.dir === "rtl");
    const observer = new MutationObserver(() => {
      setIsRtl(document.documentElement.dir === "rtl");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    return () => observer.disconnect();
  }, []);
  return isRtl;
}

export default function TearSlider({
  label = "Slide to tear open",
  onComplete,
  className,
}: TearSliderProps) {
  const reducedMotion = useReducedMotion();
  const isRtl = useIsRtl();
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [maxDrag, setMaxDrag] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function measure() {
      const width = track?.offsetWidth ?? 0;
      setMaxDrag(Math.max(0, width - THUMB_SIZE));
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const handleComplete = useCallback(() => {
    if (completed) return;
    setCompleted(true);
    setProgress(1);
    onComplete();
  }, [completed, onComplete]);

  const applyOffset = useCallback(
    (rawX: number) => {
      if (completed || maxDrag <= 0) return;
      const offset = Math.max(0, Math.min(isRtl ? -rawX : rawX, maxDrag));
      const ratio = offset / maxDrag;
      setProgress(ratio);
      if (ratio >= COMPLETE_RATIO) {
        handleComplete();
      }
    },
    [completed, maxDrag, isRtl, handleComplete]
  );

  const handleDrag = useCallback(
    (_: unknown, info: PanInfo) => {
      applyOffset(info.offset.x);
    },
    [applyOffset]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (completed || maxDrag <= 0) return;
      const offset = Math.max(0, Math.min(isRtl ? -info.offset.x : info.offset.x, maxDrag));
      const ratio = offset / maxDrag;
      if (ratio >= COMPLETE_RATIO) {
        handleComplete();
      } else {
        setProgress(0);
      }
    },
    [completed, maxDrag, isRtl, handleComplete]
  );

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (completed || maxDrag <= 0) return;
    const step = 0.1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(1, progress + step);
      setProgress(next);
      if (next >= COMPLETE_RATIO) handleComplete();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setProgress(Math.max(0, progress - step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setProgress(0);
    } else if (e.key === "End") {
      e.preventDefault();
      handleComplete();
    }
  }

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

  const thumbOffset = progress * maxDrag;

  return (
    <div className={cn("w-full max-w-xs", className)}>
      <p className="verse-ref mb-3 text-center text-ink-soft" id={labelId}>
        {label}
      </p>
      <div
        ref={trackRef}
        className={cn(
          "relative w-full max-w-[280px] rounded-full border border-wine/30 bg-smoke/40",
          THUMB_CTA_MIN_HEIGHT
        )}
      >
        <div
          className="absolute inset-y-0 start-0 rounded-full bg-wine/20 transition-none"
          style={{ width: `${progress * 100}%` }}
          aria-hidden
        />
        <motion.div
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-labelledby={labelId}
          tabIndex={completed ? -1 : 0}
          drag="x"
          dragConstraints={
            isRtl
              ? { left: -maxDrag, right: 0 }
              : { left: 0, right: maxDrag }
          }
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onKeyDown={handleKeyDown}
          className={cn(
            "absolute top-1/2 start-0 flex -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-wine/50 bg-wine/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine/40 active:cursor-grabbing",
            completed && "tear-complete"
          )}
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            x: isRtl ? -thumbOffset : thumbOffset,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xl" aria-hidden>
            ✂️
          </span>
        </motion.div>
      </div>
    </div>
  );
}

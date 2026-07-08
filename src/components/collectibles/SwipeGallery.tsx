"use client";

import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import type { PreviewAsset } from "@/lib/indulgenceTypes";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SwipeGalleryProps {
  assets: PreviewAsset[];
  fallbackIcon: string;
  className?: string;
  bleed?: boolean;
}

const SWIPE_THRESHOLD = 80;

export default function SwipeGallery({
  assets,
  fallbackIcon,
  className,
  bleed = false,
}: SwipeGalleryProps) {
  const items = assets.length ? assets : [{ type: "emoji" as const, src: fallbackIcon }];
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const reducedMotion = useReducedMotion();
  const t = resolveTransition(spring.gentle, reducedMotion);

  const active = items[index]!;
  const canSwipe = items.length > 1;

  function goNext() {
    setIndex((i) => (i + 1) % items.length);
  }

  function goPrev() {
    setIndex((i) => (i - 1 + items.length) % items.length);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    setDragOffset(0);
    if (!canSwipe) return;
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -300) {
      goNext();
    } else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 300) {
      goPrev();
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className={cn("relative overflow-hidden", bleed && "-mx-6")}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            drag={canSwipe && !reducedMotion ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDrag={(_, info) => setDragOffset(info.offset.x)}
            onDragEnd={handleDragEnd}
            className="flex h-72 cursor-grab items-center justify-center bg-smoke/40 active:cursor-grabbing"
            style={{
              rotateZ: canSwipe ? dragOffset * 0.03 : 0,
            }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={t}
          >
            <span className="select-none text-8xl">{active.src}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {canSwipe && (
        <div className="flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-6 bg-wine" : "w-2 bg-rule"
              )}
              aria-label={`View item ${i + 1}`}
            />
          ))}
        </div>
      )}

      <p className="verse-ref text-center text-ink-soft">
        Swipe to browse. The longer you look, the more yours it feels.
      </p>
    </div>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
import type { PreviewAsset } from "@/lib/indulgenceTypes";
import { Surface } from "@/components/ui";
import { cn } from "@/lib/utils";

interface MagnifierGalleryProps {
  assets: PreviewAsset[];
  fallbackIcon: string;
  onInspectStart?: () => void;
  onInspectEnd?: () => void;
}

export default function MagnifierGallery({
  assets,
  fallbackIcon,
  onInspectStart,
  onInspectEnd,
}: MagnifierGalleryProps) {
  const items = assets.length ? assets : [{ type: "emoji" as const, src: fallbackIcon }];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lens, setLens] = useState({ x: 50, y: 50, visible: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const active = items[activeIndex];

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      onInspectStart?.();
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setLens({ x, y, visible: true });
    },
    [onInspectStart]
  );

  return (
    <div className="space-y-3">
      <Surface padding="none" className="relative overflow-hidden">
        <div
          ref={containerRef}
          className="relative flex h-64 cursor-crosshair items-center justify-center bg-smoke/40"
          onMouseMove={handleMove}
          onMouseLeave={() => {
            setLens((l) => ({ ...l, visible: false }));
            onInspectEnd?.();
          }}
        >
          <span className="select-none text-8xl">{active.src}</span>
          {lens.visible && (
            <div
              className="pointer-events-none absolute h-24 w-24 overflow-hidden rounded-full border-2 border-wine/50 bg-parchment shadow-lg"
              style={{
                left: `calc(${lens.x}% - 3rem)`,
                top: `calc(${lens.y}% - 3rem)`,
              }}
            >
              <span
                className="absolute text-[6rem] leading-none"
                style={{
                  left: `calc(50% - ${lens.x * 2.4}px)`,
                  top: `calc(50% - ${lens.y * 2.4}px)`,
                }}
              >
                {active.src}
              </span>
            </div>
          )}
        </div>
      </Surface>

      {items.length > 1 && (
        <div className="flex gap-2">
          {items.map((item, i) => (
            <button
              key={`${item.src}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded border text-2xl transition-colors",
                i === activeIndex
                  ? "border-wine/50 bg-wine/10"
                  : "border-rule bg-smoke/30 hover:border-wine/30"
              )}
            >
              {item.src}
            </button>
          ))}
        </div>
      )}

      <p className="verse-ref text-ink-soft">
        Move cursor to inspect. The longer you look, the more yours it feels.
      </p>
    </div>
  );
}

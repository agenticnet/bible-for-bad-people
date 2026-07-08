"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import { Badge, Surface } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ThreeDViewerProps {
  product: IndulgenceProduct;
  onInspectStart?: () => void;
}

export default function ThreeDViewer({
  product,
  onInspectStart,
}: ThreeDViewerProps) {
  const reducedMotion = useReducedMotion();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [flipped, setFlipped] = useState(false);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const t = resolveTransition(spring.gentle, reducedMotion);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onInspectStart?.();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [onInspectStart]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setRotation((r) => ({
      x: Math.max(-30, Math.min(30, r.x - dy * 0.3)),
      y: r.y + dx * 0.5,
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="space-y-3">
      <div className="perspective-[800px]">
        <motion.div
          className="relative mx-auto h-64 w-full max-w-xs [transform-style:preserve-3d]"
          animate={{
            rotateX: rotation.x,
            rotateY: flipped ? 180 + rotation.y : rotation.y,
          }}
          transition={t}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={() => setFlipped((f) => !f)}
        >
          <Surface
            accent="wine"
            accentTint
            padding="none"
            className="absolute inset-0 flex flex-col items-center justify-center [backface-visibility:hidden]"
          >
            <span className="text-7xl">{product.icon}</span>
            <p className="verse-ref mt-3 text-wine">{product.name}</p>
          </Surface>

          <Surface
            accent="plum"
            padding="sm"
            className="absolute inset-0 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <p className="mb-2 font-serif text-sm text-ink">{product.tagline}</p>
            <p className="text-xs leading-relaxed text-ink-soft">{product.description}</p>
            {product.leaderboardBoost && (
              <Badge tone="wine" size="sm" className="mt-3 self-start">
                +{product.leaderboardBoost} Score
              </Badge>
            )}
          </Surface>
        </motion.div>
      </div>
      <p className={cn("verse-ref text-center text-ink-soft")}>
        Drag to rotate. Tap to flip. Inspect every flaw.
      </p>
    </div>
  );
}

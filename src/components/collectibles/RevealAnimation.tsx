"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { IndulgenceProduct, MysteryReward } from "@/lib/indulgenceTypes";
import { generateCertificateId } from "@/lib/indulgenceProducts";
import { addIndulgencePurchase } from "@/lib/data/indulgences";
import { openMysteryPack } from "@/lib/data/collectibles";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clipReveal, fadeUpScale, resolveTransition, spring } from "@/lib/motion";
import { Badge, Button } from "@/components/ui";

type RevealPhase = "idle" | "tremble" | "hold" | "burst" | "reward" | "done";

interface RevealAnimationProps {
  product: IndulgenceProduct;
  active: boolean;
  onComplete: (reward?: MysteryReward) => void;
  onError: (message: string) => void;
}

const HOLD_MS = 1200;

export default function RevealAnimation({
  product,
  active,
  onComplete,
  onError,
}: RevealAnimationProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<RevealPhase>("idle");
  const [holdProgress, setHoldProgress] = useState(0);
  const [reward, setReward] = useState<MysteryReward | null>(null);
  const holdStart = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  const t = resolveTransition(spring.gentle, reducedMotion);

  const completeReveal = useCallback(async () => {
    setPhase("burst");
    try {
      const rolled = await openMysteryPack();
      const result = await addIndulgencePurchase({
        productId: product.id,
        productName: `${product.name} → ${rolled.productName}`,
        purchasedAt: new Date().toISOString(),
        certificateId: generateCertificateId(),
        pricePaid: product.price,
      });

      if (result.error) {
        onError(result.error);
        setPhase("idle");
        return;
      }

      setReward(rolled);
      setPhase("reward");
      setTimeout(() => {
        setPhase("done");
        onComplete(rolled);
      }, 2800);
    } catch {
      onError("The crate refused to open. Try again.");
      setPhase("idle");
    }
  }, [product, onComplete, onError]);

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      setHoldProgress(0);
      setReward(null);
      return;
    }
    setPhase(reducedMotion ? "hold" : "tremble");
    if (reducedMotion) {
      void completeReveal();
      return;
    }
    const timer = setTimeout(() => setPhase("hold"), 900);
    return () => clearTimeout(timer);
  }, [active, reducedMotion, completeReveal]);

  const handleHoldStart = useCallback(() => {
    if (phase !== "hold") return;
    holdStart.current = Date.now();

    const tick = () => {
      if (!holdStart.current) return;
      const elapsed = Date.now() - holdStart.current;
      setHoldProgress(Math.min(elapsed / HOLD_MS, 1));
      if (elapsed >= HOLD_MS) {
        holdStart.current = null;
        void completeReveal();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [phase, completeReveal]);

  const handleHoldEnd = useCallback(() => {
    holdStart.current = null;
    if (raf.current) cancelAnimationFrame(raf.current);
    setHoldProgress(0);
  }, []);

  const rarityTone = {
    common: "neutral" as const,
    rare: "wine" as const,
    legendary: "plum" as const,
  };

  return (
    <AnimatePresence>
      {active && phase !== "idle" && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-binding/90 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {(phase === "tremble" || phase === "hold") && (
            <motion.div
              className="flex flex-col items-center"
              animate={
                phase === "tremble"
                  ? { x: [0, -4, 4, -3, 3, 0], rotate: [0, -2, 2, -1, 1, 0] }
                  : { x: 0, rotate: 0 }
              }
              transition={
                phase === "tremble"
                  ? { repeat: Infinity, duration: 0.4 }
                  : { duration: 0.2 }
              }
            >
              <span className="mb-6 text-8xl">{product.icon}</span>
              <p className="verse-ref mb-4 text-wine">Sin Mystery Crate</p>
              {phase === "hold" && (
                <>
                  <p className="mb-4 text-sm text-ivory">
                    Click and hold to tear open
                  </p>
                  <button
                    type="button"
                    className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-wine/50 bg-wine/10"
                    onPointerDown={handleHoldStart}
                    onPointerUp={handleHoldEnd}
                    onPointerLeave={handleHoldEnd}
                  >
                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-wine/20"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={276}
                        strokeDashoffset={276 * (1 - holdProgress)}
                        className="text-wine transition-none"
                      />
                    </svg>
                    <span className="text-2xl">✂️</span>
                  </button>
                </>
              )}
            </motion.div>
          )}

          {phase === "burst" && (
            <motion.div
              variants={clipReveal}
              initial="hidden"
              animate="visible"
              transition={t}
              className="text-6xl"
            >
              💥
            </motion.div>
          )}

          {phase === "reward" && reward && (
            <motion.div
              variants={fadeUpScale}
              initial="hidden"
              animate="visible"
              transition={t}
              className="flex flex-col items-center text-center"
            >
              <span className="mb-4 text-7xl">{reward.icon}</span>
              <Badge tone={rarityTone[reward.rarity]} className="mb-3">
                {reward.rarity}
              </Badge>
              <h3 className="mb-2 text-xl font-bold text-ivory">{reward.productName}</h3>
              <p className="text-sm text-ink-soft">
                Added to your vault. Salvation score updated.
              </p>
              <Button accent="wine" className="mt-6" onClick={() => onComplete(reward)}>
                Claim
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

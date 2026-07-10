"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Share2 } from "lucide-react";
import type { IndulgenceProduct, MysteryReward } from "@/lib/indulgenceTypes";
import { generateCertificateId } from "@/lib/indulgenceProducts";
import { addIndulgencePurchase } from "@/lib/data/indulgences";
import { rollMysteryReward } from "@/lib/collectibles/mysteryPool";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveTransition, spring } from "@/lib/motion";
import {
  Badge,
  Button,
  Callout,
  FixedBottomBar,
  TearSlider,
} from "@/components/ui";
import { THUMB_CTA_MIN_HEIGHT, Z_FULLSCREEN_REVEAL, CONTENT_PAD_BOTTOM } from "@/lib/ux/constraints";
import { cn } from "@/lib/utils";

type RevealStep = "anticipation" | "suspense" | "reveal" | "done";

interface MysteryRevealProps {
  product: IndulgenceProduct;
  active: boolean;
  onComplete: (reward?: MysteryReward) => void;
  onError: (message: string) => void;
}

const SUSPENSE_MIN_MS = 400;
const SUSPENSE_MAX_MS = 600;

const rarityTone = {
  common: "neutral" as const,
  rare: "wine" as const,
  legendary: "plum" as const,
};

const rarityBorder = {
  common: "border-rule",
  rare: "border-wine ring-2 ring-wine/40",
  legendary: "border-plum ring-2 ring-plum/40",
};

async function shareReward(reward: MysteryReward, productName: string) {
  const text = `I unboxed ${reward.productName} from ${productName}! ${reward.icon}`;
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: "Sin Mystery Crate", text });
      return;
    } catch {
      /* user cancelled or unsupported */
    }
  }
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  }
}

export default function MysteryReveal({
  product,
  active,
  onComplete,
  onError,
}: MysteryRevealProps) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<RevealStep>("anticipation");
  const [reward, setReward] = useState<MysteryReward | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [purchasePending, setPurchasePending] = useState(false);
  const purchaseRef = useRef<Promise<{ error?: string }> | null>(null);
  const reducedAutoStarted = useRef(false);
  const t = resolveTransition(spring.gentle, reducedMotion);

  const reset = useCallback(() => {
    setStep("anticipation");
    setReward(null);
    setError(null);
    setPurchasePending(false);
    purchaseRef.current = null;
  }, []);

  useEffect(() => {
    if (!active) {
      reset();
    }
  }, [active, reset]);

  const handleTearComplete = useCallback(() => {
    const rolled = rollMysteryReward();
    setReward(rolled);
    setStep("suspense");
    setPurchasePending(true);

    // Score the rolled reward; decrement crate inventory separately.
    const purchasePromise = addIndulgencePurchase({
      productId: rolled.productId,
      inventoryProductId: product.id,
      productName: `${product.name} → ${rolled.productName}`,
      purchasedAt: new Date().toISOString(),
      certificateId: generateCertificateId(),
      pricePaid: product.price,
    });
    purchaseRef.current = purchasePromise;

    const suspenseStart = Date.now();

    void purchasePromise.then((result) => {
      setPurchasePending(false);
      if (result.error) {
        setError(result.error);
        setStep("anticipation");
        onError(result.error);
        return;
      }

      const elapsed = Date.now() - suspenseStart;
      const remaining = Math.max(0, SUSPENSE_MIN_MS - elapsed);
      setTimeout(() => {
        setStep("reveal");
      }, remaining);
    });
  }, [product, onError]);

  useEffect(() => {
    if (step !== "suspense" || reducedMotion) return;
    const timer = setTimeout(() => {
      if (!error) setStep((s) => (s === "suspense" ? "reveal" : s));
    }, SUSPENSE_MAX_MS);
    return () => clearTimeout(timer);
  }, [step, error, reducedMotion]);

  useEffect(() => {
    if (!active) {
      reducedAutoStarted.current = false;
      return;
    }
    if (!reducedMotion || reducedAutoStarted.current) return;
    reducedAutoStarted.current = true;
    handleTearComplete();
  }, [active, reducedMotion, handleTearComplete]);

  const handleVault = useCallback(() => {
    setStep("done");
    onComplete(reward ?? undefined);
  }, [onComplete, reward]);

  return (
    <AnimatePresence>
      {active && step !== "done" && (
        <motion.div
          className={cn("fixed inset-0 flex flex-col", Z_FULLSCREEN_REVEAL)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={cn("flex flex-1 flex-col overflow-y-auto bg-binding/90", CONTENT_PAD_BOTTOM)}>
            <div className="flex flex-1 flex-col items-center justify-center p-6">
              {error && step === "anticipation" && (
                <Callout tone="ember" className="mb-6 max-w-sm">
                  {error}
                </Callout>
              )}

              {step === "anticipation" && (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={t}
                >
                  <span className="mb-6 text-8xl">{product.icon}</span>
                  <p className="verse-ref mb-2 text-wine">Sin Mystery Crate</p>
                  <p className="text-sm text-ivory">Step 1 — Anticipation</p>
                </motion.div>
              )}

              {step === "suspense" && (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={t}
                >
                  <motion.span
                    className="mb-6 text-8xl"
                    animate={{ rotate: [0, -3, 3, -2, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    {product.icon}
                  </motion.span>
                  <p className="verse-ref mb-4 text-wine">Step 2 — Suspense</p>
                  <div className="h-32 w-48 max-w-full animate-pulse rounded-xl border border-wine/30 bg-wine/10" />
                  <p className="mt-4 text-sm text-ivory/70">The crate shimmies…</p>
                </motion.div>
              )}

              {step === "reveal" && reward && (
                <motion.div
                  className="flex w-full max-w-sm flex-col items-center px-4 text-center"
                  style={{ perspective: 1000 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={t}
                >
                  <p className="verse-ref mb-6 text-wine">Step 3 — Reveal</p>
                  <motion.div
                    className={cn(
                      "flex w-full flex-col items-center rounded-2xl border-2 bg-parchment p-8",
                      rarityBorder[reward.rarity]
                    )}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={t}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <span className="mb-4 text-7xl">{reward.icon}</span>
                    <Badge tone={rarityTone[reward.rarity]} className="mb-3">
                      {reward.rarity}
                    </Badge>
                    <h3 className="text-contain text-xl font-bold text-ink">
                      {reward.productName}
                    </h3>
                    {purchasePending && (
                      <p className="mt-2 text-xs text-ink-soft">
                        Securing your vault entry…
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>

          {step === "anticipation" && (
            <FixedBottomBar
              variant="binding"
              zIndex={Z_FULLSCREEN_REVEAL}
              innerClassName="flex justify-center py-3"
            >
              <TearSlider onComplete={handleTearComplete} />
            </FixedBottomBar>
          )}

          {step === "reveal" && reward && (
            <FixedBottomBar
              variant="parchment"
              zIndex={Z_FULLSCREEN_REVEAL}
              innerClassName="mx-auto flex max-w-sm gap-3 py-2"
            >
              <Button
                variant="ghost"
                size="lg"
                className={cn("shrink-0", THUMB_CTA_MIN_HEIGHT)}
                onClick={() => void shareReward(reward, product.name)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                accent="wine"
                size="lg"
                className={cn("min-w-0 flex-1", THUMB_CTA_MIN_HEIGHT)}
                onClick={handleVault}
                disabled={purchasePending}
              >
                Add to Vault
              </Button>
            </FixedBottomBar>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

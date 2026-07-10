"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fadeUpScale, resolveTransition, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SuccessMomentProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  showParticles?: boolean;
  autoDismissMs?: number;
  onDismiss?: () => void;
  className?: string;
}

const PARTICLE_COLORS = [
  "oklch(0.45 0.11 25)",
  "oklch(0.975 0.004 90)",
  "oklch(0.42 0.08 320)",
];

function ParticleBurst({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = 280;
    const h = 160;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const particles = Array.from({ length: 24 }, (_, i) => ({
      x: w / 2,
      y: h / 2,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 2,
      size: 2 + Math.random() * 3,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length]!,
      life: 1,
    }));

    let frame = 0;
    let raf: number;

    function tick() {
      ctx!.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= 0.018;
        if (p.life <= 0) continue;
        alive = true;
        ctx!.globalAlpha = p.life;
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
      frame++;
      if (alive && frame < 90) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 mx-auto"
      aria-hidden
    />
  );
}

export default function SuccessMoment({
  title,
  description,
  icon,
  showParticles = true,
  autoDismissMs,
  onDismiss,
  className,
}: SuccessMomentProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!autoDismissMs || !onDismiss) return;
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  return (
    <div className={cn("relative py-6 text-center", className)}>
      {showParticles && !reducedMotion && <ParticleBurst active />}
      <motion.div
        className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-wine/30 bg-wine/10"
        variants={fadeUpScale}
        initial="hidden"
        animate="visible"
        transition={resolveTransition(transition.base, reducedMotion)}
      >
        {icon ?? <Check className="h-8 w-8 text-wine" strokeWidth={2.5} />}
      </motion.div>
      <motion.p
        className="mb-2 text-lg font-bold text-wine"
        variants={fadeUpScale}
        initial="hidden"
        animate="visible"
        transition={resolveTransition(
          { ...transition.base, delay: 0.1 },
          reducedMotion
        )}
      >
        {title}
      </motion.p>
      {description && (
        <motion.p
          className="text-sm text-ink-soft"
          variants={fadeUpScale}
          initial="hidden"
          animate="visible"
          transition={resolveTransition(
            { ...transition.base, delay: 0.15 },
            reducedMotion
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

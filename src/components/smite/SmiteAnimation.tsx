"use client";

import { useEffect, useState } from "react";
import type { PlagueType } from "@/lib/smiteTypes";
import { PLAGUE_ICONS } from "@/lib/smiteTypes";

interface SmiteAnimationProps {
  plague: PlagueType;
  active: boolean;
  onComplete: () => void;
}

const PLAGUE_PARTICLES: Record<PlagueType, string[]> = {
  locusts: ["🦗", "🦗", "🌾", "🦗"],
  frogs: ["🐸", "🐸", "🐸", "💚"],
  boils: ["🤢", "💢", "🤕", "😖"],
  darkness: ["🌑", "⬛", "🌚", "💀"],
  hail: ["🌨️", "🔥", "❄️", "💥"],
  pestilence: ["☠️", "🤧", "🦠", "💀"],
  "blood-river": ["🩸", "🩸", "💧", "🌊"],
  gnats: ["🪰", "🪰", "🪰", "🐛"],
  "livestock-death": ["🥀", "🪴", "💀", "🐄"],
  "firstborn-wifi": ["📵", "📶", "❌", "😱"],
};

export default function SmiteAnimation({
  plague,
  active,
  onComplete,
}: SmiteAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!visible) return null;

  const particles = PLAGUE_PARTICLES[plague];
  const mainIcon = PLAGUE_ICONS[plague];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neon-red/20 animate-pulse-glow">
      <div className="relative flex flex-col items-center">
        <div className="mb-4 text-8xl animate-float">{mainIcon}</div>
        <p className="text-2xl font-bold uppercase tracking-[0.3em] text-neon-red">
          SMITTEN
        </p>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((emoji, i) => (
            <span
              key={i}
              className="absolute text-3xl opacity-80"
              style={{
                left: `${15 + i * 20}%`,
                top: `${10 + (i % 3) * 25}%`,
                animation: `float ${1 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />
    </div>
  );
}

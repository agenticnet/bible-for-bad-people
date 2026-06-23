/**
 * Scripture design tokens — single source for accent variants.
 * Chambers map legacy neon names here; change tokens once, not per component.
 */
export type Accent = "wine" | "plum" | "slate" | "terra" | "ember";

export type SemanticStatus = "success" | "warning" | "info" | "neutral";

export const accentStyles: Record<
  Accent,
  {
    border: string;
    borderMuted: string;
    borderHover: string;
    bg: string;
    bgMuted: string;
    bgHover: string;
    text: string;
    focus: string;
    surfaceMuted: string;
    dot: string;
  }
> = {
  wine: {
    border: "border-wine/50",
    borderMuted: "border-wine/30",
    borderHover: "hover:border-wine/40",
    bg: "bg-wine/15",
    bgMuted: "bg-wine/10",
    bgHover: "hover:bg-wine/20",
    text: "text-wine",
    focus:
      "focus:border-wine/50 focus:outline-none focus:ring-1 focus:ring-wine/30",
    surfaceMuted: "border-wine/20 bg-wine/5 text-wine",
    dot: "bg-wine/60",
  },
  plum: {
    border: "border-plum/50",
    borderMuted: "border-plum/30",
    borderHover: "hover:border-plum/40",
    bg: "bg-plum/15",
    bgMuted: "bg-plum/10",
    bgHover: "hover:bg-plum/25",
    text: "text-plum",
    focus:
      "focus:border-plum/50 focus:outline-none focus:ring-1 focus:ring-plum/30",
    surfaceMuted: "border-plum/20 bg-plum/5 text-plum",
    dot: "bg-plum/60",
  },
  slate: {
    border: "border-slate/50",
    borderMuted: "border-slate/30",
    borderHover: "hover:border-slate/40",
    bg: "bg-slate/15",
    bgMuted: "bg-slate/10",
    bgHover: "hover:bg-slate/20",
    text: "text-slate",
    focus:
      "focus:border-slate/50 focus:outline-none focus:ring-1 focus:ring-slate/30",
    surfaceMuted: "border-slate/20 bg-slate/5 text-slate",
    dot: "bg-slate/60",
  },
  terra: {
    border: "border-terra/50",
    borderMuted: "border-terra/30",
    borderHover: "hover:border-terra/40",
    bg: "bg-terra/15",
    bgMuted: "bg-terra/10",
    bgHover: "hover:bg-terra/20",
    text: "text-terra",
    focus:
      "focus:border-terra/50 focus:outline-none focus:ring-1 focus:ring-terra/30",
    surfaceMuted: "border-terra/20 bg-terra/5 text-terra",
    dot: "bg-terra/60",
  },
  ember: {
    border: "border-ember/50",
    borderMuted: "border-ember/30",
    borderHover: "hover:border-ember/40",
    bg: "bg-ember/15",
    bgMuted: "bg-ember/10",
    bgHover: "hover:bg-ember/20",
    text: "text-ember",
    focus:
      "focus:border-ember/50 focus:outline-none focus:ring-1 focus:ring-ember/30",
    surfaceMuted: "border-ember/20 bg-ember/5 text-ember",
    dot: "bg-ember/60",
  },
};

export const statusStyles: Record<
  SemanticStatus,
  { border: string; bg: string; text: string }
> = {
  success: {
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    text: "text-green-400",
  },
  warning: {
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
  },
  info: {
    border: "border-slate/30",
    bg: "bg-slate/10",
    text: "text-slate",
  },
  neutral: {
    border: "border-rule",
    bg: "bg-smoke",
    text: "text-ink-soft",
  },
};

/** Chamber → default accent for CTAs and focus rings */
export const chamberAccent = {
  confessional: "plum",
  chat: "wine",
  "devils-advocate": "plum",
  indulgences: "wine",
  oracle: "ember",
  sin: "terra",
  smite: "ember",
  support: "slate",
} as const satisfies Record<string, Accent>;

export const surfaceBase =
  "rounded-xl border border-rule bg-page transition-colors";

export const inputBase =
  "w-full rounded-lg border border-rule bg-page px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none disabled:opacity-50";

export const calloutMutedStyles: Record<Accent, string> = {
  wine: "rounded-lg border border-wine/20 bg-wine/5 px-4 py-3 text-wine",
  plum: "rounded-lg border border-plum/20 bg-plum/5 px-4 py-3 text-plum",
  slate: "rounded-lg border border-slate/20 bg-slate/5 px-4 py-3 text-slate",
  terra: "rounded-lg border border-terra/20 bg-terra/5 px-4 py-3 text-terra",
  ember: "rounded-lg border border-ember/20 bg-ember/5 px-4 py-3 text-ember",
};

export const calloutStatusStyles: Record<SemanticStatus, string> = {
  success:
    "rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-green-400",
  warning:
    "rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-yellow-400",
  info: "rounded-lg border border-slate/20 bg-slate/5 px-4 py-3 text-slate",
  neutral:
    "rounded-lg border border-rule bg-smoke px-4 py-3 text-ink-soft",
};

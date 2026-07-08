/** UX psychology constraints — single source for Hick's, Fitts's, Von Restorff laws */

export const MAX_PRIMARY_OPTIONS = 4;

export const PRIMARY_CTA_MIN_HEIGHT = "min-h-11";

/** Thumb-zone primary actions — 56px minimum touch target */
export const THUMB_CTA_MIN_HEIGHT = "min-h-14";

/** Bottom sheet default snap height */
export const BOTTOM_SHEET_HEIGHT = "max-h-[60dvh]";

/** Safe area padding for fixed bottom chrome */
export const SAFE_BOTTOM = "pb-[max(1rem,env(safe-area-inset-bottom))]";

/** Scroll clearance when fixed bottom chrome is present */
export const CONTENT_PAD_BOTTOM =
  "pb-[calc(5.5rem+env(safe-area-inset-bottom))]";

/** Align with Tailwind `md` (768px) — single source for JS media queries */
export const MOBILE_BREAKPOINT = "(max-width: 767px)";

/**
 * Z-index scale: drop timer (30) → fullscreen reveal (45) → sticky action bar (40) → bottom sheet (50)
 */
export const Z_DROP = "z-30";
export const Z_FULLSCREEN_REVEAL = "z-[45]";
export const Z_STICKY_ACTION = "z-40";
export const Z_BOTTOM_SHEET = "z-50";

/** Ink-tinted elevation — not glow */
export const FEATURED_SHADOW = "shadow-[0_8px_30px_oklch(0.22_0.025_265/0.12)]";

/** UX psychology constraints — single source for Hick's, Fitts's, Von Restorff laws */

export const MAX_PRIMARY_OPTIONS = 4;

/** WCAG / Material 48×48 minimum interactive target */
export const TOUCH_TARGET_MIN = "min-h-12 min-w-12";

export const PRIMARY_CTA_MIN_HEIGHT = "min-h-12";

/** Thumb-zone on mobile; standard control height on desktop */
export const THUMB_CTA_MIN_HEIGHT = "min-h-14 md:min-h-12";

/** Bottom sheet default snap height */
export const BOTTOM_SHEET_HEIGHT = "max-h-[60dvh]";

/** Safe area padding for fixed bottom chrome */
export const SAFE_BOTTOM = "pb-[max(1rem,env(safe-area-inset-bottom))]";

/** Offset below fixed site Header (BindingBar follows in flow) */
export const HEADER_OFFSET = "pt-16 sm:pt-[4.5rem]";

/** Full viewport below fixed Header — for chat shells */
export const VIEWPORT_BELOW_HEADER = "h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-4.5rem)]";

/** Scroll clearance when fixed bottom chrome is present (mobile thumb zone) */
export const CONTENT_PAD_BOTTOM =
  "max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom))]";

/** In-flow spacer matching fixed bottom chrome — pair with FixedBottomBar */
export const FIXED_CHROME_SPACER_HEIGHT =
  "h-[calc(4.5rem+env(safe-area-inset-bottom))]";

/** Match PageShell maxWidth tokens for fixed chrome alignment */
export const PAGE_CONTENT_MAX_WIDTH = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-full",
} as const;

export type PageContentMaxWidth = keyof typeof PAGE_CONTENT_MAX_WIDTH;

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

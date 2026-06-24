# Design System — Bible for Bad People

## Scene

Someone opens a well-bound study Bible on a desk lamp’s circle of light — leather cover, cream page, small mono verse numbers in the margin. The product is irreverent; the container is not.

## Color Strategy

**Restrained** with **Committed** wine accent. Light scripture surfaces on a dark binding shell (header/footer). OKLCH throughout.

| Token | Role | Value |
|---|---|---|
| `parchment` | Page background | `oklch(0.975 0.004 90)` |
| `page` | Elevated surface | `oklch(0.965 0.005 90)` |
| `ink` | Primary text | `oklch(0.22 0.025 265)` |
| `ink-soft` | Secondary text | `oklch(0.42 0.018 265)` |
| `binding` | Header/footer shell | `oklch(0.20 0.035 30)` |
| `rule` | Borders, dividers | `oklch(0.88 0.008 90)` |
| `wine` | Primary accent, CTAs | `oklch(0.45 0.11 25)` |
| `ember` | Strong emphasis | `oklch(0.50 0.14 30)` |
| `plum` | Secondary accent | `oklch(0.42 0.08 320)` |
| `slate` | Tertiary / links | `oklch(0.48 0.04 250)` |

Legacy Tailwind names (`void`, `bone`, `neon-*`) map to these roles for gradual migration.

## Typography

Anthropic-style role split (open-source substitutes):

| Role | Family | Use |
|---|---|---|
| Serif | Source Serif 4 | Display headlines, scripture blockquotes, editorial body |
| Sans | Figtree | Navigation, buttons, labels, UI chrome |
| Mono | JetBrains Mono | Verse references, metadata, small caps labels |

Scale: modular ~1.25 ratio, `clamp()` for display (max 6rem), body max 65–75ch.

## Layout

- Binding-dark header fixed; main content on parchment
- Prefer ruled sections over nested cards for scripture
- Chamber grid: typographic list feel, not identical glowing cards

## Motion

Literary spectacle — motion amplifies the study-Bible metaphor (cover opening, ink settling, chapter turns). Tokens live in [`src/lib/motion.ts`](src/lib/motion.ts); primitives in [`src/components/ui/motion/`](src/components/ui/motion/).

| Allowed | Banned |
|---------|--------|
| `transform`, `opacity`, `clip-path` | Glow pulse, bounce/elastic easing |
| Staggered typography reveals | Identical fade-up on every section |
| Scroll-triggered chamber entries (once) | Motion that gates content visibility |
| Spring physics without overshoot | Layout-property animation (`width`, `height`, `top`, `left`) |

All motion respects `prefers-reduced-motion` (instant or opacity-only fallback). Exits run ~75% of enter duration.

## Banned Patterns

No gradient text, no neon glow utilities, no scanline overlays, no uppercase tracking eyebrows on every section, no faux parchment image textures.

# AGENTS.md — Bible for Bad People

Guidance for coding agents working in this repository.

## What this is

A Next.js 15 app: nine satirical “chambers” with a **Study Bible** visual system — parchment content on a dark binding shell, wine/plum accents, serif for scripture, sans for UI.

Read before any UI work:

- [`PRODUCT.md`](PRODUCT.md) — users, voice, anti-references
- [`DESIGN.md`](DESIGN.md) — tokens, typography, banned patterns

## Architecture principle

**All UI flows through `src/components/ui/`.** Chamber components compose primitives; they do not invent one-off Tailwind recipes for surfaces, buttons, forms, or layout chrome. Token changes belong in `globals.css` + `ui/tokens.ts`.

## Directory layout

```
src/
├── app/                    # Thin route shells only
├── components/
│   ├── ui/                 # Design system — import from @/components/ui
│   ├── bible/              # Cynic's Bible
│   ├── chat/               # Talk to God (logic only; UI in ui/)
│   ├── confessional/
│   ├── devils-advocate/
│   ├── indulgences/
│   ├── oracle/
│   ├── sin/
│   ├── smite/
│   ├── support/
│   ├── Header.tsx          # Site chrome
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── ChamberGrid.tsx
└── lib/                    # Types, mock data, storage, chamber config
```

## UI primitives (`@/components/ui`)

### Layout

| Export | Use for |
|--------|---------|
| `PageShell` | Standard chamber page: binding back bar + padded content area |
| `BindingBar` | Dark top strip (binding shell) |
| `BackLink` | “Back to Home” navigation |
| `ChamberHeader` | Chamber title block with icon, accent, optional badge |
| `SectionHeader` | In-tab section kicker + title + description |
| `EmptyState` | Dashed empty lists |
| `VisionsBadge` | “Visions Approximate” pill |

### Surfaces & data

| Export | Use for |
|--------|---------|
| `Surface` | Cards, panels, forms — replaces inline `rounded-xl border…` |
| `MetricCard` | Score/stat blocks |
| `StatTile` | Compact stat grid cells |
| `TabGroup` | Segmented tab navigation |
| `OptionTile` | Selectable grid items (smite targets, plagues) |
| `Chip` | Filter/suggestion pills |

### Forms

| Export | Use for |
|--------|---------|
| `Button` | CTAs — `variant`: accent \| ghost \| success \| danger |
| `IconButton` | Square actions (send, etc.) |
| `Input` / `Textarea` / `Select` | Form fields — `accent` sets focus ring |
| `Label` | Form labels (`verse-ref` style) |
| `LinkButton` | Primary/secondary nav CTAs |

### Feedback

| Export | Use for |
|--------|---------|
| `Badge` | Status chips — tone: accent colors \| success \| warning \| active |
| `Callout` | Inline alerts |
| `Modal` | Overlays |

### Chat

| Export | Use for |
|--------|---------|
| `ChatShell` | Full-height chat layout |
| `ChatHeader` | Chat participant header |
| `ChatComposer` | Message input + send |
| `MessageBubble` | Unified god/lucifer/user messages |
| `TypingIndicator` | Typing animation |
| `ChatAvatar` | Round avatar circles |

### Tokens (`ui/tokens.ts`)

- `Accent`: `wine` \| `plum` \| `slate` \| `terra` \| `ember`
- `chamberAccent`: maps chamber name → default accent
- `accentStyles`: single source for border/bg/text/focus classes per accent

## Chamber accent map

| Chamber | Accent | Legacy name |
|---------|--------|-------------|
| Chat, Indulgences, Cynic's Bible | `wine` | gold |
| Confessional, Devil's Advocate, Oracle | `plum` | purple |
| Support desk | `slate` | cyan |
| Sin translator | `terra` | pink |
| Smite | `ember` | red |

## Rules for agents

1. **Import from `@/components/ui`** — never duplicate surface/button/input class strings in chamber files.
2. **Use scripture token names** — `wine`, `plum`, etc. Never add new `neon-*` classes.
3. **Use `font-serif` / `verse-ref` / `scripture-block`** — not inline `fontFamily` or `text-[10px] uppercase tracking-[0.3em]`.
4. **Page files stay thin** — render one chamber component or `PageShell` + content.
5. **Banned patterns** — gradient text, glow shadows, scanlines, side-stripe borders (`border-l-2` accents), nested cards without purpose.
6. **Run `npm run build`** before finishing UI work.

## Adding a new chamber

1. Add route in `src/app/<chamber>/page.tsx` (thin wrapper).
2. Build feature UI in `src/components/<chamber>/` using `PageShell`, `ChamberHeader`, primitives.
3. Register accent in `chamberAccent` in `ui/tokens.ts`.
4. Add entry to `lib/chambers.ts` for home grid.

## Commands

```bash
npm run dev
npm run build
npm run lint
```

## Design skills

- **Impeccable** — `node .cursor/skills/impeccable/scripts/context.mjs` at session start
- **Hallmark** — marketing patterns only; app chambers use this UI system

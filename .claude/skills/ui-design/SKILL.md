---
name: ui-design
description: Visual design rules for the pdf-anchor viewer and demo site. Use when changing styles, spacing, typography, colors, motion or layout, or when asked to make the UI look better.
---

# UI design for pdf-anchor

The viewer should feel calm and precise: the PDF is the hero, the chrome stays out of the way.

## Principles

- **Hierarchy.** One accent color. Surfaces are white/near-black cards on a quiet neutral background; the PDF page is the brightest object.
- **Floating chrome.** Header is a frosted bar; the citation panel and toolbar are rounded cards that float above the page with soft shadows, not full-bleed bars.
- **Typography.** Inter-first stack, 15px body, 18px titles at weight 600 with slight negative tracking, muted color for secondary text, tabular numbers for counters and zoom.
- **Spacing.** 4px grid: 8 / 12 / 16 / 24. Cards use 16px radius, controls 8px, chips and counters fully round.
- **Color.** Everything comes from `--pdf-anchor-*` variables; derive tints with `color-mix()` instead of adding new hardcoded colors. Check both light and dark.
- **Highlights.** Translucent, rounded, readable text underneath. The active highlight gets an outline and a short pulse; respect `prefers-reduced-motion`.
- **Motion.** 120-200 ms ease-out for hover/active; no motion that is required to understand state.
- **Accessibility.** 4.5:1 text contrast, visible `:focus-visible` rings, 32px minimum hit targets, labels on icon-only buttons.

## Process

1. Change `src/styles.css` only through variables and slot classes (see `add-ui-slot`).
2. Run the demo (`npm --prefix examples/react-vite run dev`) and check Basic (light), Themed (dark), a narrow viewport (about 375px) and keyboard focus.
3. Update `docs/theming.md` when a token is added or changes meaning.

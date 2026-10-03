---
name: add-ui-slot
description: Add a new restyleable UI element or theme token to the pdf-anchor viewer. Use when adding a component, a part of a component, or a new design token.
---

# Adding a slot or theme token

Every visible part of the viewer must be restyleable.

## New element

1. Add its name to `PdfAnchorSlot` in `src/react/types.ts`.
2. In the component, spread `{...slot('<name>', 'pdf-anchor__<class>')}` from `useSlot()` onto the element.
3. Style `.pdf-anchor__<class>` in `src/styles.css` using only `--pdf-anchor-*` variables.
4. Add the slot to the list in `docs/theming.md`.
5. Cover it in `tests/react/viewer.test.tsx` (class and style overrides).

## New design token

1. Add the key to `PdfAnchorTheme` and to `VARIABLES` in `src/react/theme.ts`.
2. Define the default variable on `.pdf-anchor` in `src/styles.css` (and in both dark blocks if it is a color).
3. Add a row to the token table in `docs/theming.md`.

## New text

Add it to `PdfAnchorLabels` and `defaultLabels` (`src/react/labels.ts`); never hardcode user-visible strings in components.

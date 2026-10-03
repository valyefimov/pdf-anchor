---
name: pdf-anchor-dev
description: Work on the pdf-anchor library: architecture, conventions, how to change matching, highlighting or the viewer, and how to verify changes. Use for any code change in this repository.
---

# Developing pdf-anchor

## Layout

- `src/core/`: `tokenize.ts` (words), `match.ts` (wraps `string-best-match`), `highlight.ts` (DOM marking), `types.ts`. No React imports.
- `src/react/`: `PdfAnchorViewer.tsx`, `components/`, `hooks/` (`useViewerState`, `useCitationHighlights`, `useStableCitations`), `context.tsx` (slots), `theme.ts`, `labels.ts`, `types.ts`.
- `src/styles.css`: all styling via `--pdf-anchor-*` variables.

## Workflow

1. Read the relevant module and its test before changing it.
2. Change `src/`; keep core free of React.
3. Add or update tests in `tests/core` or `tests/react`.
4. Run `npm run typecheck && npm run lint && npm test && npm run build`.
5. For anything that touches pdf.js behaviour (text layer, highlighting, scrolling) verify it in the demo: `npm --prefix examples/react-vite run dev`, open the Basic tab, and check highlights, prev/next, page links, zoom.
6. Update `docs/`, README and `CHANGELOG.md` for public API changes.

## Pitfalls

- `string-best-match` throws on empty tokens; always tokenize first.
- Highlights are lost when pdf.js re-renders the text layer; re-apply from `onRenderTextLayerSuccess`.
- eslint-plugin-react-hooks is strict: update refs in effects, not during render; derive state instead of syncing it.
- Inline `citations` arrays must not cause re-matching loops; use `useStableCitations`.
- Commits: Conventional Commits, English, no co-author trailers.

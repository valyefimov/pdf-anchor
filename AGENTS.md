# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository.

## What this is

`pdf-anchor` is an npm package that highlights text citations inside a PDF and lets readers jump between them.

- `src/core/`: framework-agnostic logic (tokenizer, matcher, DOM highlighter). **No React, no react-pdf imports.** Exposed as `pdf-anchor/core`.
- `src/react/`: the React layer. `PdfAnchorViewer.tsx` composes `components/` (Header, CitationPanel, Toolbar, IconButton) with the hooks in `hooks/`.
- `src/styles.css`: the only stylesheet, driven by `--pdf-anchor-*` CSS variables. Published as `pdf-anchor/styles.css`.
- `src/index.ts`: public entry. Everything exported there is public API.
- `tests/`: Vitest + Testing Library (jsdom). `tests/react/mockPdf.tsx` mocks `react-pdf`.
- `examples/react-vite/`: demo app, also deployed to GitHub Pages. Imports the library from `../../src`.
- `docs/`: user documentation. `scripts/make-sample-pdf.mjs` generates the demo PDF.

## Commands

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint (react-hooks rules are strict: no ref writes during render)
npm test            # vitest run
npm run build       # tsup -> dist (ESM + CJS + d.ts + styles.css)
npm run audit:prod  # npm audit --omit=dev
```

Run typecheck, lint, test and build before finishing a change.

## Rules

1. **Matching uses `string-best-match`.** Do not reimplement the matcher. The package is bundled into `dist` (`noExternal` in `tsup.config.ts`) because version 1.1.1 ships extensionless ESM imports that Node cannot resolve; vitest inlines it for the same reason. If upstream fixes this, it can become a normal dependency again.
2. **Keep `src/core` free of React.** The `./core` entry must work on its own.
3. **No runtime dependencies** besides peer dependencies. Do not add CSS-in-JS or a UI kit.
4. **Everything restyleable.** New UI gets a `PdfAnchorSlot`, uses `useSlot()`, and its colors/sizes come from `--pdf-anchor-*` variables. New tokens go into `PdfAnchorTheme`, `src/react/theme.ts`, `src/styles.css` and `docs/theming.md`.
5. **Safe by default.** No `innerHTML`, `dangerouslySetInnerHTML`, `eval`, or building markup from citation data. Render user data as React text.
6. **Tokens passed to `string-best-match` must be non-empty** (empty strings make it throw). `tokenize` guarantees this.
7. **Tests with every behaviour change.** Core logic gets pure tests; React behaviour is tested against the mocked `react-pdf`. Verify real pdf.js behaviour with the demo app.
8. **Docs and changelog.** Public API changes update `docs/`, the README and `CHANGELOG.md`.
9. **English only** in code, comments, docs, demo data and commit messages.
10. **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `ci:`, `refactor:`, `style:`), small and focused. Do not add `Co-Authored-By` trailers.

## Gotchas

- pdf.js re-creates the text layer on every page/zoom/rotation change; highlights must be re-applied from `onRenderTextLayerSuccess` (`useCitationHighlights` does this).
- Highlighting is per text-layer span, not per word.
- Inline `citations={[...]}` props are compared structurally (`useStableCitations`) to avoid effect loops when a parent re-renders from `onHighlight`.
- The demo resolves `pdf-anchor` through a Vite alias; the root `node_modules` must be installed for `string-best-match` and `react-pdf`.

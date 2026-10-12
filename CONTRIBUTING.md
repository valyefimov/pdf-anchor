# Contributing

Thanks for your interest in @vefimov/pdf-anchor.

## Setup

Development needs Node 22.22+ or 24+ (Vitest and jsdom require it). The published package itself runs on Node 18+.

```bash
git clone https://github.com/valyefimov/pdf-anchor
cd pdf-anchor
npm install
```

## Before opening a pull request

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Add or update tests in `tests/` for every behaviour change, and update `docs/` and `CHANGELOG.md` when the public API changes.

## Guidelines

- Keep `src/core` free of React and react-pdf imports. It must stay usable on its own.
- No runtime dependencies beyond `string-best-match` (used for matching) and the peer dependencies.
- Styling goes through `src/styles.css` and `--pdf-anchor-*` variables. Do not add a CSS-in-JS dependency.
- Every new piece of UI needs a slot in `PdfAnchorSlot` so it can be restyled.
- Write commit messages in English using Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
- Keep all repository content (code, comments, docs, demo data) in English.

## Demo app

```bash
cd examples/react-vite
npm install
npm run dev
```

The demo imports the library from `../../src`, so changes show up immediately.

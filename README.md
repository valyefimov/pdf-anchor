<h1 align="center">pdf-anchor</h1>

<p align="center">
  <b>Show people exactly where an answer came from.</b><br />
  Give it a PDF and a list of quotes. It finds each quote in the page text, highlights it,<br />
  and lets readers step from citation to citation.
</p>

<p align="center">
  <a href="https://valyefimov.github.io/pdf-anchor/"><b>Live demo</b></a> ·
  <a href="docs/api.md">API</a> ·
  <a href="docs/theming.md">Theming</a> ·
  <a href="docs/core.md">Core (no React)</a> ·
  <a href="docs/how-it-works.md">How it works</a>
</p>

<p align="center">
  <a href="https://github.com/valyefimov/pdf-anchor/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/valyefimov/pdf-anchor/actions/workflows/ci.yml/badge.svg" /></a>
  <img alt="license" src="https://img.shields.io/badge/license-MIT-blue" />
  <img alt="types" src="https://img.shields.io/badge/types-included-3178c6" />
</p>

---

## Why

AI answers, extracted fields and audit findings are only trustworthy if a human can check them against the source. pdf-anchor turns _"the document says X"_ into _"here, on page 7, highlighted"_, without coordinates, bounding boxes or OCR output from your backend. You send text; it finds the place.

- **Matches text, not positions.** Passages are located with [`string-best-match`](https://github.com/valyefimov/string-best-match) (rolling hash + binary search), so punctuation, casing, line breaks and extra words around the quote don't break it.
- **A complete viewer.** Header, zoom, rotation, page paging, a citation panel with _n of N_ navigation and quick links to every page that carries a citation.
- **Fully themeable.** CSS variables, light/dark/auto, per-element `classNames` and `styles`, translatable labels, and render props to replace whole sections.
- **Headless when you need it.** A hook for your own UI, and a framework-agnostic core that works with any pdf.js text layer.
- **Small and tree-shakeable.** ESM + CJS, `sideEffects` limited to CSS, no CSS-in-JS runtime, no UI library dependency. TypeScript types included.

## Install

```bash
npm install pdf-anchor react react-dom react-pdf pdfjs-dist
```

`react`, `react-dom` and `react-pdf` are peer dependencies (`react` 18 or 19, `react-pdf` 10 or 11). They are optional if you only use [`pdf-anchor/core`](docs/core.md). Install the `pdfjs-dist` version that your `react-pdf` release depends on.


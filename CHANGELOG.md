# Changelog

All notable changes are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/) and the project uses [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-12

### Added

- Keyboard navigation (arrows, `+`/`-`) and a WCAG 2.2 AA accessibility pass with axe tests.
- Dual ESM and CJS build (`string-best-match` 1.1.3 ships both).
- `PdfAnchorViewer` React component built on react-pdf: header, zoom, rotation, paging, citation panel and page links.
- Text matching with `string-best-match` 1.1.3, with `minMatchWords`, `minMatchRatio` and `transformText` options.
- Framework-agnostic `@vefimov/pdf-anchor/core` entry point (`highlightCitations`, `setActiveHighlight`, `clearHighlights`, `matchPassage`, tokenizer).
- `useCitationHighlights` hook for custom UIs.
- Theming through CSS variables, `colorScheme`, `classNames`, `styles`, `labels` and render props.
- Per-citation highlight colors, multi-passage citations, `fallbackFile`, `citationScope`.
- Vite demo app deployed to GitHub Pages, with a generated sample PDF.

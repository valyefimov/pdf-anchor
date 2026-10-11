# Changelog

All notable changes are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/) and the project uses [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-10-11

### Added

- ESM-only package (`string-best-match` publishes ESM only).
- `PdfAnchorViewer` React component built on react-pdf: header, zoom, rotation, paging, citation panel and page links.
- Text matching with `string-best-match` 1.1.2, with `minMatchWords`, `minMatchRatio` and `transformText` options.
- Framework-agnostic `pdf-anchor/core` entry point (`highlightCitations`, `setActiveHighlight`, `clearHighlights`, `matchPassage`, tokenizer).
- `useCitationHighlights` hook for custom UIs.
- Theming through CSS variables, `colorScheme`, `classNames`, `styles`, `labels` and render props.
- Per-citation highlight colors, multi-passage citations, `fallbackFile`, `citationScope`.
- Vite demo app deployed to GitHub Pages, with a generated sample PDF.

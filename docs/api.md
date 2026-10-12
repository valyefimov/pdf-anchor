# API reference

```ts
import { PdfAnchorViewer, configurePdfWorker, useCitationHighlights } from '@vefimov/pdf-anchor';
import '@vefimov/pdf-anchor/styles.css';
```

## `configurePdfWorker(workerSrc)`

Tells pdf.js where its worker lives. Call it once, before the first viewer mounts.

```ts
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'; // Vite
configurePdfWorker(workerSrc);
```

You also need react-pdf's text layer styles: `import 'react-pdf/dist/Page/TextLayer.css'`.

## `<PdfAnchorViewer />`

### Content

| Prop                     | Type                                                   | Description                                     |
| ------------------------ | ------------------------------------------------------ | ----------------------------------------------- |
| `file`                   | `string \| ArrayBuffer \| Blob \| { url } \| { data }` | The PDF. Required.                              |
| `fallbackFile`           | same                                                   | Used when `file` fails to load.                 |
| `citations`              | `PdfCitation[]`                                        | Passages to highlight.                          |
| `title`, `subtitle`      | `ReactNode`                                            | Header texts.                                   |
| `heading`, `description` | `ReactNode`                                            | Headline and explanation in the citation panel. |

### `PdfCitation`

| Field   | Type                 | Description                                                                      |
| ------- | -------------------- | -------------------------------------------------------------------------------- |
| `page`  | `number`             | 1-based page. Required.                                                          |
| `text`  | `string \| string[]` | What to locate. An array highlights several passages for one citation. Required. |
| `id`    | `string`             | Stable id (defaults to the index).                                               |
| `title` | `string`             | Label above the quote in the panel.                                              |
| `quote` | `string`             | Text shown in the panel (defaults to `text`).                                    |
| `color` | `string`             | Highlight color for this citation.                                               |
| `meta`  | `unknown`            | Carried through to callbacks untouched.                                          |

### Behaviour

| Prop                                | Default                         | Description                                                                                                     |
| ----------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `initialPage`                       | first citation's page, else `1` | Page to open first.                                                                                             |
| `initialCitationIndex`              | `0`                             | Citation to activate first.                                                                                     |
| `citationScope`                     | `'page'`                        | `'page'`: prev/next cycle the current page's citations. `'document'`: they walk all citations and change pages. |
| `initialScale`                      | `100`                           | Zoom in percent.                                                                                                |
| `minScale`, `maxScale`, `scaleStep` | `50`, `250`, `10`               | Zoom bounds and step.                                                                                           |
| `initialRotation`                   | `0`                             | Degrees clockwise (multiple of 90).                                                                             |
| `highlight`                         |                                 | Matcher and highlighter options, see [core](core.md).                                                           |
| `scrollToActive`                    | `true`                          | Scroll the active highlight into view.                                                                          |
| `keyboardNavigation`                | `true`                          | Arrow keys and `+`/`-` while focus is inside the viewer, see [accessibility](accessibility.md).                 |

### Appearance

| Prop                                                   | Description                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| `theme`, `colorScheme`                                 | Design tokens and light/dark/auto. See [theming](theming.md). |
| `className`, `style`                                   | On the root element.                                          |
| `classNames`, `styles`                                 | Per-slot overrides.                                           |
| `labels`                                               | Override built-in texts.                                      |
| `showHeader`, `showRotate`, `showToolbar`, `showPanel` | Toggle parts (all `true`).                                    |
| `renderHeader`, `renderPanel`, `renderToolbar`         | Replace a part; receive `{ state, actions, labels }`.         |
| `renderLoading`, `renderError`                         | Replace the loading / error message.                          |

### Callbacks

| Prop                     | Signature                                                                        |
| ------------------------ | -------------------------------------------------------------------------------- |
| `onPageChange`           | `(page: number) => void`                                                         |
| `onActiveCitationChange` | `(index: number \| null, citation: PdfCitation \| null) => void`                 |
| `onHighlight`            | `(results: HighlightResult[], page: number) => void`, after each page is matched |
| `onDocumentLoad`         | `({ numPages }) => void`                                                         |
| `onLoadError`            | `(error: Error) => void`, after the fallback also failed                         |

### Render context

`state`: `page`, `numPages`, `scale`, `rotation`, `citations`, `pageCitations`, `citationPages`, `activeIndex`, `activeCitation`, `activePosition`, `scopeCount`, `activeFound`.

`actions`: `goToPage`, `nextPage`, `previousPage`, `zoomIn`, `zoomOut`, `setScale`, `rotateLeft`, `rotateRight`, `selectCitation(index)`, `nextCitation`, `previousCitation`.

### Interaction

- Keyboard: left/right arrows switch citations, up/down arrows switch pages, `+`/`-` zoom.
- Click a highlighted fragment to activate its citation.
- Prev/next in the panel move between citations; the page links in the toolbar jump to a citation page.

## `useCitationHighlights(options)`

Headless hook for building your own UI on top of react-pdf.

```tsx
const containerRef = useRef<HTMLDivElement>(null);
const { results, notifyTextLayerRendered } = useCitationHighlights({
  containerRef,
  citations: pageCitations, // only the citations of the rendered page
  activeIndex, // index into pageCitations, or null
});

<div ref={containerRef}>
  <Document file={file}>
    <Page pageNumber={page} onRenderTextLayerSuccess={notifyTextLayerRendered} />
  </Document>
</div>;
```

| Option           | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `containerRef`   | Element that contains the text layer.                          |
| `citations`      | Citations of the rendered page.                                |
| `activeIndex`    | Which one to emphasise.                                        |
| `highlight`      | Matcher/highlighter options. Read when the text layer renders. |
| `scrollToActive` | Default `true`.                                                |
| `onResults`      | Called with the `HighlightResult[]`.                           |

## Other exports

`defaultLabels`, `themeToStyle`, and everything from [`@vefimov/pdf-anchor/core`](core.md). All types are exported.

## Next.js and other SSR frameworks

The viewer touches the DOM and pdf.js, so render it on the client: add `'use client'` to the file that uses it (App Router) or load it with `next/dynamic(..., { ssr: false })`.

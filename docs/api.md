# API reference

```ts
import { PdfAnchorViewer, configurePdfWorker, useCitationHighlights } from 'pdf-anchor';
import 'pdf-anchor/styles.css';
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


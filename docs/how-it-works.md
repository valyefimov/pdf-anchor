# How matching works

`@vefimov/pdf-anchor` does not need character offsets, coordinates or an OCR layer. It works on the text layer that pdf.js already renders into the DOM.

## Pipeline

1. **Render.** `react-pdf` renders a page and builds a _text layer_: one `<span role="presentation">` per run of text, positioned over the canvas.
2. **Collect.** `collectTextElements` returns the leaf spans in reading order. Wrapper elements such as `.markedContent` are skipped.
3. **Tokenize.** Every span is split into lowercase unicode words (`/[\p{L}\p{N}]+/gu`) and appended to one flat word list for the page. A parallel array remembers which span each word came from.
4. **Match.** Each citation passage is tokenized the same way and handed to [`string-best-match`](https://github.com/valyefimov/string-best-match), which finds the longest run of words shared by the passage and the page (rolling hash + binary search, `O((N + M) log min(N, M))`). The page is the _target_, so the returned `startIndex` points straight into the page word list.
5. **Mark.** The spans that own the matched words get the `pdf-anchor-highlight` class, a `data-pdf-anchor-index` attribute and, when the citation has a `color`, the `--pdf-anchor-highlight-color` custom property.
6. **Activate.** The active citation's spans additionally get `pdf-anchor-highlight--active`, and the first one is scrolled into view.

Because words are compared, not characters, the match survives differences in punctuation, case, hyphenation of numbers and line breaks. Because it is the _longest shared run_, the passage may contain extra words (a prefix such as `Condition:` or a trailing note) and the page may contain text before and after.

## What gets highlighted

Highlighting is **per text-layer span**, not per word. If a matched phrase starts in the middle of a span, the whole span is highlighted. This keeps the DOM changes trivial (a class on an existing element) and avoids touching pdf.js' layout.

## Thresholds

By default a single matching word is enough, which is forgiving but can produce false positives for short passages. Raise the bar with:

| Option          | Meaning                                                               |
| --------------- | --------------------------------------------------------------------- |
| `minMatchWords` | The longest shared run must have at least this many words.            |
| `minMatchRatio` | The run must cover at least this share (0..1) of the passage's words. |
| `transformText` | Clean a passage before matching (strip prefixes, dates, markup).      |

A citation whose passage does not reach the threshold is reported as _not found_: nothing is highlighted and the panel shows a note.

## Multiple passages

`text` may be an array. Each passage is matched independently and the union of their spans is highlighted as one citation.

## Re-rendering

pdf.js re-creates the text layer whenever the page, zoom or rotation changes. `onRenderTextLayerSuccess` fires after each render; the viewer then clears old marks and matches again. Citations passed inline (`citations={[...]}`) are compared structurally, so a parent re-render does not re-run the matcher.

## Limits

- The PDF needs a text layer. Scanned images without OCR have nothing to match.
- Words that pdf.js splits across spans in an unusual order (multi-column layouts, tables) are matched in DOM order.
- A passage is located on one page. To cite text that spans pages, add one citation per page.

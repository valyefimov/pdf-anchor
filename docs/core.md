# Framework-agnostic core

`@efa/pdf-anchor/core` has no React and no react-pdf dependency. It only needs a DOM that contains a rendered pdf.js text layer, so it works with plain pdf.js, Vue, Svelte, Angular or server-side tooling over jsdom.

```ts
import {
  highlightCitations,
  setActiveHighlight,
  scrollToHighlight,
  clearHighlights,
} from '@efa/pdf-anchor/core';
```

## Highlight a rendered page

```ts
const container = document.querySelector('#viewer')!; // contains the pdf.js text layer

const results = highlightCitations(container, [
  { page: 1, text: 'type 2 diabetes mellitus' },
  { page: 1, text: ['metformin 500 mg', 'twice daily'], color: '#10b981' },
]);

results.forEach((r) => console.log(r.index, r.found, r.matchedWords, '/', r.totalWords));

const elements = setActiveHighlight(container, 1); // emphasise the second citation
scrollToHighlight(elements);
```

Call `highlightCitations` again after pdf.js re-renders the text layer (zoom, rotation, page change). It clears earlier marks first. Pass only the citations of the page that is currently rendered.

Include the stylesheet so the classes have a look:

```ts
import '@efa/pdf-anchor/styles.css';
```

## Reference

### `highlightCitations(root, citations, options?)`

Returns one `HighlightResult` per citation:

| Field                         | Description                                   |
| ----------------------------- | --------------------------------------------- |
| `index`                       | Position in the `citations` array.            |
| `id`                          | `citation.id`, or the index as a string.      |
| `found`                       | Whether at least one passage was located.     |
| `elements`                    | The marked text-layer spans.                  |
| `matchedWords` / `totalWords` | Coverage summed over the citation's passages. |

Options (`HighlightOptions`): `textSelector` (default `[role="presentation"]`), `highlightClass`, `activeClass`, plus the matcher options `minMatchWords`, `minMatchRatio`, `transformText`.

### `setActiveHighlight(root, index | null, options?)`

Toggles the active class and returns the elements of that citation.

### `clearHighlights(root, options?)`

Removes classes, data attributes and the color property that `highlightCitations` added.

### `scrollToHighlight(elements, behavior?)`

Scrolls the first element into view (`block: 'center'`).

### `matchPassage(pageWords, passage, options?)`

Pure function: returns `{ start, length, queryLength }` or `null`. Useful for tests and for server-side checks that a quote really occurs in a document.

### `tokenize(text)` and `tokenizeFragments(fragments)`

The tokenizer used everywhere. `tokenizeFragments` returns `{ words, elementIndex }`.

### Constants

`HIGHLIGHT_CLASS`, `ACTIVE_CLASS`, `INDEX_ATTR`, `INDICES_ATTR`, `COLOR_PROPERTY`, `DEFAULT_TEXT_SELECTOR`.

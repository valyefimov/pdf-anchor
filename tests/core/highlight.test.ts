import {
  ACTIVE_CLASS,
  HIGHLIGHT_CLASS,
  clearHighlights,
  collectTextElements,
  highlightCitations,
  setActiveHighlight,
} from '../../src/core/highlight';

function renderTextLayer(fragments: string[]): HTMLElement {
  const layer = document.createElement('div');
  layer.className = 'textLayer';
  for (const text of fragments) {
    const span = document.createElement('span');
    span.setAttribute('role', 'presentation');
    span.textContent = text;
    layer.appendChild(span);
  }
  document.body.replaceChildren(layer);
  return layer;
}

const fragments = [
  'Discharge summary for',
  'John Doe.',
  'Patient was admitted',
  'with chest pain and',
  'treated for type 2',
  'diabetes. Follow up in',
  'two weeks.',
];

describe('collectTextElements', () => {
  it('skips wrappers that contain other elements', () => {
    const layer = renderTextLayer(['one', 'two']);
    const wrapper = document.createElement('span');
    wrapper.setAttribute('role', 'presentation');
    wrapper.appendChild(layer.firstElementChild!);
    layer.appendChild(wrapper);

    const elements = collectTextElements(layer);
    expect(elements).toHaveLength(2);
    expect(elements).not.toContain(wrapper);
  });
});

describe('highlightCitations', () => {
  it('highlights the fragments that hold the matched words', () => {
    const layer = renderTextLayer(fragments);
    const [result] = highlightCitations(layer, [{ page: 1, text: 'treated for type 2 diabetes' }]);

    expect(result?.found).toBe(true);
    expect(result?.elements.map((el) => el.textContent)).toEqual([
      'treated for type 2',
      'diabetes. Follow up in',
    ]);
    expect(layer.querySelectorAll(`.${HIGHLIGHT_CLASS}`)).toHaveLength(2);
  });

  it('reports citations that are not on the page', () => {
    const layer = renderTextLayer(fragments);
    const [result] = highlightCitations(layer, [{ page: 1, text: 'nothing to see here' }]);

    expect(result).toMatchObject({ found: false, elements: [], matchedWords: 0 });
    expect(layer.querySelector(`.${HIGHLIGHT_CLASS}`)).toBeNull();
  });

  it('highlights each passage of a multi-passage citation', () => {
    const layer = renderTextLayer(fragments);
    const [result] = highlightCitations(layer, [
      { page: 1, text: ['Discharge summary', 'follow up in two weeks'] },
    ]);

    expect(result?.found).toBe(true);
    expect(result?.matchedWords).toBe(7);
    expect(layer.querySelectorAll(`.${HIGHLIGHT_CLASS}`).length).toBeGreaterThanOrEqual(3);
  });

  it('applies the per-citation color', () => {
    const layer = renderTextLayer(fragments);
    highlightCitations(layer, [{ page: 1, text: 'chest pain', color: 'rgb(255, 0, 0)' }]);

    const el = layer.querySelector<HTMLElement>(`.${HIGHLIGHT_CLASS}`);
    expect(el?.style.getPropertyValue('--pdf-anchor-highlight-color')).toBe('rgb(255, 0, 0)');
  });

  it('is idempotent: re-running replaces earlier highlights', () => {
    const layer = renderTextLayer(fragments);
    highlightCitations(layer, [{ page: 1, text: 'chest pain' }]);
    highlightCitations(layer, [{ page: 1, text: 'John Doe' }]);

    const highlighted = Array.from(layer.querySelectorAll(`.${HIGHLIGHT_CLASS}`));
    expect(highlighted.map((el) => el.textContent)).toEqual(['John Doe.']);
  });

  it('tracks overlapping citations on the same fragment', () => {
    const layer = renderTextLayer(fragments);
    highlightCitations(layer, [
      { page: 1, text: 'chest pain' },
      { page: 1, text: 'with chest pain and' },
    ]);

    const el = layer.querySelector('[data-pdf-anchor-indices]');
    expect(el?.getAttribute('data-pdf-anchor-indices')).toBe('0 1');
    expect(el?.getAttribute('data-pdf-anchor-index')).toBe('0');
  });

  it('honours custom selectors and classes', () => {
    document.body.innerHTML = '<p class="t">hello brave world</p>';
    const [result] = highlightCitations(document.body, [{ page: 1, text: 'brave world' }], {
      textSelector: '.t',
      highlightClass: 'mark',
    });
    expect(result?.found).toBe(true);
    expect(document.querySelector('.mark')).not.toBeNull();
  });
});

describe('setActiveHighlight / clearHighlights', () => {
  it('toggles the active class for one citation', () => {
    const layer = renderTextLayer(fragments);
    highlightCitations(layer, [
      { page: 1, text: 'chest pain' },
      { page: 1, text: 'John Doe' },
    ]);

    const active = setActiveHighlight(layer, 1);
    expect(active.map((el) => el.textContent)).toEqual(['John Doe.']);
    expect(layer.querySelectorAll(`.${ACTIVE_CLASS}`)).toHaveLength(1);

    setActiveHighlight(layer, null);
    expect(layer.querySelector(`.${ACTIVE_CLASS}`)).toBeNull();
  });

  it('removes every trace of a highlight', () => {
    const layer = renderTextLayer(fragments);
    highlightCitations(layer, [{ page: 1, text: 'chest pain', color: 'red' }]);
    clearHighlights(layer);

    expect(layer.querySelector('[data-pdf-anchor-indices]')).toBeNull();
    expect(layer.querySelector(`.${HIGHLIGHT_CLASS}`)).toBeNull();
    expect(layer.querySelector<HTMLElement>('[style]')?.style.length ?? 0).toBe(0);
  });
});

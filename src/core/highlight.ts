import { matchPassage } from './match';
import { tokenizeFragments } from './tokenize';
import type { MatchOptions, PdfCitation } from './types';

export const HIGHLIGHT_CLASS = 'pdf-anchor-highlight';
export const ACTIVE_CLASS = 'pdf-anchor-highlight--active';
export const INDEX_ATTR = 'data-pdf-anchor-index';
export const INDICES_ATTR = 'data-pdf-anchor-indices';
export const COLOR_PROPERTY = '--pdf-anchor-highlight-color';

/** pdf.js marks every text-layer fragment with `role="presentation"`. */
export const DEFAULT_TEXT_SELECTOR = '[role="presentation"]';

export interface HighlightOptions extends MatchOptions {
  /** Selector for the text-layer fragments. Defaults to `[role="presentation"]`. */
  textSelector?: string;
  /** Class added to highlighted fragments. */
  highlightClass?: string;
  /** Class added to fragments of the active citation. */
  activeClass?: string;
}

export interface HighlightResult {
  /** Position of the citation in the list that was passed in. */
  index: number;
  id: string;
  found: boolean;
  elements: HTMLElement[];
  /** Words covered by the best run, summed over all passages of the citation. */
  matchedWords: number;
  /** Words in the citation's passages, summed. */
  totalWords: number;
}

/** Returns the leaf text fragments of a rendered text layer, in reading order. */
export function collectTextElements(
  root: ParentNode,
  selector: string = DEFAULT_TEXT_SELECTOR,
): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => element.childElementCount === 0,
  );
}

/** Removes every highlight previously applied by {@link highlightCitations}. */
export function clearHighlights(root: ParentNode, options: HighlightOptions = {}): void {
  const { highlightClass = HIGHLIGHT_CLASS, activeClass = ACTIVE_CLASS } = options;

  root.querySelectorAll<HTMLElement>(`[${INDICES_ATTR}]`).forEach((element) => {
    element.classList.remove(highlightClass, activeClass);
    element.removeAttribute(INDEX_ATTR);
    element.removeAttribute(INDICES_ATTR);
    element.style.removeProperty(COLOR_PROPERTY);
  });
}

function toPassages(citation: PdfCitation): string[] {
  return Array.isArray(citation.text) ? citation.text : [citation.text];
}

/**
 * Locates every citation inside the rendered text layer under `root` and marks
 * the matching fragments. Highlights from earlier calls are cleared first.
 */
export function highlightCitations(
  root: ParentNode,
  citations: readonly PdfCitation[],
  options: HighlightOptions = {},
): HighlightResult[] {
  const { textSelector, highlightClass = HIGHLIGHT_CLASS } = options;

  clearHighlights(root, options);

  const elements = collectTextElements(root, textSelector);
  const page = tokenizeFragments(elements.map((element) => element.textContent ?? ''));

  return citations.map((citation, index) => {
    const matched = new Set<HTMLElement>();
    let matchedWords = 0;
    let totalWords = 0;

    for (const passage of toPassages(citation)) {
      const match = matchPassage(page.words, passage, options);
      if (!match) {
        continue;
      }

      matchedWords += match.length;
      totalWords += match.queryLength;
      for (let i = match.start; i < match.start + match.length; i++) {
        const element = elements[page.elementIndex[i] as number];
        if (element) {
          matched.add(element);
        }
      }
    }

    for (const element of matched) {
      const indices = (element.getAttribute(INDICES_ATTR) ?? '').split(' ').filter(Boolean);
      indices.push(String(index));

      element.classList.add(highlightClass);
      element.setAttribute(INDICES_ATTR, indices.join(' '));
      if (!element.hasAttribute(INDEX_ATTR)) {
        element.setAttribute(INDEX_ATTR, String(index));
        if (citation.color) {
          element.style.setProperty(COLOR_PROPERTY, citation.color);
        }
      }
    }

    return {
      index,
      id: citation.id ?? String(index),
      found: matched.size > 0,
      elements: Array.from(matched),
      matchedWords,
      totalWords,
    };
  });
}

/** Marks one citation's fragments as active and returns them (empty if none). */
export function setActiveHighlight(
  root: ParentNode,
  index: number | null,
  options: HighlightOptions = {},
): HTMLElement[] {
  const { activeClass = ACTIVE_CLASS } = options;
  const active: HTMLElement[] = [];

  root.querySelectorAll<HTMLElement>(`[${INDICES_ATTR}]`).forEach((element) => {
    const isActive =
      index !== null && (element.getAttribute(INDICES_ATTR) ?? '').split(' ').includes(String(index));
    element.classList.toggle(activeClass, isActive);
    if (isActive) {
      active.push(element);
    }
  });

  return active;
}

/** Scrolls the first of the given elements into view. */
export function scrollToHighlight(
  elements: readonly HTMLElement[],
  behavior: ScrollBehavior = 'smooth',
): void {
  elements[0]?.scrollIntoView?.({ behavior, block: 'center', inline: 'nearest' });
}

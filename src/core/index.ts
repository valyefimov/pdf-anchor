export type {
  MatchOptions,
  PageWords,
  PdfCitation,
  WordMatch,
} from './types';
export { tokenize, tokenizeFragments } from './tokenize';
export { matchPassage } from './match';
export {
  ACTIVE_CLASS,
  COLOR_PROPERTY,
  DEFAULT_TEXT_SELECTOR,
  HIGHLIGHT_CLASS,
  INDEX_ATTR,
  INDICES_ATTR,
  clearHighlights,
  collectTextElements,
  highlightCitations,
  scrollToHighlight,
  setActiveHighlight,
} from './highlight';
export type { HighlightOptions, HighlightResult } from './highlight';

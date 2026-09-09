/** A passage of text that should be located and highlighted inside a PDF page. */
export interface PdfCitation {
  /** Stable identifier. Falls back to the citation's position in the list. */
  id?: string;
  /** 1-based page number the citation lives on. */
  page: number;
  /**
   * Text to locate on the page. Pass an array to highlight several independent
   * passages that belong to the same citation.
   */
  text: string | string[];
  /** Short label rendered above the quote in the citation panel. */
  title?: string;
  /** Text shown in the citation panel. Defaults to `text`. */
  quote?: string;
  /** CSS color used for this citation's highlight. Overrides the theme color. */
  color?: string;
  /** Anything you want to carry along; handed back untouched in callbacks. */
  meta?: unknown;
}

/** Tuning knobs for the text matcher. */
export interface MatchOptions {
  /**
   * Minimum number of consecutive words that must match for a passage to count
   * as found. Defaults to `1`.
   */
  minMatchWords?: number;
  /**
   * Minimum share (0..1) of the citation's words that must be covered by the
   * matched run. Defaults to `0`.
   */
  minMatchRatio?: number;
  /**
   * Runs on every citation passage before it is tokenized. Handy for stripping
   * prefixes, dates or markup that never appears in the PDF itself.
   */
  transformText?: (text: string) => string;
}

/** Location of a matched run inside a page's flat word list. */
export interface WordMatch {
  /** Index of the first matched word in the page word list. */
  start: number;
  /** Number of matched words. */
  length: number;
  /** Number of words in the searched passage. */
  queryLength: number;
}

/** A word together with the text-layer element it was found in. */
export interface PageWords {
  words: string[];
  /** `elementIndex[i]` is the index of the element that holds `words[i]`. */
  elementIndex: number[];
}

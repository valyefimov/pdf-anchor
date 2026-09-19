import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import {
  clearHighlights,
  highlightCitations,
  scrollToHighlight,
  setActiveHighlight,
} from '../../core';
import type { HighlightOptions, HighlightResult, PdfCitation } from '../../core';

export interface UseCitationHighlightsOptions {
  /** Element that contains the rendered text layer. */
  containerRef: RefObject<HTMLElement | null>;
  /** Citations of the page that is currently rendered. */
  citations: readonly PdfCitation[];
  /** Index into `citations` to emphasise and scroll to, or `null`. */
  activeIndex: number | null;
  highlight?: HighlightOptions;
  scrollToActive?: boolean;
  onResults?: (results: HighlightResult[]) => void;
}

export interface UseCitationHighlightsResult {
  results: HighlightResult[];
  /** Call whenever the text layer of the page has been (re)rendered. */
  notifyTextLayerRendered: () => void;
}

/**
 * Headless building block: matches citations against a rendered pdf.js text layer
 * and keeps the active one emphasised. Use it to build your own viewer UI.
 */
export function useCitationHighlights({
  containerRef,
  citations,
  activeIndex,
  highlight,
  scrollToActive = true,
  onResults,
}: UseCitationHighlightsOptions): UseCitationHighlightsResult {
  const [renderVersion, setRenderVersion] = useState(0);
  const [results, setResults] = useState<HighlightResult[]>([]);
  const onResultsRef = useRef(onResults);
  const highlightRef = useRef(highlight);
  const scrollRef = useRef(scrollToActive);

  useEffect(() => {
    onResultsRef.current = onResults;
    highlightRef.current = highlight;
    scrollRef.current = scrollToActive;
  });

  const notifyTextLayerRendered = useCallback(() => setRenderVersion((version) => version + 1), []);

  // Match and mark. Runs after each text-layer render and when the citations change.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || renderVersion === 0) {
      return;
    }

    const next = highlightCitations(container, citations, highlightRef.current);
    setResults(next);
    onResultsRef.current?.(next);

    return () => clearHighlights(container, highlightRef.current);
  }, [containerRef, citations, renderVersion]);

  // Move emphasis (and scroll) when only the active citation changes.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || renderVersion === 0) {
      return;
    }

    const elements = setActiveHighlight(container, activeIndex, highlightRef.current);
    if (activeIndex !== null && scrollRef.current) {
      scrollToHighlight(elements);
    }
  }, [containerRef, activeIndex, renderVersion]);

  return { results, notifyTextLayerRendered };
}

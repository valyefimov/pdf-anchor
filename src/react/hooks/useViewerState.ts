import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PdfCitation } from '../../core';
import type { PdfAnchorActions, PdfAnchorState } from '../types';

export interface UseViewerStateOptions {
  citations: readonly PdfCitation[];
  initialPage?: number;
  initialScale?: number;
  initialRotation?: number;
  initialCitationIndex?: number;
  minScale: number;
  maxScale: number;
  scaleStep: number;
  citationScope: 'page' | 'document';
  onPageChange?: (page: number) => void;
  onActiveCitationChange?: (index: number | null, citation: PdfCitation | null) => void;
}

export interface ViewerStateResult {
  state: Omit<PdfAnchorState, 'activeFound'>;
  actions: PdfAnchorActions;
  /** Indices (into `citations`) of the citations on the current page. */
  pageIndices: readonly number[];
  setNumPages: (numPages: number) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const normalizeRotation = (degrees: number) => ((degrees % 360) + 360) % 360;

/** Page, zoom, rotation and active-citation state shared by the built-in UI. */
export function useViewerState(options: UseViewerStateOptions): ViewerStateResult {
  const {
    citations,
    minScale,
    maxScale,
    scaleStep,
    citationScope,
    onPageChange,
    onActiveCitationChange,
  } = options;

  const startIndex =
    options.initialCitationIndex !== undefined && citations[options.initialCitationIndex]
      ? options.initialCitationIndex
      : citations.length > 0
        ? 0
        : null;

  const [page, setPage] = useState(
    () => options.initialPage ?? (startIndex !== null ? citations[startIndex]?.page : undefined) ?? 1,
  );
  const [numPages, setNumPages] = useState(0);
  const [scale, setScaleState] = useState(() => clamp(options.initialScale ?? 100, minScale, maxScale));
  const [rotation, setRotation] = useState(() => normalizeRotation(options.initialRotation ?? 0));
  const [activeIndex, setActiveIndex] = useState<number | null>(startIndex);

  const callbacks = useRef({ onPageChange, onActiveCitationChange });
  useEffect(() => {
    callbacks.current = { onPageChange, onActiveCitationChange };
  });

  const pageIndices = useMemo(
    () => citations.flatMap((citation, index) => (citation.page === page ? [index] : [])),
    [citations, page],
  );
  const pageCitations = useMemo(
    () => pageIndices.map((index) => citations[index] as PdfCitation),
    [citations, pageIndices],
  );
  const citationPages = useMemo(
    () => [...new Set(citations.map((citation) => citation.page))].sort((a, b) => a - b),
    [citations],
  );

  const activate = useCallback(
    (index: number | null) => {
      setActiveIndex(index);
      callbacks.current.onActiveCitationChange?.(index, index === null ? null : (citations[index] ?? null));
    },
    [citations],
  );

  const changePage = useCallback(
    (next: number, activateFirst = true) => {
      const target = numPages > 0 ? clamp(next, 1, numPages) : Math.max(1, next);
      setPage(target);
      callbacks.current.onPageChange?.(target);

      if (activateFirst) {
        const first = citations.findIndex((citation) => citation.page === target);
        activate(first === -1 ? null : first);
      }
    },
    [activate, citations, numPages],
  );

  const scopeIndices = citationScope === 'document' ? citations.map((_, i) => i) : pageIndices;
  const activePositionInScope = activeIndex === null ? -1 : scopeIndices.indexOf(activeIndex);

  const stepCitation = useCallback(
    (direction: 1 | -1) => {
      const target = scopeIndices[activePositionInScope + direction];
      if (target === undefined) {
        return;
      }
      const targetPage = citations[target]?.page;
      if (targetPage !== undefined && targetPage !== page) {
        setPage(targetPage);
        callbacks.current.onPageChange?.(targetPage);
      }
      activate(target);
    },
    // scopeIndices is derived from the dependencies below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activate, activePositionInScope, citations, page, citationScope, pageIndices],
  );

  const actions = useMemo<PdfAnchorActions>(
    () => ({
      goToPage: (target) => changePage(target),
      nextPage: () => changePage(page + 1),
      previousPage: () => changePage(page - 1),
      zoomIn: () => setScaleState((value) => clamp(value + scaleStep, minScale, maxScale)),
      zoomOut: () => setScaleState((value) => clamp(value - scaleStep, minScale, maxScale)),
      setScale: (value) => setScaleState(clamp(value, minScale, maxScale)),
      rotateLeft: () => setRotation((value) => normalizeRotation(value - 90)),
      rotateRight: () => setRotation((value) => normalizeRotation(value + 90)),
      selectCitation: (index) => {
        const citation = citations[index];
        if (!citation) {
          return;
        }
        if (citation.page !== page) {
          changePage(citation.page, false);
        }
        activate(index);
      },
      nextCitation: () => stepCitation(1),
      previousCitation: () => stepCitation(-1),
    }),
    [activate, changePage, citations, maxScale, minScale, page, scaleStep, stepCitation],
  );

  const activeCitation = activeIndex === null ? null : (citations[activeIndex] ?? null);

  return {
    state: {
      page,
      numPages,
      scale,
      rotation,
      citations,
      pageCitations,
      citationPages,
      activeIndex,
      activeCitation,
      activePosition: activePositionInScope + 1,
      scopeCount: scopeIndices.length,
    },
    actions,
    pageIndices,
    setNumPages,
  };
}

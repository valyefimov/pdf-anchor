import { useState } from 'react';
import type { PdfCitation } from '../../core';

const sameText = (a: PdfCitation['text'], b: PdfCitation['text']) =>
  Array.isArray(a) || Array.isArray(b)
    ? Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i])
    : a === b;

function sameCitations(a: readonly PdfCitation[], b: readonly PdfCitation[]): boolean {
  return (
    a.length === b.length &&
    a.every((left, index) => {
      const right = b[index] as PdfCitation;
      return (
        left.page === right.page &&
        left.id === right.id &&
        left.color === right.color &&
        left.title === right.title &&
        left.quote === right.quote &&
        left.meta === right.meta &&
        sameText(left.text, right.text)
      );
    })
  );
}

const EMPTY: readonly PdfCitation[] = [];

/**
 * Returns the previous array while the citations are structurally unchanged, so
 * consumers can pass an inline `citations={[...]}` without re-running the matcher.
 */
export function useStableCitations(
  citations: readonly PdfCitation[] | undefined,
): readonly PdfCitation[] {
  const next = citations ?? EMPTY;
  const [stable, setStable] = useState(next);

  if (stable !== next && !sameCitations(stable, next)) {
    setStable(next);
    return next;
  }

  return stable;
}

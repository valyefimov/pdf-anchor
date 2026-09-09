import type { PageWords } from './types';

const WORD = /[\p{L}\p{N}]+/gu;

/** Splits text into lowercase unicode words, dropping punctuation and spacing. */
export function tokenize(text: string): string[] {
  return text.toLowerCase().match(WORD) ?? [];
}

/**
 * Tokenizes a sequence of text fragments (for example the spans of a PDF text
 * layer) into one flat word list while remembering which fragment each word
 * came from.
 */
export function tokenizeFragments(fragments: readonly string[]): PageWords {
  const words: string[] = [];
  const elementIndex: number[] = [];

  fragments.forEach((fragment, index) => {
    for (const word of tokenize(fragment)) {
      words.push(word);
      elementIndex.push(index);
    }
  });

  return { words, elementIndex };
}

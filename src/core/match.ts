import { findBestMatch } from 'string-best-match';
import { tokenize } from './tokenize';
import type { MatchOptions, WordMatch } from './types';

/**
 * Finds the longest run of words shared by a citation passage and a page.
 *
 * The page words are the *target* of the search so the returned index points
 * straight into the page word list, which is what the highlighter needs.
 */
export function matchPassage(
  pageWords: readonly string[],
  passage: string,
  options: MatchOptions = {},
): WordMatch | null {
  const { minMatchWords = 1, minMatchRatio = 0, transformText } = options;

  const queryWords = tokenize(transformText ? transformText(passage) : passage);
  if (queryWords.length === 0 || pageWords.length === 0) {
    return null;
  }

  const { startIndex, sequenceLength } = findBestMatch(queryWords, [...pageWords]);
  if (startIndex < 0 || sequenceLength === 0) {
    return null;
  }

  const requiredWords = Math.max(minMatchWords, Math.ceil(minMatchRatio * queryWords.length));
  if (sequenceLength < requiredWords) {
    return null;
  }

  return { start: startIndex, length: sequenceLength, queryLength: queryWords.length };
}

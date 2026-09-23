import { tokenize, tokenizeFragments } from '../../src/core/tokenize';

describe('tokenize', () => {
  it('lowercases and strips punctuation', () => {
    expect(tokenize("Hello, World! It's 2026.")).toEqual(['hello', 'world', 'it', 's', '2026']);
  });

  it('keeps non-latin letters', () => {
    expect(tokenize('Γειά σου, κόσμε — café')).toEqual(['γειά', 'σου', 'κόσμε', 'café']);
  });

  it('returns an empty list for blank input', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize(' \n\t ')).toEqual([]);
  });
});

describe('tokenizeFragments', () => {
  it('maps every word back to its fragment', () => {
    const { words, elementIndex } = tokenizeFragments(['Patient has', '', 'type 2 diabetes']);
    expect(words).toEqual(['patient', 'has', 'type', '2', 'diabetes']);
    expect(elementIndex).toEqual([0, 0, 2, 2, 2]);
  });
});

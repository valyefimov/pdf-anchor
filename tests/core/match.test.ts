import { tokenize } from '../../src/core/tokenize';
import { matchPassage } from '../../src/core/match';

const page = tokenize(
  'Discharge summary. The patient was admitted with chest pain and treated for type 2 diabetes.',
);

describe('matchPassage', () => {
  it('returns the page index of the longest shared run', () => {
    const match = matchPassage(page, 'treated for type 2 diabetes');
    expect(match).toEqual({ start: page.indexOf('treated'), length: 5, queryLength: 5 });
  });

  it('tolerates extra words around the passage', () => {
    const match = matchPassage(page, 'History: admitted with chest pain (see ER notes)');
    expect(match?.start).toBe(page.indexOf('admitted'));
    expect(match?.length).toBe(4);
  });

  it('returns null when nothing is shared', () => {
    expect(matchPassage(page, 'completely unrelated sentence')).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(matchPassage(page, '   ')).toBeNull();
    expect(matchPassage([], 'anything')).toBeNull();
  });

  it('enforces minMatchWords', () => {
    expect(matchPassage(page, 'the quick brown fox', { minMatchWords: 2 })).toBeNull();
    expect(matchPassage(page, 'the patient was lost', { minMatchWords: 3 })?.length).toBe(3);
  });

  it('enforces minMatchRatio', () => {
    expect(matchPassage(page, 'chest pain on exertion only', { minMatchRatio: 0.8 })).toBeNull();
    expect(
      matchPassage(page, 'chest pain on exertion only', { minMatchRatio: 0.4 }),
    ).not.toBeNull();
  });

  it('applies transformText before matching', () => {
    const match = matchPassage(page, 'Condition: type 2 diabetes', {
      transformText: (text) => text.replace(/^condition:/i, ''),
    });
    expect(match?.length).toBe(3);
    expect(match?.queryLength).toBe(3);
  });
});

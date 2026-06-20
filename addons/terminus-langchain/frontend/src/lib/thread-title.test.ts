import { describe, expect, it } from 'vitest';

import { storedThreadTitle } from './thread-title';

describe('storedThreadTitle', () => {
  it('returns the trimmed title stored in metadata', () => {
    expect(storedThreadTitle({ metadata: { title: '  Living Room Lights  ' } })).toBe('Living Room Lights');
  });

  it('returns undefined when there is no title', () => {
    expect(storedThreadTitle({ metadata: { archived: true } })).toBeUndefined();
    expect(storedThreadTitle({ metadata: null })).toBeUndefined();
    expect(storedThreadTitle({})).toBeUndefined();
  });

  it('returns undefined for an empty or non-string title', () => {
    expect(storedThreadTitle({ metadata: { title: '   ' } })).toBeUndefined();
    expect(storedThreadTitle({ metadata: { title: 42 } })).toBeUndefined();
  });
});

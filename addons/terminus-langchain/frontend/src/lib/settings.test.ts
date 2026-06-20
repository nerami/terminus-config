import { describe, expect, it } from 'vitest';

import { MAX_FONT_SIZE, MIN_FONT_SIZE, clampFontSize } from './settings';

describe('clampFontSize', () => {
  it('keeps in-range values unchanged', () => {
    expect(clampFontSize(16)).toBe(16);
    expect(clampFontSize(MIN_FONT_SIZE)).toBe(MIN_FONT_SIZE);
    expect(clampFontSize(MAX_FONT_SIZE)).toBe(MAX_FONT_SIZE);
  });

  it('clamps below the minimum and above the maximum', () => {
    expect(clampFontSize(4)).toBe(MIN_FONT_SIZE);
    expect(clampFontSize(99)).toBe(MAX_FONT_SIZE);
  });

  it('rounds fractional values', () => {
    expect(clampFontSize(16.4)).toBe(16);
    expect(clampFontSize(16.6)).toBe(17);
  });
});

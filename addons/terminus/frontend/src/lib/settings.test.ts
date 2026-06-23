import { describe, expect, it } from 'vitest';

import {
  clampFontSize,
  clampSplitFraction,
  DEFAULT_SPLIT_FRACTION,
  MAX_FONT_SIZE,
  MAX_SPLIT_FRACTION,
  MIN_FONT_SIZE,
  MIN_SPLIT_FRACTION,
} from './settings';

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

describe('clampSplitFraction', () => {
  it('passes through an in-range fraction', () => {
    expect(clampSplitFraction(0.55)).toBe(0.55);
  });

  it('clamps below the minimum', () => {
    expect(clampSplitFraction(0.1)).toBe(MIN_SPLIT_FRACTION);
  });

  it('clamps above the maximum', () => {
    expect(clampSplitFraction(0.95)).toBe(MAX_SPLIT_FRACTION);
  });

  it('falls back to the default for non-finite input', () => {
    expect(clampSplitFraction(Number.NaN)).toBe(DEFAULT_SPLIT_FRACTION);
    expect(clampSplitFraction(Infinity)).toBe(DEFAULT_SPLIT_FRACTION);
  });
});

import { describe, expect, it } from 'vitest';

import {
  encodeParentHash,
  getParentWindow,
  mirrorToParent,
  parseParentHash,
  relativeLocation,
  restoreFromParentHash,
} from './parent-url';

describe('relativeLocation', () => {
  const base = '/api/hassio_ingress/tok/';

  it('strips the ingress basepath and keeps the search', () => {
    expect(relativeLocation({ pathname: '/api/hassio_ingress/tok/c/abc', search: '?topology=1' }, base)).toBe(
      '/c/abc?topology=1',
    );
  });

  it('normalises the base case to /', () => {
    expect(relativeLocation({ pathname: base, search: '' }, base)).toBe('/');
  });

  it('works when served at root (non-ingress)', () => {
    expect(relativeLocation({ pathname: '/c/abc', search: '?x=1' }, '/')).toBe('/c/abc?x=1');
    expect(relativeLocation({ pathname: '/', search: '' }, '/')).toBe('/');
  });
});

describe('encodeParentHash / parseParentHash', () => {
  it('round-trips a relative location', () => {
    const rel = '/c/abc?topology=1&area=kitchen';
    expect(parseParentHash('#' + encodeParentHash(rel))).toBe(rel);
  });

  it('parses without a leading #', () => {
    expect(parseParentHash('app=/c/abc')).toBe('/c/abc');
  });

  it('returns null for empty or unrelated hashes', () => {
    expect(parseParentHash('')).toBeNull();
    expect(parseParentHash('#')).toBeNull();
    expect(parseParentHash('#foo')).toBeNull();
  });
});

// In the test environment window is its own top (not framed), so the window-wiring
// entry points must no-op without throwing.
describe('window wiring (not framed)', () => {
  it('getParentWindow returns null', () => {
    expect(getParentWindow()).toBeNull();
  });

  it('mirrorToParent and restoreFromParentHash are safe no-ops', () => {
    const before = window.location.href;
    expect(() => mirrorToParent('/c/abc')).not.toThrow();
    expect(() => restoreFromParentHash()).not.toThrow();
    expect(window.location.href).toBe(before);
  });
});

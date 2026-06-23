import { describe, expect, it, vi } from 'vitest';

import {
  CHECKPOINT_KEY,
  isBaseLocation,
  readCheckpoint,
  resolveInitialLocation,
  writeCheckpoint,
} from './navigation-checkpoint';

describe('isBaseLocation', () => {
  it('treats "/" and "" as base, anything else as not', () => {
    expect(isBaseLocation('/')).toBe(true);
    expect(isBaseLocation('')).toBe(true);
    expect(isBaseLocation('/abc')).toBe(false);
    expect(isBaseLocation('/?layout=split')).toBe(false);
  });
});

describe('resolveInitialLocation', () => {
  it('URL wins: a non-base current location is never overridden', () => {
    expect(resolveInitialLocation('/abc?layout=split', '/xyz')).toBeNull();
  });
  it('falls back to a non-base checkpoint when the URL is blank', () => {
    expect(resolveInitialLocation('/', '/abc?layout=topology')).toBe('/abc?layout=topology');
  });
  it('returns null (defaults stand) when both are blank', () => {
    expect(resolveInitialLocation('/', null)).toBeNull();
    expect(resolveInitialLocation('/', '/')).toBeNull();
  });
});

describe('readCheckpoint / writeCheckpoint', () => {
  it('round-trips through a storage-like object', () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    writeCheckpoint(storage, '/abc?layout=split');
    expect(store.get(CHECKPOINT_KEY)).toBe('/abc?layout=split');
    expect(readCheckpoint(storage)).toBe('/abc?layout=split');
  });
  it('swallows storage exceptions (private mode / quota)', () => {
    const throwing = {
      getItem: vi.fn(() => {
        throw new Error('denied');
      }),
      setItem: vi.fn(() => {
        throw new Error('quota');
      }),
    };
    expect(readCheckpoint(throwing)).toBeNull();
    expect(() => writeCheckpoint(throwing, '/x')).not.toThrow();
  });
});

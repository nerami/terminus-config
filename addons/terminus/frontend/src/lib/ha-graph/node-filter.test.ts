import { describe, expect, it } from 'vitest';

import { EMPTY_FILTER, domainsOf, isFilterActive, nodeMatchesFilter } from './node-filter';

import type { GraphNodeData, RFNode } from './build';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeData(overrides: Partial<GraphNodeData> = {}): GraphNodeData {
  return { kind: 'entity', label: 'Test Node', ...overrides };
}

function makeNode(id: string, overrides: Partial<GraphNodeData> = {}): RFNode {
  return { id, position: { x: 0, y: 0 }, data: makeData(overrides) };
}

// ---------------------------------------------------------------------------
// isFilterActive
// ---------------------------------------------------------------------------

describe('isFilterActive', () => {
  it('returns false for EMPTY_FILTER', () => {
    expect(isFilterActive(EMPTY_FILTER)).toBe(false);
  });

  it('returns true when search has a non-empty trimmed value', () => {
    expect(isFilterActive({ ...EMPTY_FILTER, search: 'light' })).toBe(true);
  });

  it('returns false when search is whitespace-only (trimmed is empty)', () => {
    // whitespace-only is still not active — trim produces empty string
    expect(isFilterActive({ ...EMPTY_FILTER, search: '   ' })).toBe(false);
  });

  it('returns true when status is not "all"', () => {
    expect(isFilterActive({ ...EMPTY_FILTER, status: 'unavailable' })).toBe(true);
    expect(isFilterActive({ ...EMPTY_FILTER, status: 'unknown' })).toBe(true);
  });

  it('returns false when status is "all"', () => {
    expect(isFilterActive({ ...EMPTY_FILTER, status: 'all' })).toBe(false);
  });

  it('returns true when domains array is non-empty', () => {
    expect(isFilterActive({ ...EMPTY_FILTER, domains: ['light'] })).toBe(true);
  });

  it('returns false when domains array is empty', () => {
    expect(isFilterActive({ ...EMPTY_FILTER, domains: [] })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// nodeMatchesFilter — search dimension
// ---------------------------------------------------------------------------

describe('nodeMatchesFilter — search', () => {
  it('empty search passes any node', () => {
    const data = makeData({ label: 'Bedroom Light', entityId: 'light.bed', domain: 'light' });
    expect(nodeMatchesFilter(data, EMPTY_FILTER)).toBe(true);
  });

  it('whitespace-only search passes any node', () => {
    const data = makeData({ label: 'Bedroom Light' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, search: '   ' })).toBe(true);
  });

  it('matches on label substring (case-insensitive)', () => {
    const data = makeData({ label: 'Bedroom Light' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, search: 'bedroom' })).toBe(true);
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, search: 'BEDROOM' })).toBe(true);
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, search: 'Light' })).toBe(true);
  });

  it('matches on entityId substring', () => {
    const data = makeData({ label: 'X', entityId: 'light.bedroom_led' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, search: 'bedroom_led' })).toBe(true);
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, search: 'BEDROOM_LED' })).toBe(true);
  });

  it('matches on domain substring', () => {
    const data = makeData({ label: 'X', domain: 'switch' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, search: 'swit' })).toBe(true);
  });

  it('returns false when query matches none of label/entityId/domain', () => {
    const data = makeData({ label: 'Bedroom Light', entityId: 'light.bed', domain: 'light' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, search: 'sensor' })).toBe(false);
  });

  it('skips undefined fields gracefully (no crash)', () => {
    // node has no entityId or domain
    const data = makeData({ label: 'Area Node' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, search: 'area' })).toBe(true);
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, search: 'light' })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// nodeMatchesFilter — status dimension
// ---------------------------------------------------------------------------

describe('nodeMatchesFilter — status', () => {
  it('status "all" passes any availability', () => {
    for (const av of ['ok', 'unavailable', 'unknown', undefined] as const) {
      const data = makeData({ availability: av });
      expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, status: 'all' })).toBe(true);
    }
  });

  it('matches a node whose availability equals the filter status', () => {
    const data = makeData({ availability: 'unavailable' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, status: 'unavailable' })).toBe(true);
  });

  it('rejects a node whose availability does not equal the filter status', () => {
    const data = makeData({ availability: 'ok' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, status: 'unavailable' })).toBe(false);
  });

  it('treats missing availability as "ok"', () => {
    const data = makeData({}); // no availability field
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, status: 'ok' })).toBe(true);
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, status: 'unavailable' })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// nodeMatchesFilter — domain dimension
// ---------------------------------------------------------------------------

describe('nodeMatchesFilter — domain', () => {
  it('empty domains list passes any node', () => {
    const data = makeData({ domain: 'light' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, domains: [] })).toBe(true);
  });

  it('passes when node domain is in the filter set', () => {
    const data = makeData({ domain: 'switch' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, domains: ['light', 'switch'] })).toBe(true);
  });

  it('rejects when node domain is not in the filter set', () => {
    const data = makeData({ domain: 'sensor' });
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, domains: ['light', 'switch'] })).toBe(false);
  });

  it('rejects a node with no domain when domains filter is active', () => {
    const data = makeData({}); // no domain
    expect(nodeMatchesFilter(data, { ...EMPTY_FILTER, domains: ['light'] })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// nodeMatchesFilter — AND semantics (cross-dimension)
// ---------------------------------------------------------------------------

describe('nodeMatchesFilter — AND across dimensions', () => {
  it('passes only when all active dimensions pass', () => {
    const data = makeData({ label: 'Bedroom Light', entityId: 'light.bed', domain: 'light', availability: 'ok' });
    // Both search and domain pass → true
    expect(nodeMatchesFilter(data, { search: 'bedroom', status: 'all', domains: ['light'] })).toBe(true);
  });

  it('fails when one dimension passes but another does not', () => {
    const data = makeData({ label: 'Bedroom Light', entityId: 'light.bed', domain: 'light', availability: 'ok' });
    // search passes ("bedroom"), but status fails (node is ok, filter wants unavailable)
    expect(nodeMatchesFilter(data, { search: 'bedroom', status: 'unavailable', domains: [] })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// domainsOf
// ---------------------------------------------------------------------------

describe('domainsOf', () => {
  it('returns distinct domains in ascending sort order', () => {
    const nodes: RFNode[] = [
      makeNode('1', { domain: 'switch' }),
      makeNode('2', { domain: 'light' }),
      makeNode('3', { domain: 'light' }),
      makeNode('4', { domain: 'sensor' }),
    ];
    expect(domainsOf(nodes)).toEqual(['light', 'sensor', 'switch']);
  });

  it('returns empty array when no nodes have a domain', () => {
    const nodes: RFNode[] = [makeNode('1', { label: 'Area' }), makeNode('2', { label: 'Group' })];
    expect(domainsOf(nodes)).toEqual([]);
  });

  it('skips nodes without domain but includes those that have one', () => {
    const nodes: RFNode[] = [
      makeNode('1', { domain: 'light' }),
      makeNode('2'), // no domain
    ];
    expect(domainsOf(nodes)).toEqual(['light']);
  });
});

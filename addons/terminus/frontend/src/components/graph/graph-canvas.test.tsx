import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Edge, Node } from '@xyflow/react';

import type { GraphNodeData } from '@/lib/ha-graph/build';
import { EMPTY_FILTER, type NodeFilter } from '@/lib/ha-graph/node-filter';

// Capture the props passed to the stubbed ReactFlow so we can assert on them
// without mounting the (heavy) real @xyflow/react canvas in jsdom/happy-dom.
let lastReactFlowProps: Record<string, unknown> | null = null;

vi.mock('@xyflow/react', () => {
  const ReactFlow = (props: Record<string, unknown>) => {
    lastReactFlowProps = props;
    return null;
  };
  return {
    ReactFlow,
    ReactFlowProvider: ({ children }: { children?: React.ReactNode }) => children ?? null,
    Background: () => null,
    Controls: () => null,
    Handle: () => null,
    Position: { Top: 'top', Right: 'right', Bottom: 'bottom', Left: 'left' },
    MarkerType: { Arrow: 'arrow', ArrowClosed: 'arrowclosed' },
    // State hooks just echo a tuple of [state, setState, onChange].
    useNodesState: (initial: unknown) => [initial, vi.fn(), vi.fn()],
    useEdgesState: (initial: unknown) => [initial, vi.fn(), vi.fn()],
    useReactFlow: () => ({ fitView: vi.fn(), zoomIn: vi.fn(), zoomOut: vi.fn() }),
  };
});

// Mock heavy sibling imports so the component renders shallowly.
vi.mock('./nodes', () => ({ nodeTypes: {} }));

// Shared sentinels + mutable filter + deterministic test graph, hoisted so both
// the jotai/atoms mocks and the use-topology-graph mock share identities.
// Deterministic test graph: two light nodes, two switch nodes, one group, plus
// edges between same-domain pairs and a cross-domain edge.
const atomMocks = vi.hoisted(() => ({
  nodeFilterAtom: { __atom: 'nodeFilter' },
  availableDomainsAtom: { __atom: 'availableDomains' },
  nodePositionsAtom: { __atom: 'nodePositions' },
  currentFilter: { search: '', status: 'all', domains: [] } as NodeFilter,
  testNodes: [
    { id: 'g1', position: { x: 0, y: 0 }, data: { kind: 'group', label: 'Group' } },
    { id: 'l1', position: { x: 0, y: 0 }, data: { kind: 'entity', label: 'Light 1', domain: 'light' } },
    { id: 'l2', position: { x: 0, y: 0 }, data: { kind: 'entity', label: 'Light 2', domain: 'light' } },
    { id: 's1', position: { x: 0, y: 0 }, data: { kind: 'entity', label: 'Switch 1', domain: 'switch' } },
    { id: 's2', position: { x: 0, y: 0 }, data: { kind: 'entity', label: 'Switch 2', domain: 'switch' } },
  ] as Node<GraphNodeData>[],
  testEdges: [
    { id: 'l1~l2', source: 'l1', target: 'l2' }, // both lights -> both visible under light filter
    { id: 's1~s2', source: 's1', target: 's2' }, // both switches -> both dimmed under light filter
    { id: 'l1~s1', source: 'l1', target: 's1' }, // cross -> mixed
  ] as Edge[],
}));

vi.mock('@/lib/ha-graph/use-topology-graph', () => ({
  useTopologyGraph: () => ({
    activate: vi.fn(),
    automationId: null,
    automationLoading: false,
    baseGraph: { nodes: atomMocks.testNodes, edges: atomMocks.testEdges },
    clearSelection: vi.fn(),
    goBack: vi.fn(),
    highlightSet: null,
    isUpstreamMode: false,
    notFoundKind: null,
    scope: 'areas',
    selected: null,
    showAutomationHint: false,
  }),
}));

// jotai atoms: atom-aware so reading nodeFilterAtom yields the mutable filter,
// other atom reads stay null, and useAtom (nodePositionsAtom) keeps working.
vi.mock('jotai', () => ({
  useAtom: () => [{}, vi.fn()],
  useAtomValue: (a: unknown) => (a === atomMocks.nodeFilterAtom ? atomMocks.currentFilter : null),
  useSetAtom: () => vi.fn(),
}));
vi.mock('@/lib/ha-graph/atoms', () => ({
  nodeFilterAtom: atomMocks.nodeFilterAtom,
  availableDomainsAtom: atomMocks.availableDomainsAtom,
  nodePositionsAtom: atomMocks.nodePositionsAtom,
}));

vi.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light' }) }));

import { GraphCanvas } from './graph-canvas';

type RFNode = Node<GraphNodeData>;
type RFEdge = Edge & { style?: { opacity?: number } };

function renderedNodes(): RFNode[] {
  return (lastReactFlowProps?.nodes as RFNode[]) ?? [];
}
function renderedEdges(): RFEdge[] {
  return (lastReactFlowProps?.edges as RFEdge[]) ?? [];
}
function nodeById(id: string): RFNode | undefined {
  return renderedNodes().find((n) => n.id === id);
}
function edgeById(id: string): RFEdge | undefined {
  return renderedEdges().find((e) => e.id === id);
}

describe('GraphCanvas', () => {
  beforeEach(() => {
    lastReactFlowProps = null;
    atomMocks.currentFilter = EMPTY_FILTER;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders edges as bezier edges via defaultEdgeOptions', () => {
    render(<GraphCanvas />);
    expect(lastReactFlowProps).not.toBeNull();
    expect(lastReactFlowProps?.defaultEdgeOptions).toEqual({ type: 'bezier' });
  });

  it('dims nothing when no filter is active', () => {
    atomMocks.currentFilter = EMPTY_FILTER;
    render(<GraphCanvas />);
    for (const n of renderedNodes()) {
      expect(n.data.dimmed).toBeFalsy();
    }
  });

  describe('with an active domain filter', () => {
    beforeEach(() => {
      atomMocks.currentFilter = { search: '', status: 'all', domains: ['light'] };
      render(<GraphCanvas />);
    });

    it('leaves matching (light) nodes un-dimmed', () => {
      expect(nodeById('l1')?.data.dimmed).toBeFalsy();
      expect(nodeById('l2')?.data.dimmed).toBeFalsy();
    });

    it('dims non-matching non-structural nodes', () => {
      expect(nodeById('s1')?.data.dimmed).toBe(true);
      expect(nodeById('s2')?.data.dimmed).toBe(true);
    });

    it('never dims structural (group) nodes', () => {
      expect(nodeById('g1')?.data.dimmed).toBeFalsy();
    });

    it('does not ring-spam matches (emphasized stays false)', () => {
      expect(nodeById('l1')?.data.emphasized).toBe(false);
    });

    it('keeps an edge between two visible nodes lit (opacity 1)', () => {
      expect(edgeById('l1~l2')?.style?.opacity).toBe(1);
    });

    it('mutes an edge between two dimmed nodes (opacity 0.06)', () => {
      expect(edgeById('s1~s2')?.style?.opacity).toBe(0.06);
    });

    it('mutes an edge touching a dimmed endpoint (opacity 0.06)', () => {
      expect(edgeById('l1~s1')?.style?.opacity).toBe(0.06);
    });
  });
});

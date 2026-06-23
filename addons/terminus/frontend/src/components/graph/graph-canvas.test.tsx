import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
    useReactFlow: () => ({ fitView: vi.fn() }),
  };
});

// Mock heavy sibling imports so the component renders shallowly.
vi.mock('./nodes', () => ({ nodeTypes: {} }));
vi.mock('./GroupByControls', () => ({ GroupByControls: () => null }));
vi.mock('@/hooks/use-topology', () => ({
  useAutomationDetail: () => ({ detail: null, loading: false }),
  useTopologyData: () => null,
}));
vi.mock('@/lib/ha-graph/build', () => ({
  automationHasStructure: () => true,
  buildAreaGraph: () => ({ nodes: [], edges: [] }),
  buildAreasGraph: () => ({ nodes: [], edges: [] }),
  buildAutomationGraph: () => ({ nodes: [], edges: [] }),
  buildAutomationsGraph: () => ({ nodes: [], edges: [] }),
  buildEntitiesGraph: () => ({ nodes: [], edges: [] }),
  buildSceneGraph: () => ({ nodes: [], edges: [] }),
  buildScenesGraph: () => ({ nodes: [], edges: [] }),
}));

// jotai atoms: provide minimal stubs so the component's atom reads/writes work.
vi.mock('jotai', () => ({
  useAtom: () => [{ kind: 'areas' }, vi.fn()],
  useAtomValue: () => null,
  useSetAtom: () => vi.fn(),
}));
vi.mock('@/lib/ha-graph/atoms', () => ({
  entityModalAtom: {},
  nodePositionsAtom: {},
  selectedNodeAtom: {},
  viewScope: () => 'areas',
}));

vi.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light' }) }));

// nuqs: stub useQueryStates so useGraphView works without a real adapter.
vi.mock('nuqs', () => ({
  parseAsString: { parseServerSide: () => null },
  useQueryStates: () => [{ group: null, area: null, scene: null, automation: null }, vi.fn()],
}));

import { GraphCanvas } from './graph-canvas';

describe('GraphCanvas', () => {
  beforeEach(() => {
    lastReactFlowProps = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders edges as bezier edges via defaultEdgeOptions', () => {
    render(<GraphCanvas />);
    expect(lastReactFlowProps).not.toBeNull();
    expect(lastReactFlowProps?.defaultEdgeOptions).toEqual({ type: 'bezier' });
  });
});

import { fireEvent, render, screen, within } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mutable test doubles shared with the module mocks below.
const { navLevels, setView } = vi.hoisted(() => ({
  setView: vi.fn(),
  navLevels: vi.fn(),
}));

vi.mock('@/hooks/use-topology', () => ({
  useTopologyData: () => ({ areas: [] }),
}));
vi.mock('@/lib/ha-graph/use-graph-view', () => ({
  useGraphView: () => [{ kind: 'area', areaId: 'living' }, setView],
}));
vi.mock('@/lib/ha-graph/group-nav', () => ({ navLevels }));

import { availableDomainsAtom, nodeFilterAtom } from '@/lib/ha-graph/atoms';
import { TopologyFilters } from './topology-filters';

// A grouping picker plus one sibling switcher, mirroring navLevels()'s output
// shape (NavOption = { value, label }; select() maps a value to a GraphView).
function makeLevels() {
  return [
    {
      id: 'grouping',
      value: 'area',
      options: [
        { value: 'area', label: 'Area' },
        { value: 'scenes', label: 'Scenes' },
      ],
      select: vi.fn((v: string) => ({ kind: v })),
      clearTo: null, // at the default grouping → no clear (keeps the chevron for openCombobox)
    },
    {
      id: 'area',
      value: 'living',
      options: [
        { value: 'living', label: 'Living Room' },
        { value: 'kitchen', label: 'Kitchen' },
      ],
      select: vi.fn((v: string) => ({ kind: 'area', areaId: v })),
      clearTo: null,
    },
  ];
}

let levels: ReturnType<typeof makeLevels>;

// base-ui opens the popup from the input's adjacent trigger button (the chevron).
function openCombobox(input: HTMLElement) {
  const group = input.closest('[data-slot="input-group"]') as HTMLElement;
  fireEvent.click(within(group).getByRole('button'));
}

beforeEach(() => {
  levels = makeLevels();
  navLevels.mockReturnValue(levels);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('TopologyFilters', () => {
  it('renders a text input per nav level showing the current selection', () => {
    render(<TopologyFilters />);

    expect(screen.getByLabelText('Group nodes by')).toHaveValue('Area');
    expect(screen.getByLabelText('Select area')).toHaveValue('Living Room');
  });

  it('filters options as the user types', () => {
    render(<TopologyFilters />);

    const area = screen.getByLabelText('Select area');
    openCombobox(area);
    fireEvent.change(area, { target: { value: 'kit' } });

    expect(screen.getByRole('option', { name: 'Kitchen' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Living Room' })).not.toBeInTheDocument();
  });

  it('navigates to the GraphView for the chosen option', () => {
    render(<TopologyFilters />);

    openCombobox(screen.getByLabelText('Select area'));
    fireEvent.click(screen.getByRole('option', { name: 'Kitchen' }));

    expect(levels[1].select).toHaveBeenCalledWith('kitchen');
    expect(setView).toHaveBeenCalledWith({ kind: 'area', areaId: 'kitchen' });
  });

  it('clears a nav level to its clearTo target', () => {
    navLevels.mockReturnValue([
      { id: 'grouping', value: 'area', options: [{ value: 'area', label: 'Area' }], select: vi.fn(), clearTo: null },
      {
        id: 'area',
        value: 'living',
        options: [{ value: 'living', label: 'Living Room' }],
        select: vi.fn(),
        clearTo: { kind: 'areas' },
      },
    ]);
    render(<TopologyFilters />);

    fireEvent.click(screen.getByLabelText('Clear area'));

    expect(setView).toHaveBeenCalledWith({ kind: 'areas' });
  });
});

describe('TopologyFilters – filter controls', () => {
  it('typing in the search input sets nodeFilterAtom.search', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    const input = screen.getByLabelText('Filter nodes');
    fireEvent.change(input, { target: { value: 'light' } });

    expect(store.get(nodeFilterAtom).search).toBe('light');
  });

  it('selecting a status option sets nodeFilterAtom.status', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    // Status is a single-select combobox; open it from its chevron, then pick.
    openCombobox(screen.getByLabelText('Filter by status'));
    fireEvent.click(screen.getByRole('option', { name: 'OK' }));

    expect(store.get(nodeFilterAtom).status).toBe('ok');
  });

  it('shows the selected status label (not the raw value)', () => {
    const store = createStore();
    store.set(nodeFilterAtom, { search: '', status: 'unavailable', domains: [] });

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    expect(screen.getByLabelText('Filter by status')).toHaveValue('Unavailable');
  });

  it('clears the search text via its clear button', () => {
    const store = createStore();
    store.set(nodeFilterAtom, { search: 'light', status: 'all', domains: [] });

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText('Clear search'));

    expect(store.get(nodeFilterAtom).search).toBe('');
  });

  it('hides the search clear button when empty', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('resets the status to All via its clear button', () => {
    const store = createStore();
    store.set(nodeFilterAtom, { search: '', status: 'ok', domains: [] });

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText('Clear status'));

    expect(store.get(nodeFilterAtom).status).toBe('all');
  });

  it('hides the status clear button at All', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    expect(screen.queryByLabelText('Clear status')).not.toBeInTheDocument();
  });

  it('domain control absent when availableDomainsAtom has <2 entries', () => {
    const store = createStore();
    store.set(availableDomainsAtom, ['light']);

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    expect(screen.queryByLabelText('Filter by domain')).not.toBeInTheDocument();
  });

  it('domain control present when availableDomainsAtom has >=2 entries', () => {
    const store = createStore();
    store.set(availableDomainsAtom, ['light', 'switch']);

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    expect(screen.getByLabelText('Filter by domain')).toBeInTheDocument();
  });

  it('clears the selected domains via the clear button', () => {
    const store = createStore();
    store.set(availableDomainsAtom, ['light', 'switch']);
    store.set(nodeFilterAtom, { search: '', status: 'all', domains: ['light', 'switch'] });

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText('Clear domains'));

    expect(store.get(nodeFilterAtom).domains).toEqual([]);
  });

  it('hides the domain clear button when no domains are selected', () => {
    const store = createStore();
    store.set(availableDomainsAtom, ['light', 'switch']);

    render(
      <Provider store={store}>
        <TopologyFilters />
      </Provider>,
    );

    expect(screen.queryByLabelText('Clear domains')).not.toBeInTheDocument();
  });
});

import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mutable holders so each test can vary what the dialog sees.
const state = vi.hoisted(() => ({
  version: '0.22.0' as string | null,
  changelog: { version: '0.22.0', markdown: '- A shiny new thing.' } as {
    version: string;
    markdown: string;
  } | null,
}));

vi.mock('@/hooks/use-ha-status', () => ({
  useHaStatus: () => ({
    status: 'connected',
    ha_version: null,
    terminus_version: state.version,
    last_connected: null,
    error: null,
  }),
}));
vi.mock('@/hooks/use-changelog', () => ({
  useChangelog: () => ({ data: state.changelog }),
}));

import { lastSeenVersionAtom, whatsNewOpenAtom, WhatsNewDialog } from './whats-new-dialog';

// Inject the persisted "last seen" value through a jotai store rather than
// localStorage: `getOnInit` reads storage at module-import time, so seeding
// localStorage from a test (which runs after import) would be too late.
function renderDialog(lastSeen: string | null) {
  const store = createStore();
  store.set(lastSeenVersionAtom, lastSeen);
  const result = render(<WhatsNewDialog />, {
    wrapper: ({ children }) => <JotaiProvider store={store}>{children}</JotaiProvider>,
  });
  return { store, ...result };
}

beforeEach(() => {
  localStorage.clear();
  state.version = '0.22.0';
  state.changelog = { version: '0.22.0', markdown: '- A shiny new thing.' };
});

afterEach(() => vi.clearAllMocks());

describe('WhatsNewDialog', () => {
  it('opens after an upgrade and shows the version, caption, and bullets', () => {
    renderDialog('0.21.0');

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText("What's new")).toBeInTheDocument();
    expect(screen.getByText('v0.22.0')).toBeInTheDocument();
    expect(screen.getByText('A shiny new thing.')).toBeInTheDocument();
  });

  it('stays closed on a first install and records the current version', () => {
    // No stored value => first run of this feature. Suppress and remember.
    const { store } = renderDialog(null);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(store.get(lastSeenVersionAtom)).toBe('0.22.0');
  });

  it('stays closed when the running version was already seen', () => {
    renderDialog('0.22.0');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('stays closed when there is no changelog entry for the version', () => {
    state.changelog = null;
    renderDialog('0.21.0');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('stays closed when the add-on version is unknown (dev)', () => {
    state.version = null;
    renderDialog('0.21.0');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('records the version and closes when dismissed', () => {
    const { store } = renderDialog('0.21.0');

    fireEvent.click(screen.getByRole('button', { name: /got it/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(store.get(lastSeenVersionAtom)).toBe('0.22.0');
  });

  it('can be opened on demand via whatsNewOpenAtom (no upgrade needed)', () => {
    // Already seen the current version → no auto-open.
    const { store } = renderDialog('0.22.0');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // The Settings "What's new" item flips this atom.
    act(() => store.set(whatsNewOpenAtom, true));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('A shiny new thing.')).toBeInTheDocument();
  });
});

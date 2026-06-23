import { fireEvent, render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { afterEach, describe, expect, it } from 'vitest';

import { SettingsMenu } from './settings-menu';

import { useViewTools } from '@/hooks/use-view-tools';
import { fontSizeAtom, viewToolsAtom } from '@/lib/settings';

function Probe() {
  const [viewTools] = useViewTools();
  return <div data-testid="probe">{String(viewTools)}</div>;
}

function renderMenu(store = createStore()) {
  return render(
    <Provider store={store}>
      <SettingsMenu />
      <Probe />
    </Provider>,
  );
}

afterEach(() => window.localStorage.clear());

describe('SettingsMenu', () => {
  it('groups settings under Chatbot and Appearance headings', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.getByText('Chatbot')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
  });

  it('toggles tool-call visibility', () => {
    const store = createStore();
    store.set(viewToolsAtom, true);
    renderMenu(store);

    expect(screen.getByTestId('probe')).toHaveTextContent('true');

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /show tool calls/i }));

    expect(screen.getByTestId('probe')).toHaveTextContent('false');
  });

  it('steps the font size up and down', () => {
    const store = createStore();
    store.set(fontSizeAtom, 16);
    renderMenu(store);

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.click(screen.getByRole('button', { name: /increase font size/i }));
    expect(store.get(fontSizeAtom)).toBe(17);

    fireEvent.click(screen.getByRole('button', { name: /decrease font size/i }));
    expect(store.get(fontSizeAtom)).toBe(16);
  });

  it('disables the increase button at the maximum size', () => {
    const store = createStore();
    store.set(fontSizeAtom, 20);
    renderMenu(store);

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.getByRole('button', { name: /increase font size/i })).toBeDisabled();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ContextItem } from '@/lib/chat-context';

import { ContextChips } from './context-chips';

const items: ContextItem[] = [
  { id: 'node-1', kind: 'node', label: 'Living room lamp', detail: '' },
  { id: 'page-1', kind: 'page', label: 'Scenes', detail: '' },
];

describe('ContextChips', () => {
  it('renders a chip per item', () => {
    render(<ContextChips items={items} activeIds={new Set()} onToggle={() => {}} />);
    expect(screen.getByText('Living room lamp')).toBeInTheDocument();
    expect(screen.getByText('Scenes')).toBeInTheDocument();
  });

  it('renders nothing when there are no items', () => {
    const { container } = render(<ContextChips items={[]} activeIds={new Set()} onToggle={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('reflects the active state via aria-pressed', () => {
    render(<ContextChips items={items} activeIds={new Set(['node-1'])} onToggle={() => {}} />);
    expect(screen.getByRole('button', { name: /Living room lamp/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Scenes/ })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onToggle with the item id when clicked', () => {
    const onToggle = vi.fn();
    render(<ContextChips items={items} activeIds={new Set()} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button', { name: /Living room lamp/ }));
    expect(onToggle).toHaveBeenCalledWith('node-1');
  });
});

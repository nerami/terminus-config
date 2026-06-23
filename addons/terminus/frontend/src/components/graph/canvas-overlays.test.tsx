import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AutomationHint, CanvasNotFound } from './canvas-overlays';

describe('CanvasNotFound', () => {
  it('shows a deleted-entity message and calls onBack when the button is clicked', () => {
    const onBack = vi.fn();
    render(<CanvasNotFound kind="automation" onBack={onBack} />);
    expect(screen.getByText(/no longer exists/i)).toBeInTheDocument();
    screen.getByRole('button', { name: /back to automations/i }).click();
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe('AutomationHint', () => {
  it('is pinned to the bottom of the canvas', () => {
    const { container } = render(<AutomationHint />);
    expect(container.querySelector('.bottom-3')).not.toBeNull();
    expect(container.querySelector('.top-3')).toBeNull();
  });
});

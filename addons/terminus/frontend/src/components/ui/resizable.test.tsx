import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ResizableGroup, ResizablePanel, ResizableSeparator } from './resizable';

describe('resizable primitives', () => {
  it('render a group with two panels and an accessible separator', () => {
    render(
      <ResizableGroup orientation="horizontal">
        <ResizablePanel id="a">Alpha</ResizablePanel>
        <ResizableSeparator />
        <ResizablePanel id="b">Beta</ResizablePanel>
      </ResizableGroup>,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});

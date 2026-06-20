import { ReactFlowProvider } from '@xyflow/react';
import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import { nodeTypes } from './nodes';

type TestNodeProps = { data: { label: string; sublabel?: string; interactive?: boolean } };

const GroupNode = nodeTypes.group as unknown as ComponentType<TestNodeProps>;
const EntityNode = nodeTypes.entity as unknown as ComponentType<TestNodeProps>;

describe('GroupNode', () => {
  it('renders its label and sublabel', () => {
    render(<GroupNode data={{ label: 'Scenes', sublabel: '3', interactive: false }} />);
    expect(screen.getByText('Scenes')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('has no rounded utility classes', () => {
    const { container } = render(<GroupNode data={{ label: 'Scenes', sublabel: '3', interactive: false }} />);
    expect(container.innerHTML).not.toMatch(/rounded/);
  });
});

describe('regular node', () => {
  it('has no rounded utility classes', () => {
    const { container } = render(
      <ReactFlowProvider>
        <EntityNode data={{ label: 'Light', sublabel: 'on', interactive: false }} />
      </ReactFlowProvider>,
    );
    expect(container.innerHTML).not.toMatch(/rounded/);
  });
});

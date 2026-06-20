import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { KIND_ICON_URI } from './graph-3d-style';
import { NodeLabelChip } from './node-label';

describe('NodeLabelChip', () => {
  it('shows the name and the sublabel', () => {
    render(<NodeLabelChip kind="entity" label="Floor Lamp" sublabel="switch" />);
    expect(screen.getByText('Floor Lamp')).toBeInTheDocument();
    expect(screen.getByText('switch')).toBeInTheDocument();
  });

  it('shows the kind glyph from KIND_ICON_URI', () => {
    const { container } = render(<NodeLabelChip kind="entity" label="Floor Lamp" sublabel="switch" />);
    expect(container.querySelector('img')).toHaveAttribute('src', KIND_ICON_URI.entity);
  });

  it('omits the sublabel row when there is none', () => {
    render(<NodeLabelChip kind="scene" label="Dim" />);
    expect(screen.getByText('Dim')).toBeInTheDocument();
    expect(screen.queryByText('switch')).not.toBeInTheDocument();
  });
});

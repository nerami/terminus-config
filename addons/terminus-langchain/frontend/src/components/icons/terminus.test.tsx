import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TerminusLogoSVG } from './terminus';

describe('TerminusLogoSVG', () => {
  it("renders an accessible 'terminus' wordmark", () => {
    render(<TerminusLogoSVG />);
    expect(screen.getByRole('img', { name: /terminus/i })).toBeInTheDocument();
  });

  it('uses currentColor so it follows the theme', () => {
    const { container } = render(<TerminusLogoSVG />);
    // Pixels inherit color from the surrounding text via currentColor.
    expect(container.querySelector('svg')?.getAttribute('fill')).toBe('currentColor');
    // It is drawn from filled pixels (rects), i.e. an 8-bit style mark.
    expect(container.querySelectorAll('rect').length).toBeGreaterThan(20);
  });
});

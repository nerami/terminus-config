import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Disclaimer } from './disclaimer';

describe('Disclaimer', () => {
  it('reminds the user that the AI can make mistakes', () => {
    render(<Disclaimer />);
    expect(screen.getByText(/ai can make mistakes/i)).toBeInTheDocument();
  });
});

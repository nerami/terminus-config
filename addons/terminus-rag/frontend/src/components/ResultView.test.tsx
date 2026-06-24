import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { ResultView } from './ResultView';

test('shows pretty JSON for a result', () => {
  render(<ResultView state={{ status: 'done', value: { result: { a: 1 } } }} />);
  expect(screen.getByText(/"a": 1/)).toBeInTheDocument();
});

test('shows an error block for an error result', () => {
  render(<ResultView state={{ status: 'done', value: { error: 'kaboom' } }} />);
  expect(screen.getByRole('alert')).toHaveTextContent('kaboom');
});

test('shows a loading label', () => {
  render(<ResultView state={{ status: 'loading' }} />);
  expect(screen.getByText(/running/i)).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import { SchemaForm } from './SchemaForm';

const schema = {
  type: 'object',
  properties: {
    query: { type: 'string' },
    top_k: { type: 'integer' },
    kind: { type: 'string', enum: ['entity', 'scene'] },
  },
  required: ['query'],
};

test('renders an input per property and a select for enums', () => {
  render(<SchemaForm schema={schema} onSubmit={() => {}} />);
  expect(screen.getByLabelText(/query/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/top_k/i)).toHaveAttribute('type', 'number');
  expect(screen.getByLabelText(/kind/i).tagName).toBe('SELECT');
});

test('omits blank optionals and coerces integers on submit', async () => {
  const onSubmit = vi.fn();
  render(<SchemaForm schema={schema} onSubmit={onSubmit} />);
  await userEvent.type(screen.getByLabelText(/query/i), 'lamp');
  await userEvent.type(screen.getByLabelText(/top_k/i), '5');
  await userEvent.click(screen.getByRole('button', { name: /run/i }));
  expect(onSubmit).toHaveBeenCalledWith({ query: 'lamp', top_k: 5 });
});

test('renders a run button even for a no-arg tool', () => {
  render(<SchemaForm schema={{ type: 'object', properties: {} }} onSubmit={() => {}} />);
  expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
});

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const updateThreadTitle = vi.fn(() => Promise.resolve());

vi.mock('@/providers/thread', () => ({
  useThreads: () => ({ updateThreadTitle }),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { RenameThreadDialog } from './rename-thread-dialog';

beforeEach(() => {
  updateThreadTitle.mockClear();
});

describe('RenameThreadDialog', () => {
  it('prefills the current title and saves the edited value', () => {
    render(<RenameThreadDialog open onOpenChange={() => {}} threadId="t1" initialTitle="Old title" />);

    const input = screen.getByLabelText('Conversation title') as HTMLInputElement;
    expect(input.value).toBe('Old title');

    fireEvent.change(input, { target: { value: 'New title' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(updateThreadTitle).toHaveBeenCalledWith('t1', 'New title');
  });

  it('does not save an empty title', () => {
    render(<RenameThreadDialog open onOpenChange={() => {}} threadId="t1" initialTitle="" />);

    fireEvent.change(screen.getByLabelText('Conversation title'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(updateThreadTitle).not.toHaveBeenCalled();
  });
});

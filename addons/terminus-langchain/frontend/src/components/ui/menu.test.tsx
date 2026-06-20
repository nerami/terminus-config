import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Menu, MenuContent, MenuItem, MenuTrigger } from './menu';

describe('Menu', () => {
  it('opens and fires the item handler on click', () => {
    const onSelect = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuItem onClick={onSelect}>Archive</MenuItem>
        </MenuContent>
      </Menu>,
    );

    // Item is not in the DOM until the menu is opened.
    expect(screen.queryByText('Archive')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    const item = screen.getByRole('menuitem', { name: 'Archive' });
    expect(item).toBeInTheDocument();

    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

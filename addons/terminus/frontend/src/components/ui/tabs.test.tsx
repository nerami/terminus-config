import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

function Example() {
  return (
    <Tabs defaultValue="one">
      <TabsList>
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First panel</TabsContent>
      <TabsContent value="two">Second panel</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('shows the default panel and switches on click', () => {
    render(<Example />);

    expect(screen.getByText('First panel')).toBeVisible();
    expect(screen.queryByText('Second panel')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Two' }));

    expect(screen.getByText('Second panel')).toBeVisible();
    expect(screen.queryByText('First panel')).not.toBeInTheDocument();
  });
});

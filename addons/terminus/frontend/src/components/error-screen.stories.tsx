import { ErrorScreen } from './error-screen';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Region } from '@/storybook/decorators';

const meta = {
  component: ErrorScreen,
  decorators: [
    (Story) => (
      <Region>
        <Story />
      </Region>
    ),
  ],
  args: { onRetry: () => {} },
} satisfies Meta<typeof ErrorScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Something went wrong',
  },
};

export const CustomRetryLabel: Story = {
  args: {
    retryLabel: 'Try again',
    message: 'Connection failed',
    onRetry: () => {},
  },
};

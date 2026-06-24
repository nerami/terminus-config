import { StateView, StateViewObject } from './state-view';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SAMPLE_INTERRUPT } from '@/storybook/fixtures';

const meta = {
  component: StateView,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StateView>;

export default meta;
type Story = StoryObj<typeof meta>;

const sharedArgs = {
  view: 'state',
  values: SAMPLE_INTERRUPT,
  description: 'Confirm before changing the living-room brightness.',
  handleShowSidePanel: () => {},
} satisfies Story['args'];

export const Default: Story = {
  args: sharedArgs,
  render: (args) => <StateView {...args} />,
};

export const DescriptionView: Story = {
  args: { ...sharedArgs, view: 'description' },
  render: (args) => <StateView {...args} />,
};

export const ObjectView: Story = {
  args: sharedArgs,
  parameters: { controls: { disable: true } },
  render: () => (
    <StateViewObject
      keyName="action_request"
      value={{ action: 'HassLightSet', args: { entity_id: 'light.lr_led_strip' } }}
    />
  ),
};

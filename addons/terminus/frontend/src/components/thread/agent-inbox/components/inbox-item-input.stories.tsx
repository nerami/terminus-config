import { InboxItemInput } from './inbox-item-input';

import type { DecisionWithEdits, HITLRequest, SubmitType } from '../types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: InboxItemInput,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InboxItemInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleInterruptValue: HITLRequest = {
  action_requests: [{ name: 'HassLightSet', args: { entity_id: 'light.lr_led_strip', brightness_pct: 80 } }],
  review_configs: [{ action_name: 'HassLightSet', allowed_decisions: ['approve'] }],
};

export const Default: Story = {
  args: {
    approveAllowed: true,
    handleSubmit: () => {},
    hasAddedResponse: false,
    hasEdited: false,
    humanResponse: [{ type: 'approve' }] satisfies DecisionWithEdits[],
    initialValues: {},
    interruptValue: sampleInterruptValue,
    isLoading: false,
    selectedSubmitType: 'approve' satisfies SubmitType,
    setHasAddedResponse: () => {},
    setHasEdited: () => {},
    setHumanResponse: () => {},
    setSelectedSubmitType: () => {},
    supportsMultipleMethods: false,
  },
};

export const Loading: Story = {
  args: {
    approveAllowed: true,
    handleSubmit: () => {},
    hasAddedResponse: false,
    hasEdited: false,
    humanResponse: [{ type: 'approve' }] satisfies DecisionWithEdits[],
    initialValues: {},
    interruptValue: sampleInterruptValue,
    isLoading: true,
    selectedSubmitType: 'approve' satisfies SubmitType,
    setHasAddedResponse: () => {},
    setHasEdited: () => {},
    setHumanResponse: () => {},
    setSelectedSubmitType: () => {},
    supportsMultipleMethods: false,
  },
};

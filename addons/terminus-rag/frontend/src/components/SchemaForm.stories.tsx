import type { Meta, StoryObj } from '@storybook/react-vite';

import { SchemaForm } from './SchemaForm';

const meta: Meta<typeof SchemaForm> = {
  title: 'Playground/SchemaForm',
  component: SchemaForm,
  args: { onSubmit: (args) => console.log('submit', args) },
};
export default meta;

export const SearchTool: StoryObj<typeof SchemaForm> = {
  args: {
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        top_k: { type: 'integer' },
        kind: { type: 'string', enum: ['entity', 'scene', 'automation'] },
      },
      required: ['query'],
    },
  },
};

export const NoArgs: StoryObj<typeof SchemaForm> = {
  args: { schema: { type: 'object', properties: {} } },
};

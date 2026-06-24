import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResultView } from './ResultView';

const meta: Meta<typeof ResultView> = {
  title: 'Playground/ResultView',
  component: ResultView,
};
export default meta;

export const Result: StoryObj<typeof ResultView> = {
  args: { state: { status: 'done', value: { result: { id: 'entity:light.bed', score: 0.92 } } } },
};
export const ErrorState: StoryObj<typeof ResultView> = {
  args: { state: { status: 'done', value: { error: 'HA recorder unreachable' } } },
};
export const Loading: StoryObj<typeof ResultView> = { args: { state: { status: 'loading' } } };

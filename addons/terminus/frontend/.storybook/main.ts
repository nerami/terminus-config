import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Stories stay co-located next to their components; the sidebar taxonomy is
  // driven by `titlePrefix` per directory (not file path), so a curated tree
  // ("Chat", "Topology", …) is maintained from config alone — no per-file
  // `title:`. Globs are non-overlapping: a directory that contains storied
  // subdirectories (thread/, agent-inbox/) matches only its DIRECT children
  // (`*.stories`), and each subdirectory gets its own earlier entry. Leaf labels
  // are kebab filenames; `manager.tsx`'s renderLabel start-cases them for display.
  // Sidebar ordering is set by `storySort` in preview.tsx.
  stories: [
    { directory: '../src', files: '**/*.mdx' },
    {
      directory: '../src/components/thread/agent-inbox/components',
      files: '**/*.stories.@(js|jsx|mjs|ts|tsx)',
      titlePrefix: 'Agent Inbox',
    },
    {
      directory: '../src/components/thread/agent-inbox',
      files: '*.stories.@(js|jsx|mjs|ts|tsx)',
      titlePrefix: 'Agent Inbox',
    },
    {
      directory: '../src/components/thread/messages',
      files: '**/*.stories.@(js|jsx|mjs|ts|tsx)',
      titlePrefix: 'Chat/Messages',
    },
    { directory: '../src/components/thread', files: '*.stories.@(js|jsx|mjs|ts|tsx)', titlePrefix: 'Chat' },
    { directory: '../src/components/graph', files: '**/*.stories.@(js|jsx|mjs|ts|tsx)', titlePrefix: 'Topology' },
    { directory: '../src/components/sidebar', files: '**/*.stories.@(js|jsx|mjs|ts|tsx)', titlePrefix: 'Sidebar' },
    { directory: '../src/components/whats-new', files: '**/*.stories.@(js|jsx|mjs|ts|tsx)', titlePrefix: 'Dialogs' },
    {
      directory: '../src/components',
      files: '@(error-fallback|region-error-boundary).stories.@(js|jsx|mjs|ts|tsx)',
      titlePrefix: 'Error Boundaries',
    },
    {
      directory: '../src/components',
      files: '@(error-screen|status-card).stories.@(js|jsx|mjs|ts|tsx)',
      titlePrefix: 'Screens',
    },
  ],
  addons: ['@storybook/addon-themes', '@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
};
export default config;

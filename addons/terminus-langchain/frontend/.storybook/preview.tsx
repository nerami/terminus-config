/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from 'react';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import { Provider as JotaiProvider } from 'jotai';
import { NuqsAdapter } from 'nuqs/adapters/react';

import '../src/index.css';

const DARK_CLASS = 'dark';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function SystemThemeSync({
  children,
  theme,
}: {
  theme: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (theme !== 'system') return;
    const root = document.documentElement;

    const apply = () => {
      const mode = getSystemTheme();
      if (mode === 'dark') root.classList.add(DARK_CLASS);
      else root.classList.remove(DARK_CLASS);
    };

    apply();

    const observer = new MutationObserver(() => {
      const wantDark = getSystemTheme() === 'dark';
      const hasDark = root.classList.contains(DARK_CLASS);
      if (wantDark && !hasDark) root.classList.add(DARK_CLASS);
      else if (!wantDark && hasDark) root.classList.remove(DARK_CLASS);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);

    return () => {
      observer.disconnect();
      mq.removeEventListener('change', apply);
    };
  }, [theme]);
  return <>{children}</>;
}

const withSystemTheme = (
  Story: React.ComponentType,
  context: { globals: { theme?: string } },
) => {
  const raw = context.globals?.theme ?? '';
  const theme = raw === '' ? 'system' : raw;
  return (
    <SystemThemeSync theme={theme}>
      <Story />
    </SystemThemeSync>
  );
};

// Outermost wrapper: provides Jotai store + nuqs URL adapter to every story.
// Listed last in `decorators` so it is the outermost React component.
const withJotaiAndNuqs = (Story: React.ComponentType) => (
  <JotaiProvider>
    <NuqsAdapter>
      <Story />
    </NuqsAdapter>
  </JotaiProvider>
);

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: DARK_CLASS,
        system: '',
      },
      defaultTheme: 'system',
    }),
    withSystemTheme,
    withJotaiAndNuqs,
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

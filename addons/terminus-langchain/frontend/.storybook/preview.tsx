import '../src/index.css';

import React, { useEffect } from 'react';

import { DocsContainer } from '@storybook/addon-docs/blocks';
import { withThemeByClassName } from '@storybook/addon-themes';
import { Provider as JotaiProvider } from 'jotai';
import { NuqsAdapter } from 'nuqs/adapters/react';

import { getSystemTheme, resolveTheme } from './theme';

import type { Preview } from '@storybook/react-vite';

const DARK_CLASS = 'dark';

function SystemThemeSync({ children, theme }: { theme: string; children: React.ReactNode }) {
  useEffect(() => {
    if (theme !== 'system') return;
    const root = document.documentElement;

    const apply = () => {
      const mode = getSystemTheme();
      if (mode === 'dark') root.classList.add(DARK_CLASS);
      else root.classList.remove(DARK_CLASS);
    };

    apply();

    // Re-apply whenever the addon (or anything) changes the class, so we always win for system theme
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

const withSystemTheme = (Story: React.ComponentType, context: { globals: { theme?: string } }) => {
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

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    docs: {
      container: (({ children, context }) => {
        const { theme } = context.store.userGlobals.globals;
        const [, setCurrentTheme] = React.useState(theme);

        useEffect(() => {
          const apply = () => {
            const mode = getSystemTheme();
            setCurrentTheme(mode);
          };

          apply();

          const mq = window.matchMedia('(prefers-color-scheme: dark)');
          mq.addEventListener('change', apply);

          return () => {
            mq.removeEventListener('change', apply);
          };
        }, [theme]);

        return (
          <DocsContainer context={context} theme={resolveTheme(theme)}>
            {children}
          </DocsContainer>
        );
      }) satisfies typeof DocsContainer,
    },
  },
};

export default preview;

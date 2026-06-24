import { create } from 'storybook/theming';

// Load the registry's typefaces wherever these themes are used. The preview
// iframe also gets them via src/index.css, but the manager and docs containers
// have their own documents, so the theme module that references the fonts is
// responsible for loading them.
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';

export const FONT_MONO = "'JetBrains Mono Variable', monospace";

// Static hex translations of the base-nova "mist" palette (src/index.css).
// Storybook themes can't consume the oklch CSS variables — polished (used for
// hover/selected states) throws on oklch — so these are pre-converted.
export const MIST = {
  teal: '#007595', // --primary (light)
  light: {
    bg: '#ffffff',
    sidebar: '#f1f3f3', // --muted
    border: '#e3e7e8', // --border
    text: '#090b0c', // --foreground
    muted: '#67787c', // --muted-foreground
  },
  dark: {
    bg: '#090b0c', // --background
    sidebar: '#161b1d', // --card
    border: 'rgba(255, 255, 255, 0.1)', // --border (oklch(1 0 0 / 10%))
    text: '#f9fbfb', // --foreground
    muted: '#9ca8ab', // --muted-foreground
  },
};

const brand = {
  brandTitle: 'Terminus Addon',
  brandUrl: 'https://github.com/terminus/terminus-ui',
  fontBase: FONT_MONO,
  fontCode: FONT_MONO,
  colorPrimary: MIST.teal,
  colorSecondary: MIST.teal,
  appBorderRadius: 0, // base-nova uses --radius: 0 (sharp corners)
  inputBorderRadius: 0,
};

export const lightTheme = create({
  ...brand,
  base: 'light',
  appBg: MIST.light.sidebar,
  appContentBg: MIST.light.bg,
  appPreviewBg: MIST.light.bg,
  appBorderColor: MIST.light.border,
  textColor: MIST.light.text,
  textInverseColor: MIST.light.bg,
  textMutedColor: MIST.light.muted,
  barBg: MIST.light.bg,
  barTextColor: MIST.light.muted,
  barSelectedColor: MIST.teal,
  barHoverColor: MIST.teal,
  inputBg: MIST.light.bg,
  inputBorder: MIST.light.border,
  inputTextColor: MIST.light.text,
});

export const darkTheme = create({
  ...brand,
  base: 'dark',
  appBg: MIST.dark.sidebar,
  appContentBg: MIST.dark.bg,
  appPreviewBg: MIST.dark.bg,
  appBorderColor: MIST.dark.border,
  textColor: MIST.dark.text,
  textInverseColor: MIST.dark.bg,
  textMutedColor: MIST.dark.muted,
  barBg: MIST.dark.sidebar,
  barTextColor: MIST.dark.muted,
  barSelectedColor: MIST.teal,
  barHoverColor: MIST.teal,
  inputBg: MIST.dark.bg,
  inputBorder: MIST.dark.border,
  inputTextColor: MIST.dark.text,
});

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Resolve a Storybook global theme value ('light' | 'dark' | 'system' | '') to a
// concrete custom theme, treating 'system'/empty as the OS preference.
export function resolveTheme(theme?: string) {
  const mode = !theme || theme === 'system' ? getSystemTheme() : theme;
  return mode === 'dark' ? darkTheme : lightTheme;
}

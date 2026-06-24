import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import importX from 'eslint-plugin-import-x';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  globalIgnores(['dist', 'storybook-static', '.vite']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'import-x': importX,
      'sort-destructure-keys': sortDestructureKeys,
      perfectionist,
    },
    rules: {
      // Sort and group imports (import-x)
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [{ pattern: 'react', group: 'external', position: 'before' }],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      // Sort destructure keys
      'sort-destructure-keys/sort-destructure-keys': 'error',
      // Sort TypeScript interface properties and enums (replaces typescript-sort-keys)
      'perfectionist/sort-interfaces': ['error', { type: 'alphabetical', order: 'asc' }],
      'perfectionist/sort-enums': ['error', { type: 'alphabetical', order: 'asc' }],
    },
  },
  eslintPluginPrettierRecommended,
  {
    // Project conventions: kebab-case file/folder names and named (not default)
    // exports across our own source. Scoped to src/ and excludes the vendored
    // shadcn components under ui/ (kept byte-identical to upstream) and the
    // vendored use-mobile hook. Co-located Storybook stories are exempted from
    // the default-export ban below (Storybook CSF requires `export default meta`).
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/ui/**', 'src/hooks/use-mobile.ts'],
    plugins: { unicorn },
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'import-x/no-default-export': 'error',
    },
  },
  {
    // Co-located Storybook stories (src/**/*.stories.tsx). CSF mandates a default
    // export (the meta object), so the project-wide default-export ban does not
    // apply here. Stories are dev-only tooling and ship in no production bundle.
    files: ['**/*.stories.{ts,tsx}'],
    rules: {
      'import-x/no-default-export': 'off',
    },
  },
  {
    // Vendored shadcn registry sources: kept byte-identical to the upstream preset
    // so they survive `shadcn` re-pulls. The preset ships variant/hook exports
    // alongside components and setState-in-effect patterns that this repo's
    // stricter lint flags; relax those two rules for the vendored directories
    // instead of patching every file on each refresh.
    files: ['src/components/ui/**/*.{ts,tsx}', 'src/hooks/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // TODO(lint): temporary relaxations from initial ESLint adoption (config copied from
    // terminus-ui). Each rule below is disabled ONLY because existing source already violates
    // it; the files listed above each rule are the current offenders captured at adoption time.
    // Revisit incrementally — fix the listed files, then delete the rule line so the rule
    // re-tightens to error. This whole block should eventually disappear.
    rules: {
      // Offenders:
      //   src/components/thread/agent-inbox/components/state-view.tsx
      //   src/components/thread/agent-inbox/hooks/use-interrupted-actions.tsx
      //   src/components/thread/agent-inbox/types.ts
      //   src/components/thread/agent-inbox/utils.ts
      //   src/components/thread/thread.tsx
      //   src/components/thread/markdown-text.tsx
      //   src/components/thread/messages/ai.tsx
      //   src/components/thread/messages/generic-interrupt.tsx
      //   src/components/thread/messages/tool-calls.tsx
      '@typescript-eslint/no-explicit-any': 'off',
      // Offenders:
      //   src/components/thread/agent-inbox/components/tool-call-table.tsx
      //   src/components/thread/agent-inbox/utils.ts
      //   src/components/thread/thread.tsx
      //   src/hooks/use-file-upload.tsx
      '@typescript-eslint/no-unused-vars': 'off',
      // Offenders:
      //   src/components/thread/agent-inbox/components/inbox-item-input.tsx
      //   src/components/thread/thread.tsx
      'react-hooks/refs': 'off',
      // Offenders:
      //   src/components/graph/entity-detail-modal.tsx
      //   src/components/graph/graph-canvas.tsx
      //   src/components/thread/agent-inbox/components/state-view.tsx
      //   src/components/thread/agent-inbox/components/thread-actions-view.tsx
      //   src/components/thread/agent-inbox/hooks/use-interrupted-actions.tsx
      //   src/components/thread/agent-inbox/agent-inbox.tsx
      //   src/providers/stream.tsx
      'react-hooks/set-state-in-effect': 'off',
      // Offenders:
      //   src/components/graph/nodes.tsx
      //   src/components/thread/artifact.tsx
      //   src/providers/stream.tsx
      //   src/providers/thread.tsx
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // TODO(lint): import ordering not yet enforced in test files. Revisit — fix the offender
    // below and remove this block so 'import-x/order' applies to tests too.
    // Offender:
    //   src/components/thread/ha-status-indicator.test.tsx
    files: ['**/*.{test,spec}.{ts,tsx}'],
    rules: {
      'import-x/order': 'off',
    },
  },
]);

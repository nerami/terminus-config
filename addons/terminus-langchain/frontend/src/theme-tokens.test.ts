// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

// Chat components that must use theme tokens (not hardcoded light-mode colors)
// so they render correctly in both light and dark themes. Code blocks in
// markdown-text.tsx are intentionally dark in both themes and are excluded.
const THEMED_FILES = [
  'components/thread/index.tsx',
  'components/thread/history/index.tsx',
  'components/thread/MultimodalPreview.tsx',
  'components/thread/messages/tool-calls.tsx',
  'components/thread/messages/generic-interrupt.tsx',
  'components/thread/agent-inbox/index.tsx',
  'components/thread/agent-inbox/components/inbox-item-input.tsx',
  'components/thread/agent-inbox/components/state-view.tsx',
  'components/thread/agent-inbox/components/thread-actions-view.tsx',
  'components/thread/agent-inbox/components/thread-id.tsx',
  'components/thread/agent-inbox/components/tool-call-table.tsx',
];

// Tailwind utilities tied to a fixed (light) palette — banned in chat components.
const BANNED = [
  /\bbg-gray-\d/,
  /\btext-gray-\d/,
  /\bborder-gray-\d/,
  /\bbg-zinc-\d/,
  /\btext-zinc-\d/,
  /\bborder-slate-\d/,
  /\bbg-slate-\d/,
  /\btext-black\b/,
  /\bbg-white\b/,
];

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(`./${rel}`, import.meta.url)), 'utf8');
}

describe('chat components use theme tokens', () => {
  it.each(THEMED_FILES)('%s has no hardcoded palette classes', (rel) => {
    const src = read(rel);
    for (const pattern of BANNED) {
      expect(src, `${rel} should not contain ${pattern}`).not.toMatch(pattern);
    }
  });

  it('markdown-styles.css uses CSS variables, not hex colors', () => {
    const src = read('components/thread/markdown-styles.css');
    expect(src).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    expect(src).toMatch(/var\(--/);
  });
});

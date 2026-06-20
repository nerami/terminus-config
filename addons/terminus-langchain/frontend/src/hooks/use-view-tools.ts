import { useAtom } from 'jotai';

import { viewToolsAtom } from '@/lib/settings';

/**
 * Whether tool-call messages are rendered in the chat. Persisted in
 * localStorage (default `true`, tools shown). Toggled from the sidebar Settings
 * menu and read by the assistant message renderer.
 */
export function useViewTools() {
  return useAtom(viewToolsAtom);
}

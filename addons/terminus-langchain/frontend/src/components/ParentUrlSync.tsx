import { useEffect, useRef } from 'react';

import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs';

import { useThreadId } from '@/hooks/use-thread-id';
import { mirrorToParent, relativeLocation } from '@/lib/parent-url';
import { resolveBasePath } from '@/runtime-config';

/**
 * Mirrors the iframe's current location (path + query) into the parent (Home
 * Assistant) window's URL hash, so a full-page refresh / new tab / shared link
 * restores the same session + topology view. Renders nothing; mount once.
 *
 * It reads the path (threadId) and the topology query params purely so it
 * re-renders when they change — the effect then reads the live `window.location`,
 * so it also picks up any other query params. The mirror itself no-ops gracefully
 * when the parent is unreachable (see `getParentWindow` in lib/parent-url).
 */
export function ParentUrlSync(): null {
  // Subscriptions: re-render when the meaningful URL state changes. Values unused.
  const [threadId] = useThreadId();
  const [topology] = useQueryState('topology', parseAsBoolean.withDefault(false));
  const [area] = useQueryState('area', parseAsString);
  const [scene] = useQueryState('scene', parseAsString);
  const [automation] = useQueryState('automation', parseAsString);
  void threadId;
  void topology;
  void area;
  void scene;
  void automation;

  const last = useRef<string | null>(null);
  useEffect(() => {
    const rel = relativeLocation(window.location, resolveBasePath(window.location));
    if (rel === last.current) return;
    last.current = rel;
    mirrorToParent(rel);
  });

  return null;
}

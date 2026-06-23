import { useEffect, useRef } from 'react';

import { parseAsString, useQueryStates } from 'nuqs';

import { useThreadId } from '@/hooks/use-thread-id';
import { writeCheckpoint } from '@/lib/navigation-checkpoint';
import { mirrorToParent, relativeLocation } from '@/lib/parent-url';
import { resolveBasePath } from '@/runtime-config';

/**
 * Single write-through persistence boundary for navigation state. On every
 * navigation it mirrors the iframe's relative location into BOTH the parent
 * (HA) URL hash (survives reload) and localStorage (survives leave-and-return).
 * Neither is ever read at runtime — window.location is the source of truth; these
 * are read only at boot (parent-url-restore / navigation-checkpoint-restore).
 *
 * Subscribes to the canonical nav param set (`layout` / `group` / `area` /
 * `scene` / `automation`) + the thread path purely to re-render when they
 * change; the effect then reads the live window.location, so it captures the
 * full location. The subscription must list every nav param — watching only a
 * subset would miss layout/group-only changes.
 *
 * Renders nothing; mount once.
 */
export function NavigationCheckpointSync(): null {
  const [threadId] = useThreadId();
  const [navParams] = useQueryStates({
    layout: parseAsString,
    group: parseAsString,
    area: parseAsString,
    scene: parseAsString,
    automation: parseAsString,
  });
  void threadId;
  void navParams;

  const last = useRef<string | null>(null);
  useEffect(() => {
    const rel = relativeLocation(window.location, resolveBasePath(window.location));
    if (rel === last.current) return;
    last.current = rel;
    mirrorToParent(rel);
    writeCheckpoint(window.localStorage, rel);
  });

  return null;
}

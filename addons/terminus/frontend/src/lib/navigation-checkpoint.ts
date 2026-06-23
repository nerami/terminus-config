// Pure core for the navigation checkpoint: localStorage is a write-through
// fallback, never a source of truth. The URL (window.location) is authoritative;
// the checkpoint only seeds boot when the URL carries no specific location.

export const CHECKPOINT_KEY = 'terminus-nav-checkpoint';

/** A relative location with nothing to restore over ("/" or empty). */
export function isBaseLocation(rel: string): boolean {
  return rel === '/' || rel === '';
}

/**
 * The location to boot at. The URL wins whenever it already carries a non-base
 * location (e.g. a real navigation or a parent-hash restore); otherwise fall
 * back to the checkpoint; otherwise null so the app's own defaults stand.
 */
export function resolveInitialLocation(currentRel: string, checkpoint: string | null): string | null {
  if (!isBaseLocation(currentRel)) return null;
  if (checkpoint && !isBaseLocation(checkpoint)) return checkpoint;
  return null;
}

export function readCheckpoint(storage: Pick<Storage, 'getItem'>): string | null {
  try {
    return storage.getItem(CHECKPOINT_KEY);
  } catch {
    return null;
  }
}

export function writeCheckpoint(storage: Pick<Storage, 'setItem'>, rel: string): void {
  try {
    storage.setItem(CHECKPOINT_KEY, rel);
  } catch {
    // Private mode / quota — checkpoint is best-effort, never fatal.
  }
}

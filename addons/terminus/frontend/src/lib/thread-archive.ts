/** Metadata patch applied to a thread when the user archives it. */
export const ARCHIVE_METADATA = { archived: true } as const;

type HasMetadata = { metadata?: Record<string, unknown> | null };

/** Whether a thread has been archived (hidden from the history list). */
export function isArchived(thread: HasMetadata): boolean {
  return thread.metadata?.archived === true;
}

/** Drop archived threads from a list (we only show active conversations). */
export function filterActiveThreads<T extends HasMetadata>(threads: T[]): T[] {
  return threads.filter((t) => !isArchived(t));
}

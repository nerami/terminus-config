/**
 * A thread's display title is stored in its metadata under `title`, set either
 * by the user (rename) or by the backend title generator. This mirrors the
 * archive flag in `thread-archive.ts`: a small, mergeable metadata patch.
 */
type HasMetadata = { metadata?: Record<string, unknown> | null };

/** The user-set / generated title stored in thread metadata, if any. */
export function storedThreadTitle(thread: HasMetadata): string | undefined {
  const title = thread.metadata?.title;
  return typeof title === 'string' && title.trim() ? title.trim() : undefined;
}

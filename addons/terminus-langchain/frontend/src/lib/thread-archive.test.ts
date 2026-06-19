import { describe, expect, it } from "vitest";

import {
  ARCHIVE_METADATA,
  filterActiveThreads,
  isArchived,
} from "./thread-archive";

type T = { thread_id: string; metadata?: Record<string, unknown> };

describe("thread-archive", () => {
  it("archive metadata marks a thread archived", () => {
    expect(ARCHIVE_METADATA).toEqual({ archived: true });
    expect(isArchived({ metadata: ARCHIVE_METADATA })).toBe(true);
  });

  it("treats threads without the flag as active", () => {
    expect(isArchived({ metadata: {} })).toBe(false);
    expect(isArchived({ metadata: { archived: false } })).toBe(false);
    expect(isArchived({})).toBe(false);
  });

  it("filters archived threads out of the list", () => {
    const threads: T[] = [
      { thread_id: "a" },
      { thread_id: "b", metadata: { archived: true } },
      { thread_id: "c", metadata: { graph_id: "agent" } },
    ];
    expect(filterActiveThreads(threads).map((t) => t.thread_id)).toEqual([
      "a",
      "c",
    ]);
  });
});

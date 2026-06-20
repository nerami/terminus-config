import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const setThreadId = vi.fn();
const closeArtifact = vi.fn();
const setArtifactContext = vi.fn();

vi.mock('@/hooks/use-thread-id', () => ({
  useThreadId: () => [null, setThreadId],
}));
vi.mock('@/components/thread/artifact', () => ({
  useArtifactOpen: () => [false, closeArtifact],
  useArtifactContext: () => [{}, setArtifactContext],
}));

import { useNewThread } from './use-new-thread';

beforeEach(() => {
  setThreadId.mockReset();
  closeArtifact.mockReset();
  setArtifactContext.mockReset();
});

describe('useNewThread', () => {
  it('clears the thread, closes the artifact, and resets context when invoked', () => {
    const { result } = renderHook(() => useNewThread());
    act(() => result.current());

    expect(setThreadId).toHaveBeenCalledWith(null);
    expect(closeArtifact).toHaveBeenCalledTimes(1);
    expect(setArtifactContext).toHaveBeenCalledWith({});
  });
});

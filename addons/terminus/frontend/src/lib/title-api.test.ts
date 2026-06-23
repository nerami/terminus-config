import { afterEach, describe, expect, it, vi } from 'vitest';

import { postThreadTitle } from './title-api';

import { http } from '@/lib/http';

vi.mock('@/lib/http', () => ({ http: { get: vi.fn(), post: vi.fn() } }));

const mockPost = vi.mocked(http.post);

afterEach(() => {
  vi.clearAllMocks();
});

describe('postThreadTitle', () => {
  it('posts the message and returns the trimmed title', async () => {
    mockPost.mockResolvedValue({ data: { title: '  Kitchen lights  ' } });
    const title = await postThreadTitle('http://x/api', 'turn on kitchen lights');
    expect(title).toBe('Kitchen lights');
    expect(mockPost).toHaveBeenCalledWith('http://x/api/title', { message: 'turn on kitchen lights' });
  });

  it('returns null when the response has no title', async () => {
    mockPost.mockResolvedValue({ data: {} });
    expect(await postThreadTitle('http://x/api', 'hi')).toBeNull();
  });

  it('returns null when the title is blank', async () => {
    mockPost.mockResolvedValue({ data: { title: '   ' } });
    expect(await postThreadTitle('http://x/api', 'hi')).toBeNull();
  });

  it('returns null (swallows) when the request fails', async () => {
    mockPost.mockRejectedValue(new Error('boom'));
    expect(await postThreadTitle('http://x/api', 'hi')).toBeNull();
  });
});

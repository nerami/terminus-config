import { http } from '@/lib/http';

// Best-effort thread-title generation: POST the first user message to the
// backend's `/title` endpoint and return the trimmed title, or null when the
// request fails or yields no usable title. Failures are intentionally
// swallowed — a missing title is a non-event for the UI.
export async function postThreadTitle(apiUrl: string, message: string): Promise<string | null> {
  try {
    const { data } = await http.post<{ title?: string }>(`${apiUrl}/title`, { message });
    const title = (data?.title ?? '').trim();
    return title || null;
  } catch {
    return null;
  }
}

import axios, { type InternalAxiosRequestConfig } from 'axios';

import { getApiKey } from '@/lib/api-key';

// Reads the `authScheme` query param from the current URL (set via nuqs in the
// providers). Mirrors how StreamProvider/ThreadProvider resolve it, so the
// interceptor and the SDK agree on the value.
function resolveAuthScheme(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('authScheme');
}

// Request interceptor: attach the agent/HA auth headers when available and not
// already set by the caller. Only `/info` validates them today, but the same
// FastAPI ignores extra headers on `/ha/*`, so attaching globally is safe and
// keeps call sites free of header plumbing.
export function attachAuthHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const apiKey = getApiKey();
  if (apiKey && !config.headers.has('X-Api-Key')) config.headers.set('X-Api-Key', apiKey);

  const authScheme = resolveAuthScheme();
  if (authScheme && !config.headers.has('X-Auth-Scheme')) config.headers.set('X-Auth-Scheme', authScheme);

  return config;
}

// Shared axios instance. No baseURL — callers pass absolute URLs resolved at
// runtime by `endpoints()` (src/runtime-config.ts) so the SPA works under the
// dynamic HA ingress prefix as well as the Vite dev server.
export const http = axios.create();
http.interceptors.request.use(attachAuthHeaders);

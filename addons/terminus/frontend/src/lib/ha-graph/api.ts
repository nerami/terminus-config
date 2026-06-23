import axios from 'axios';

import type { AutomationDetail, EntityState, Topology } from './types';

import { http } from '@/lib/http';
import { endpoints } from '@/runtime-config';

// Mirror the previous fetch-based extraction: prefer the backend's JSON
// `error` field, fall back to the HTTP status line, and finally to the raw
// error message when there is no response (network failure / CORS).
function extractError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
    if (err.response) return `${err.response.status} ${err.response.statusText}`;
    return err.message;
  }
  return err instanceof Error ? err.message : String(err);
}

async function getJson<T>(url: string): Promise<T> {
  try {
    const res = await http.get<T>(url);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

/** Fetch the full Home Assistant topology snapshot. */
export function fetchTopology(): Promise<Topology> {
  return getJson<Topology>(endpoints().haTopologyUrl);
}

/** Fetch a single automation's config plus the ids it references. */
export function fetchAutomation(numericId: string, entityId?: string): Promise<AutomationDetail> {
  return getJson<AutomationDetail>(endpoints().haAutomationUrl(numericId, entityId));
}

/** Fetch a single entity's live state + attributes (for the detail modal). */
export function fetchEntity(entityId: string): Promise<EntityState> {
  return getJson<EntityState>(endpoints().haEntityUrl(entityId));
}

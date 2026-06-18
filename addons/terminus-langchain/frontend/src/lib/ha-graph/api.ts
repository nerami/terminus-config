import { endpoints } from "@/runtime-config";

import type { AutomationDetail, EntityState, Topology } from "./types";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) detail = body.error;
    } catch {
      // non-JSON error body; keep the status line.
    }
    throw new Error(detail);
  }
  return (await res.json()) as T;
}

/** Fetch the full Home Assistant topology snapshot. */
export function fetchTopology(): Promise<Topology> {
  return getJson<Topology>(endpoints().haTopologyUrl);
}

/** Fetch a single automation's config plus the ids it references. */
export function fetchAutomation(
  numericId: string,
  entityId?: string,
): Promise<AutomationDetail> {
  return getJson<AutomationDetail>(
    endpoints().haAutomationUrl(numericId, entityId),
  );
}

/** Fetch a single entity's live state + attributes (for the detail modal). */
export function fetchEntity(entityId: string): Promise<EntityState> {
  return getJson<EntityState>(endpoints().haEntityUrl(entityId));
}

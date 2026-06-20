import { useEffect, useState } from 'react';

import { endpoints } from '@/runtime-config';

export type HaConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'auth_failed';

export type HaStatus = {
  status: HaConnectionStatus;
  ha_version: string | null;
  last_connected: string | null;
  error: string | null;
  url?: string;
};

const INITIAL: HaStatus = {
  status: 'connecting',
  ha_version: null,
  last_connected: null,
  error: null,
};

/** Polls the backend `/ha/status` endpoint and returns the latest status. */
export function useHaStatus(intervalMs = 5000): HaStatus {
  const [status, setStatus] = useState<HaStatus>(INITIAL);

  useEffect(() => {
    let active = true;
    const url = endpoints().haStatusUrl;

    const tick = async () => {
      try {
        const res = await fetch(url);
        const data = (await res.json()) as HaStatus;
        if (active) setStatus(data);
      } catch (err) {
        if (active) {
          setStatus((prev) => ({
            ...prev,
            status: 'disconnected',
            error: err instanceof Error ? err.message : String(err),
          }));
        }
      }
    };

    void tick();
    const id = window.setInterval(() => void tick(), intervalMs);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [intervalMs]);

  return status;
}

'use client';

import { useEffect, useState } from 'react';
import type { StatusResponse, StatusValue } from '@/app/api/status/route';

export function DriftsmeldingBar() {
  const [status, setStatus] = useState<StatusValue | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as StatusResponse;
        setStatus(json.status);
      } catch {
        setStatus(null);
      }
    };

    fetchStatus();
    const onUpdated = () => fetchStatus();
    window.addEventListener('status-updated', onUpdated);
    return () => window.removeEventListener('status-updated', onUpdated);
  }, []);

  if (!status || status === 'ok') return null;

  const isOutage = status === 'outage';

  return (
    <div
      className={
        isOutage
          ? 'bg-red-500 py-2 text-center text-sm font-medium text-red-50'
          : 'bg-amber-400 py-2 text-center text-sm font-medium text-amber-950'
      }
      role="status"
      aria-live="polite"
    >
      Driftsmelding
    </div>
  );
}

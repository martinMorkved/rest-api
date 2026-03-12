'use client';

import { useEffect, useState } from 'react';
import type { StatusResponse, StatusValue } from '@/app/api/status/route';

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-24 w-24 text-emerald-500"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" className="stroke-[2.5]" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-24 w-24 text-amber-500"
      aria-hidden
    >
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-24 w-24 text-red-500"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

export function DriftsmeldingerContent() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError((json as { error?: string }).error ?? 'Kunne ikke hente status');
          setData(null);
          return;
        }
        setData(json as StatusResponse);
        setError(null);
      } catch {
        setError('Kunne ikke hente driftstatus.');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const onUpdated = () => fetchStatus();
    window.addEventListener('status-updated', onUpdated);
    return () => window.removeEventListener('status-updated', onUpdated);
  }, []);

  return (
    <>
      <header className="relative overflow-hidden bg-[#1e3a5f] px-6 py-10 sm:px-8 sm:py-12">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
            backgroundSize: '18px 18px',
            maskImage: 'linear-gradient(to right, black 50%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 85%)',
          }}
          aria-hidden
        />
        <h1 className="relative text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Driftsmeldinger
        </h1>
      </header>

      <div className="flex flex-1 flex-col bg-white px-6 py-10 sm:px-8 sm:py-12">
        {loading && (
          <p className="text-slate-600">Laster driftsstatus …</p>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              {data.status === 'ok' ? (
                <>
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Ingen driftsmeldinger
                  </h2>
                  <p className="mt-1 text-slate-700">
                    Vi har for tiden ingen driftsavbrudd.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Driftsmelding
                  </h2>
                  <p className="mt-1 text-slate-700">{data.message}</p>
                  {data.expectedDowntime && (
                    <p className="mt-2 text-sm text-slate-600">
                      Forventet nedetid: {data.expectedDowntime}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-slate-500">
                    Sist oppdatert:{' '}
                    {new Date(data.updatedAt).toLocaleString('nb-NO', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                </>
              )}
            </div>

            <div className="flex-shrink-0" aria-hidden>
              {data.status === 'ok' && <CheckIcon />}
              {data.status === 'maintenance' && <WarningIcon />}
              {data.status === 'outage' && <ErrorIcon />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

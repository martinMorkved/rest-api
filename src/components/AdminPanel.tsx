'use client';

import { useCallback, useEffect, useState } from 'react';
import type { StatusResponse, StatusValue } from '@/app/api/status/route';

const STATUS_OPTIONS: { value: StatusValue; label: string }[] = [
  { value: 'ok', label: 'Alt ok' },
  { value: 'maintenance', label: 'Vedlikehold' },
  { value: 'outage', label: 'Feil' },
];

type AdminPanelProps = {
  /** Kalles etter vellykket «Oppdater status» – f.eks. for å lukke mobil-overlay */
  onSuccess?: () => void;
};

export function AdminPanel({ onSuccess }: AdminPanelProps = {}) {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ status: 'ok' as StatusValue, message: '', expectedDowntime: '' });

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status', { cache: 'no-store' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((json as { error?: string }).error ?? `Feil ${res.status}`);
        setData(null);
        return;
      }
      const statusData = json as StatusResponse;
      setData(statusData);
      setForm({
        status: statusData.status,
        message: statusData.message,
        expectedDowntime: statusData.expectedDowntime ?? '',
      });
      setError(null);
    } catch (e) {
      setError('Kunne ikke hente status');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: form.status,
          message: form.message,
          expectedDowntime: form.expectedDowntime.trim() || null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((json as { error?: string }).error ?? 'Kunne ikke oppdatere');
        return;
      }
      setData(json as StatusResponse);
      setError(null);
      window.dispatchEvent(new CustomEvent('status-updated'));
      onSuccess?.();
    } catch {
      setError('Kunne ikke oppdatere status');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section
        className="z-10 flex w-full max-w-full flex-shrink-0 flex-col overflow-y-auto rounded-l-2xl border border-slate-700 border-r-0 bg-slate-900/95 shadow-xl backdrop-blur sm:w-80"
        style={{ maxHeight: '85vh' }}
      >
        <div className="p-5">
          <h2 className="mb-3 text-base font-semibold text-slate-50">
            Admin / API-kontrollpanel
          </h2>
          <p className="text-sm text-slate-400">Laster …</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="z-10 flex w-full max-w-full flex-shrink-0 flex-col overflow-y-auto rounded-l-2xl border border-slate-700 border-r-0 bg-slate-900/95 shadow-xl backdrop-blur sm:w-80"
      style={{ maxHeight: '85vh' }}
    >
      <div className="p-5 space-y-4">
        <h2 className="text-base font-semibold text-slate-50">
          Admin / API-kontrollpanel
        </h2>

        {/* JSON */}
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            Nåværende respons (GET /api/status)
          </p>
          <pre className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs text-slate-300 overflow-x-auto max-h-32 overflow-y-auto">
            {data
              ? JSON.stringify(
                {
                  status: data.status,
                  message: data.message,
                  expectedDowntime: data.expectedDowntime,
                  updatedAt: data.updatedAt,
                },
                null,
                2
              )
              : '—'}
          </pre>
        </div>

        {error && (
          <p className="rounded-lg border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Status
            </label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: value }))}
                  className={
                    form.status === value
                      ? 'rounded bg-slate-600 px-2.5 py-1.5 text-xs font-medium text-white'
                      : 'rounded border border-slate-600 bg-slate-800/50 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700'
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="admin-message" className="mb-1 block text-xs font-medium text-slate-400">
              Melding
            </label>
            <textarea
              id="admin-message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={2}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="Driftsmelding til kunder …"
            />
          </div>

          <div>
            <label htmlFor="admin-downtime" className="mb-1 block text-xs font-medium text-slate-400">
              Forventet nedetid (valgfri)
            </label>
            <input
              id="admin-downtime"
              type="text"
              value={form.expectedDowntime}
              onChange={(e) => setForm((f) => ({ ...f, expectedDowntime: e.target.value }))}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="F.eks. 21:00–22:00"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-slate-600 py-2 text-sm font-medium text-white hover:bg-slate-500 disabled:opacity-50"
          >
            {saving ? 'Lagrer …' : 'Oppdater status'}
          </button>
        </form>
      </div>
    </section>
  );
}

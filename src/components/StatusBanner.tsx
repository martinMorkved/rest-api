'use client';

import { useEffect, useState } from 'react';
import type { StatusResponse, StatusValue } from '@/app/api/status/route';

const statusConfig: Record<
    StatusValue,
    { label: string; bgClass: string; textClass: string }
> = {
    ok: {
        label: 'Alt ok',
        bgClass: 'bg-emerald-500',
        textClass: 'text-emerald-950',
    },
    maintenance: {
        label: 'Vedlikehold',
        bgClass: 'bg-amber-400',
        textClass: 'text-amber-950',
    },
    outage: {
        label: 'Feil',
        bgClass: 'bg-red-500',
        textClass: 'text-red-50',
    },
};

type StatusBannerProps = {
    variant?: 'dark' | 'light';
};

export function StatusBanner({ variant = 'dark' }: StatusBannerProps) {
    const [data, setData] = useState<StatusResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isLight = variant === 'light';

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/status', { cache: 'no-store' });
                const json = await res.json().catch(() => ({}));
                if (!res.ok) {
                    const msg = (json as { error?: string })?.error ?? `Feil fra API: ${res.status}`;
                    setError(msg);
                    return;
                }
                setData(json as StatusResponse);
            } catch (err) {
                console.error(err);
                setError('Kunne ikke hente driftstatus.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const onUpdated = () => fetchStatus();
        window.addEventListener('status-updated', onUpdated);
        return () => window.removeEventListener('status-updated', onUpdated);
    }, []);

    if (loading) {
        return (
            <div
                className={
                    isLight
                        ? 'rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700'
                        : 'rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200'
                }
            >
                Laster driftstatus …
            </div>
        );
    }

    if (error || !data) {
        return (
            <div
                className={
                    isLight
                        ? 'rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800'
                        : 'rounded-lg border border-red-500/60 bg-red-950 px-4 py-3 text-sm text-red-100'
                }
            >
                {error ?? 'Ukjent feil ved henting av status.'}
            </div>
        );
    }

    const cfg = statusConfig[data.status];

    return (
        <div className="space-y-2">
            <div
                className={`flex items-center justify-between rounded-lg px-4 py-3 ${cfg.bgClass} ${cfg.textClass}`}
            >
                <div className="font-semibold tracking-wide uppercase text-xs">
                    Driftstatus
                </div>
                <div className="text-sm font-medium">{cfg.label}</div>
            </div>

            <div
                className={
                    isLight
                        ? 'rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800'
                        : 'rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100'
                }
            >
                {data.message}
            </div>

            {data.expectedDowntime ? (
                <div
                    className={
                        isLight
                            ? 'rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800'
                            : 'rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100'
                    }
                >
                    <span className={isLight ? 'font-medium text-slate-600' : 'font-medium text-slate-300'}>
                        Forventet nedetid:{' '}
                    </span>
                    {data.expectedDowntime}
                </div>
            ) : null}

            <div
                className={isLight ? 'text-xs text-slate-500' : 'text-xs text-slate-400'}
            >
                Sist oppdatert:{' '}
                {new Date(data.updatedAt).toLocaleString('nb-NO', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                })}
            </div>
        </div>
    );
}

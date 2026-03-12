'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminPanel } from './AdminPanel';

type AdminPanelWrapperProps = {
  children: React.ReactNode;
};

export function AdminPanelWrapper({ children }: AdminPanelWrapperProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const closeOverlay = useCallback(() => setIsOverlayOpen(false), []);

  useEffect(() => {
    const handler = () => setIsOverlayOpen(false);
    window.addEventListener('status-updated', handler);
    return () => window.removeEventListener('status-updated', handler);
  }, []);

  return (
    <>
      <div className="mx-auto flex h-screen max-w-6xl items-stretch gap-0 px-4 py-6 md:gap-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <button
            type="button"
            onClick={() => setIsOverlayOpen(true)}
            className="md:hidden mb-3 w-full rounded-xl border-2 border-slate-400 bg-slate-100 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            aria-label="Åpne Admin / API-kontrollpanel"
          >
            Admin / API-kontrollpanel
          </button>
          {children}
        </div>

        {/* Desktop panel */}
        <div className="hidden md:block md:w-80 md:flex-shrink-0">
          <AdminPanel />
        </div>
      </div>

      {/* Mobil overlay */}
      {isOverlayOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-slate-900 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin / API-kontrollpanel"
        >
          <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-700 px-4 py-3">
            <h2 className="text-base font-semibold text-slate-50">
              Admin / API-kontrollpanel
            </h2>
            <button
              type="button"
              onClick={closeOverlay}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label="Lukk"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <AdminPanel onSuccess={closeOverlay} />
          </div>
        </div>
      )}
    </>
  );
}

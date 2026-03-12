'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DriftsmeldingBar } from './DriftsmeldingBar';

type CustomerSideProps = {
  children: React.ReactNode;
  hideStatusBar?: boolean;
};

const NAV_LINKS = [
  { href: '/', label: 'Hjem' },
  { href: '#', label: 'Tjenester' },
  { href: '#', label: 'Om oss' },
  { href: '#', label: 'Kontakt' },
  { href: '/driftsstatus', label: 'Driftstatus' },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV_LINKS.map(({ href, label }) =>
        href.startsWith('/') ? (
          <li key={label}>
            <Link
              href={href}
              className="block py-2 hover:text-slate-900 md:py-0"
              onClick={onNavigate}
            >
              {label}
            </Link>
          </li>
        ) : (
          <li key={label}>
            <a
              href={href}
              className="block py-2 hover:text-slate-900 md:py-0"
              onClick={onNavigate}
            >
              {label}
            </a>
          </li>
        )
      )}
    </>
  );
}

export function CustomerSide({ children, hideStatusBar }: CustomerSideProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white">
      {!hideStatusBar && <DriftsmeldingBar />}
      <nav className="relative border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
        {/* Hamburger menu */}
        <div className="flex items-center justify-between md:justify-start">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Lukk meny' : 'Åpne meny'}
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
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
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          {/* Menu - hidden on mobile */}
          <ul className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <NavLinks />
          </ul>
        </div>

        {/* Mobile - dropdown menu when hamburger is open */}
        {menuOpen && (
          <ul
            className="absolute left-0 right-0 top-full z-20 border-b border-slate-200 bg-white px-4 py-3 shadow-lg md:hidden"
            role="list"
          >
            <NavLinks onNavigate={() => setMenuOpen(false)} />
          </ul>
        )}
      </nav>
      {children}
    </section>
  );
}

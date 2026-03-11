import Link from 'next/link';
import { DriftsmeldingBar } from './DriftsmeldingBar';

type CustomerSideProps = {
  children: React.ReactNode;
  /** Skjul driftsmelding-banneret (f.eks. på driftsstatus-siden der status vises i innholdet) */
  hideStatusBar?: boolean;
};

export function CustomerSide({ children, hideStatusBar }: CustomerSideProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white">
      {!hideStatusBar && <DriftsmeldingBar />}
      <nav className="border-b border-slate-200 px-6 py-4">
        <ul className="flex gap-6 text-sm font-medium text-slate-600">
          <li>
            <Link href="/" className="hover:text-slate-900">
              Hjem
            </Link>
          </li>
          <li>
            <a href="#" className="hover:text-slate-900">
              Tjenester
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-slate-900">
              Om oss
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-slate-900">
              Kontakt
            </a>
          </li>
          <li>
            <Link href="/driftsstatus" className="hover:text-slate-900">
              Driftstatus
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </section>
  );
}

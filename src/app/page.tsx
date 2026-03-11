import { AdminPanel } from '@/components/AdminPanel';
import { CustomerSide } from '@/components/CustomerSide';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-200 text-slate-900">
      <div className="mx-auto flex h-screen max-w-6xl items-stretch gap-0 px-4 py-6">
        <CustomerSide>
          {/* Hero */}
          <header className="px-6 py-8">
            <div className="mb-6 aspect-video w-full overflow-hidden rounded-xl bg-slate-200">
              <div
                className="flex h-full w-full items-center justify-center text-slate-500"
                aria-hidden
              >
                Hero-bilde
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-slate-900">
              Velkommen
            </h1>
            <p className="max-w-xl text-slate-600">
              Kort intro-tekst som beskriver tjenesten eller selskapet. Du kan
              erstatte dette med egen tekst når du har bestemt innhold.
            </p>
          </header>

          {/* Icons  */}
          <div className="grid grid-cols-2 gap-6 px-6 pb-8 sm:grid-cols-4">
            {[
              { label: 'Første' },
              { label: 'Andre' },
              { label: 'Tredje' },
              { label: 'Fjerde' },
            ].map(({ label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <span className="text-2xl" aria-hidden>
                    •
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700">{label}</span>
              </div>
            ))}
          </div>
        </CustomerSide>

        <AdminPanel />
      </div>
    </main>
  );
}

import { AdminPanel } from '@/components/AdminPanel';
import { CustomerSide } from '@/components/CustomerSide';
import { BellIcon, DatabaseIcon, NetworkIcon, PcIcon } from '@/components/FeatureIcons';
import Image from 'next/image';

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
                <Image
                  src="/images/hero.jpg"
                  alt="Hero-bilde"
                  width={1200}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-center text-slate-900">
              Velkommen til kontrollrommet
            </h1>
            <p className="max-w-md mx-auto text-center text-slate-600">
              Én enkel oversikt over driften, så du slipper å lure på om feilen er hos deg eller hos oss.
            </p>
          </header>

          {/* Ikoner / “features” */}
          <div className="grid grid-cols-2 gap-6 px-6 pb-8 sm:grid-cols-4">
            {[
              { label: 'Oppetid', Icon: PcIcon },
              { label: 'Nettverk', Icon: NetworkIcon },
              { label: 'Database', Icon: DatabaseIcon },
              { label: 'Varsler', Icon: BellIcon },
            ].map(({ label, Icon }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-2 text-center transition-transform duration-150 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 shadow-sm transition-transform duration-150 group-hover:scale-110 group-hover:shadow-md">
                  <Icon />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </CustomerSide>

        <AdminPanel />
      </div>
    </main>
  );
}

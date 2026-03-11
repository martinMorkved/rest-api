import { AdminPanel } from '@/components/AdminPanel';
import { CustomerSide } from '@/components/CustomerSide';
import { DriftsmeldingerContent } from '@/components/DriftsmeldingerContent';

export default function DriftsstatusPage() {
  return (
    <main className="min-h-screen bg-slate-200 text-slate-900">
      <div className="mx-auto flex h-screen max-w-6xl items-stretch gap-0 px-4 py-6">
        <CustomerSide hideStatusBar>
          <DriftsmeldingerContent />
        </CustomerSide>

        <AdminPanel />
      </div>
    </main>
  );
}

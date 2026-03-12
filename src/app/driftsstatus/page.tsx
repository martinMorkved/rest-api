import { AdminPanelWrapper } from '@/components/AdminPanelWrapper';
import { CustomerSide } from '@/components/CustomerSide';
import { DriftsmeldingerContent } from '@/components/DriftsmeldingerContent';

export default function DriftsstatusPage() {
  return (
    <main className="min-h-screen bg-slate-200 text-slate-900">
      <AdminPanelWrapper>
        <CustomerSide hideStatusBar>
          <DriftsmeldingerContent />
        </CustomerSide>
      </AdminPanelWrapper>
    </main>
  );
}

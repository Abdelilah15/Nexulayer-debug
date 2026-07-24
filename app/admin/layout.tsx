import { Web3Provider } from '@/components/admin/Web3Provider';
import AdminTopbar from '@/components/admin/AdminTopbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-neutral-950 flex flex-col font-sans">
        <AdminTopbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </Web3Provider>
  );
}

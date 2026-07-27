import AdminTopbar from '@/components/admin/AdminTopbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col font-sans">
      <AdminTopbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

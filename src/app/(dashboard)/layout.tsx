import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden relative">
      <Sidebar />
      <main className="flex-1 md:ml-[240px] overflow-y-auto scrollbar-hide">
        <div className="container mx-auto px-4 md:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

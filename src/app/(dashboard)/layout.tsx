import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#09090B] text-white overflow-hidden relative selection:bg-accent/30 selection:text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-hide md:pl-[90px] lg:pl-[260px] transition-[padding] duration-500 pt-16 md:pt-0">
        <div className="mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

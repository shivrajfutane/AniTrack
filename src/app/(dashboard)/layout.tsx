import { Sidebar } from "@/components/sidebar";
import { PageTransition } from "@/components/animations/PageTransition";
import { DashboardWrapper } from "./dashboard-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#09090B] text-white overflow-hidden relative selection:bg-accent/30 selection:text-white">
      <Sidebar />
      <DashboardWrapper>
        <PageTransition>
          {children}
        </PageTransition>
      </DashboardWrapper>
    </div>
  );
}

'use client'

import { useUiStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarExpanded } = useUiStore()

  return (
    <main className={cn(
      "flex-1 overflow-y-auto scrollbar-hide transition-all duration-500 pt-[64px] md:pt-0 relative w-full z-0",
      sidebarExpanded ? "md:pl-[260px]" : "md:pl-[72px]"
    )}>
      <div className="mx-auto min-h-full w-full">
        {children}
      </div>
    </main>
  );
}

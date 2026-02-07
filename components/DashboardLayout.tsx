"use client";

import { Sidebar, MobileNav } from "@/components/Sidebar";
import { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="container mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

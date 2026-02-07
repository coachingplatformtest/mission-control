"use client";

import { Sidebar } from "@/components/Sidebar";
import { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

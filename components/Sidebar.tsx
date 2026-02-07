"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity, Calendar, Search, Home } from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    label: "Activity Feed",
    icon: Activity,
    href: "/activity",
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/calendar",
  },
  {
    label: "Search",
    icon: Search,
    href: "/search",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-bold">Mission Control</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === route.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">System Active</span>
        </div>
      </div>
    </div>
  );
}

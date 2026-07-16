// @ts-nocheck
"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8F6F3" }}>
      <Sidebar isCollapsed={isSidebarCollapsed} onCollapse={setIsSidebarCollapsed} />
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        <Topbar />
        <main className="p-6 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

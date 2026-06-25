"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui";

export default function DashboardTopbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu size={20} />
        </Button>
        <h1 className="text-lg font-semibold text-ink">Tableau de bord</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        <div className="h-8 w-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-semibold">
          JD
        </div>
      </div>
    </header>
  );
}

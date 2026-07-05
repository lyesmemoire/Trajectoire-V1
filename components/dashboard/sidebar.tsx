"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Target,
  Zap,
  Download,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Vue d'ensemble", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Mes CV", href: "/dashboard/cvs", icon: <FileText className="w-5 h-5" /> },
  { label: "Analyse ATS", href: "/dashboard/ats", icon: <Target className="w-5 h-5" /> },
  { label: "Optimisation", href: "/dashboard/optimize", icon: <Zap className="w-5 h-5" /> },
  { label: "Export PDF", href: "/dashboard/export", icon: <Download className="w-5 h-5" /> },
  { label: "Abonnement", href: "/dashboard/billing", icon: <CreditCard className="w-5 h-5" /> },
  { label: "Paramètres", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-surface border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-20" : "w-72",
          "lg:static lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-soft">
                T
              </div>
              <span className="font-semibold text-xl tracking-tight">
                Trajectoire
              </span>
            </Link>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-soft mx-auto">
              T
            </div>
          )}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-text-secondary hover:text-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary hover:bg-gray-100 hover:text-text",
                  isCollapsed && "justify-center"
                )}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-gray-100 transition-colors lg:flex"
          >
            <Menu className="w-5 h-5" />
            {!isCollapsed && <span className="hidden lg:inline">Réduire</span>}
          </button>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-gray-100 hover:text-error transition-colors",
                isCollapsed && "justify-center"
              )}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Déconnexion</span>}
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-premium flex items-center justify-center"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}

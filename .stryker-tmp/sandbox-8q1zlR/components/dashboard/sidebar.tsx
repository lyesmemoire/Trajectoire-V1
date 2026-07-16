// @ts-nocheck
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

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed: externalCollapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(externalCollapsed || false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (externalCollapsed !== undefined) {
      setIsCollapsed(externalCollapsed);
    }
  }, [externalCollapsed]);

  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapse?.(collapsed);
  };

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
          "fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200/60 transition-all duration-300 ease-in-out shadow-sm",
          isCollapsed ? "w-20" : "w-72",
          "lg:static lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200/60">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                T
              </div>
              <span className="font-serif text-xl font-semibold text-gray-900 tracking-tight group-hover:opacity-80 transition-opacity duration-200">
                Trajectoire
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/dashboard" className="block">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-lg shadow-sm mx-auto hover:shadow-md transition-shadow duration-200">
                T
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
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
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  isCollapsed && "justify-center"
                )}
              >
                <div className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"
                )}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => handleCollapse(!isCollapsed)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 lg:flex"
          >
            <Menu className="w-5 h-5" />
            {!isCollapsed && <span className="hidden lg:inline">Réduire</span>}
          </button>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200",
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

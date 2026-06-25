"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Settings, User, LogOut, X, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: Home },
  { href: "/dashboard/progression", label: "Progression", icon: BarChart3 },
  { href: "/dashboard/profile", label: "Profil", icon: User },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-brand-primary text-white p-3 rounded-full shadow-lg hover:bg-brand-primary-hover transition-colors"
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-border transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo & Close */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <Link href="/" className="text-xl font-bold text-ink">
              Trajectoire
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 text-ink hover:bg-surface-muted rounded-lg"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-border p-4">
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

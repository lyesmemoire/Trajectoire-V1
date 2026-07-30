"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Overview", exact: true },
  { href: "/dashboard/ats", icon: "📄", label: "Analyse ATS" },
  { href: "/dashboard/interview", icon: "🎙️", label: "Interview Lab" },
  { href: "/dashboard/optimize", icon: "✨", label: "Optimiser" },
  { href: "/dashboard/upload", icon: "📁", label: "Upload" },
  { href: "/dashboard/progress", icon: "📈", label: "Progression" },
];

const secondaryItems = [
  { href: "/dashboard/credits", icon: "💳", label: "Crédits" },
];

export function DashboardLayout({ children }: _DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200">
        <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
          {/* Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 lg:hidden"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-sm">
                ✦
              </div>
              <span className="font-black tracking-tight hidden sm:block">
                AI Career Copilot
              </span>
            </Link>
          </div>

          {/* Nav - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold text-sm transition-colors",
                  isActive(item.href, item.exact)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-700 font-bold">2</span>
              <span className="text-sm text-slate-600 hidden sm:inline">
                crédits
              </span>
            </div>

            <Link
              href="/dashboard/credits"
              className="hidden sm:block px-4 py-2 bg-violet-600 text-white font-bold rounded-full text-sm hover:bg-violet-700 transition-colors"
            >
              Acheter
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm">
                JD
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity",
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
        <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-4 transform transition-transform">
          <div className="flex items-center justify-between mb-6">
            <span className="font-bold text-lg text-slate-900">Menu</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors",
                  isActive(item.href, item.exact)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            <div className="my-4 border-t border-slate-200" />

            {secondaryItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors",
                  isActive(item.href)
                    ? "bg-violet-50 text-violet-600"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            <div className="my-4 border-t border-slate-200" />

            <Link
              href="/auth/login"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <span className="text-xl">🚪</span>
              Déconnexion
            </Link>
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <main className="p-4 lg:p-6">{children}</main>
    </div>
  );
}

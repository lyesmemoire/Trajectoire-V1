"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const marketingNav = [
    { href: "/features", label: "Fonctionnalités" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/testimonials", label: "Témoignages" },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-ink-900/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ink-700 to-ink-900 flex items-center justify-center text-white font-black shadow-lg shadow-ink-500/25">
              ✦
            </div>
            <span className="font-black text-xl tracking-tight">
              AI Career Copilot
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-bold text-sm transition-colors",
                  pathname === item.href
                    ? "text-ink-900"
                    : "text-ink-600 hover:text-ink-900",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="hidden sm:block text-sm font-bold text-ink-600 hover:text-ink-900"
            >
              Connexion
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2.5 bg-gradient-to-r from-ink-700 to-ink-900 text-white font-bold rounded-full text-sm shadow-lg shadow-ink-500/25 hover:shadow-xl transition-all"
            >
              Essai gratuit →
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-ivoire-200 py-12 bg-ivoire-50 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ink-700 to-ink-900 flex items-center justify-center text-white font-black">
                ✦
              </div>
              <span className="font-black text-xl tracking-tight">
                AI Career Copilot
              </span>
            </Link>

            <div className="flex items-center gap-8 text-sm font-semibold text-ink-600">
              <Link href="/features">Fonctionnalités</Link>
              <Link href="/pricing">Tarifs</Link>
              <Link href="/privacy">Confidentialité</Link>
              <Link href="/terms">Conditions</Link>
            </div>

            <div className="text-sm text-ink-400">
              © 2026 AI Career Copilot
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

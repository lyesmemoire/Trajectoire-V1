"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Mic, History, FileText, CreditCard, Settings, LogOut } from "lucide-react"

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Simulation", href: "/simulation/new", icon: Mic },
  { label: "Historique", href: "/history", icon: History },
  { label: "Analyse CV", href: "/cv", icon: FileText },
  { label: "Abonnements", href: "/billing", icon: CreditCard },
  { label: "Paramètres", href: "/settings", icon: Settings },
]

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(href + "/")
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-[73px] hidden h-[calc(100dvh-73px)] w-[272px] shrink-0 lg:block">
      <div className="flex h-full flex-col rounded-3xl border border-ivoire-200 bg-white/80 p-3 shadow-premium backdrop-blur">
        <div className="px-3 py-3">
          <p className="font-serif text-lg font-bold tracking-tight text-ink-900">Trajectoire</p>
          <p className="text-xs text-ink-500">Espace personnel</p>
        </div>

        <nav className="mt-2 space-y-1 px-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-ink-900 text-white shadow-sm" : "text-ink-700 hover:bg-ivoire-50",
                ].join(" ")}
              >
                <Icon className="size-4.5 opacity-90" aria-hidden="true" />
                <span className="font-medium">{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto px-1 pt-3">
          <Link
            href="/logout"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-ivoire-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink-900 shadow-sm transition hover:bg-ivoire-50"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Déconnexion
          </Link>
        </div>
      </div>
    </aside>
  )
}

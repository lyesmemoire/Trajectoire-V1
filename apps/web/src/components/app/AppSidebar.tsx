"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Mic2,
  Radar,
  Settings,
  Sparkles,
  Target,
  BriefcaseBusiness,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Aperçu", href: "/dashboard", icon: LayoutDashboard },
  { label: "Opportunités", href: "/opportunities", icon: BriefcaseBusiness },
  { label: "Discovery", href: "/discovery", icon: Radar },
  { label: "Simulation", href: "/simulation/new", icon: Mic2 },
  { label: "Historique", href: "/history", icon: History },
  { label: "Analyse CV", href: "/analyze", icon: FileText },
  { label: "Progression", href: "/knowledge", icon: BarChart3 },
]

const SECONDARY_NAV = [
  { label: "Abonnement", href: "/pricing", icon: CreditCard },
  { label: "Paramètres", href: "/settings", icon: Settings },
]

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-dvh w-[240px] shrink-0 lg:flex flex-col">
      <div className="flex h-full flex-col bg-white border-r border-border/60">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-4">
          <Link href="/dashboard" className="group flex items-center gap-2.5 min-w-0">
            <div className="grid size-[30px] shrink-0 place-items-center rounded-lg bg-primary text-white shadow-sm">
              <Target className="size-[15px]" strokeWidth={2} />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-foreground truncate">
              Trajectoire
            </span>
          </Link>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-5">

          {/* Section Principale */}
          <div>
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-muted/50 select-none">
              Personnel
            </p>
            <div className="space-y-0.5">
              {NAV.map(({ label, href, icon: Icon }) => {
                const active = isActive(pathname, href)
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg h-9 px-2.5 text-[13px] transition-all duration-150",
                      active
                        ? "bg-primary-50 text-primary font-semibold"
                        : "text-foreground-muted font-medium hover:bg-slate-50 hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[17px] shrink-0 transition-colors duration-150",
                        active ? "text-primary" : "text-foreground-muted/60"
                      )}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    <span className="truncate">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Section Système */}
          <div>
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-muted/50 select-none">
              Système
            </p>
            <div className="space-y-0.5">
              {SECONDARY_NAV.map(({ label, href, icon: Icon }) => {
                const active = isActive(pathname, href)
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg h-9 px-2.5 text-[13px] transition-all duration-150",
                      active
                        ? "bg-primary-50 text-primary font-semibold"
                        : "text-foreground-muted font-medium hover:bg-slate-50 hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[17px] shrink-0 transition-colors duration-150",
                        active ? "text-primary" : "text-foreground-muted/60"
                      )}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    <span className="truncate">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* ── Bottom ── */}
        <div className="border-t border-border/60 px-3 py-3 space-y-0.5">
          {/* Trajectoire AI shortcut */}
          <Link
            href="/simulation/new"
            className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-slate-50 transition-colors duration-150"
          >
            <div className="grid size-7 shrink-0 place-items-center rounded-md bg-primary-50">
              <Sparkles className="size-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Trajectoire AI</p>
              <p className="text-[10px] text-foreground-muted truncate">Simulation · Analyse</p>
            </div>
          </Link>

          {/* Logout */}
          <Link
            href="/logout"
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-foreground-muted/60 transition-colors hover:bg-slate-50 hover:text-foreground"
          >
            <LogOut className="size-[14px] shrink-0" />
            Se déconnecter
          </Link>
        </div>
      </div>
    </aside>
  )
}
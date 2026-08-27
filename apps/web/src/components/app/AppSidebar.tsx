"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ChevronRight,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Mic2,
  Settings,
  Sparkles,
  Target,
} from "lucide-react"

const NAV = [
  {
    label: "Vue d’ensemble",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Simulation IA",
    href: "/simulation/new",
    icon: Mic2,
  },
  {
    label: "Historique",
    href: "/history",
    icon: History,
  },
  {
    label: "Analyse CV",
    href: "/analyze",
    icon: FileText,
  },
  {
    label: "Progression",
    href: "/knowledge",
    icon: BarChart3,
  },
]

const SECONDARY_NAV = [
  {
    label: "Abonnement",
    href: "/pricing",
    icon: CreditCard,
  },
  {
    label: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
]

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-[93px] hidden h-[calc(100dvh-113px)] w-[252px] shrink-0 lg:block">
      <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_20px_55px_rgba(63,46,107,0.08)] backdrop-blur-xl">
        <div className="px-5 pb-4 pt-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20">
              <Target className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold tracking-tight text-slate-950">
                Trajectoire
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                Career intelligence
              </p>
            </div>
          </Link>
        </div>

        <div className="mx-4 h-px bg-slate-100" />

        <nav className="flex-1 px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Espace personnel
          </p>

          <div className="space-y-1">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href)

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-semibold transition-all",
                    active
                      ? "bg-violet-50 text-violet-700 shadow-sm ring-1 ring-violet-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid size-8 place-items-center rounded-xl transition",
                      active
                        ? "bg-white text-violet-600 shadow-sm"
                        : "text-slate-400 group-hover:bg-white group-hover:text-slate-700",
                    ].join(" ")}
                  >
                    <Icon className="size-4" />
                  </span>

                  <span className="flex-1 truncate">{label}</span>

                  {active ? (
                    <ChevronRight className="size-3.5 text-violet-400" />
                  ) : null}
                </Link>
              )
            })}
          </div>

          <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Compte
          </p>

          <div className="space-y-1">
            {SECONDARY_NAV.map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href)

              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-semibold transition-all",
                    active
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                  ].join(" ")}
                >
                  <span className="grid size-8 place-items-center rounded-xl text-slate-400 group-hover:bg-white group-hover:text-slate-700">
                    <Icon className="size-4" />
                  </span>

                  {label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-3">
          <div className="mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 p-4 text-white shadow-lg shadow-violet-500/10">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <p className="text-xs font-bold">
                Trajectoire AI
              </p>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-white/75">
              Transformez chaque analyse en prochaine action concrète.
            </p>

            <Link
              href="/simulation/new"
              className="mt-3 inline-flex items-center text-[11px] font-bold text-white"
            >
              Lancer une simulation
              <ChevronRight className="ml-1 size-3" />
            </Link>
          </div>

          <Link
            href="/logout"
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="grid size-8 place-items-center">
              <LogOut className="size-4" />
            </span>

            Déconnexion
          </Link>
        </div>
      </div>
    </aside>
  )
}
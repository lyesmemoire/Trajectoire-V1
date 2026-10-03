"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
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
  Telescope,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type NavItem = { label: string; href: string; icon: LucideIcon }

export const NAV: NavItem[] = [
  { label: "Aperçu", href: "/dashboard", icon: LayoutDashboard },
  { label: "Opportunités", href: "/opportunities", icon: BriefcaseBusiness },
  { label: "Radar d'offres", href: "/radar", icon: Telescope },
  { label: "Discovery", href: "/discovery", icon: Radar },
  { label: "Simulation", href: "/simulation/new", icon: Mic2 },
  { label: "Historique", href: "/history", icon: History },
  { label: "Analyse CV", href: "/analyze", icon: FileText },
  { label: "Mes CV", href: "/cv", icon: FileText },
  { label: "Progression", href: "/knowledge", icon: BarChart3 },
]

export const SECONDARY_NAV: NavItem[] = [
  { label: "Abonnement", href: "/pricing", icon: CreditCard },
  { label: "Paramètres", href: "/settings", icon: Settings },
]

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"

export function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavGroup({
  title,
  items,
  pathname,
}: {
  title: string
  items: NavItem[]
  pathname: string
}) {
  return (
    <div>
      <p className="mb-1.5 select-none px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-calm-tertiary">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors duration-150",
                focusRing,
                active
                  ? "text-calm-ink"
                  : "text-calm-secondary hover:bg-calm-accent-wash hover:text-calm-ink",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="app-sidebar-active"
                  aria-hidden
                  className="absolute inset-0 rounded-lg bg-calm-accent-wash ring-1 ring-inset ring-calm-line"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              ) : null}
              {active ? (
                <span
                  aria-hidden
                  className="absolute -left-3 top-2 h-5 w-[3px] rounded-r-full bg-calm-accent"
                />
              ) : null}
              <Icon
                className={cn(
                  "relative size-[17px] shrink-0 transition-colors duration-150",
                  active ? "text-calm-accent" : "text-calm-tertiary",
                )}
                strokeWidth={2}
              />
              <span className="relative truncate">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-dvh w-[240px] shrink-0 flex-col lg:flex">
      <div className="flex h-full flex-col border-r border-calm-line bg-calm-bg">
        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
          <Link
            href="/dashboard"
            className={cn(
              "group flex min-w-0 items-center gap-2.5 rounded-lg",
              focusRing,
            )}
          >
            <div className="grid size-[30px] shrink-0 place-items-center rounded-lg bg-calm-accent text-white shadow-[0_0_0_1px_rgba(241,247,243,0.1)_inset,0_6px_18px_-6px_rgba(31,42,55,0.7)]">
              <Target className="size-[15px]" strokeWidth={2} />
            </div>
            <span className="truncate text-[15px] font-semibold tracking-tight text-calm-ink">
              Trajectoire
            </span>
          </Link>
        </div>

        {/* ── Navigation ── */}
        <nav
          aria-label="Navigation principale"
          className="flex-1 space-y-5 overflow-y-auto px-3 py-1"
        >
          <NavGroup title="Personnel" items={NAV} pathname={pathname} />
          <NavGroup title="Système" items={SECONDARY_NAV} pathname={pathname} />
        </nav>

        {/* ── Bottom ── */}
        <div className="space-y-0.5 border-t border-calm-line px-3 py-3">
          <Link
            href="/simulation/new"
            className={cn(
              "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-150 hover:bg-calm-accent-wash",
              focusRing,
            )}
          >
            <div className="grid size-7 shrink-0 place-items-center rounded-md bg-calm-accent-soft ring-1 ring-inset ring-calm-accent-line">
              <Sparkles className="size-3.5 text-calm-accent" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-calm-ink">
                Trajectoire AI
              </p>
              <p className="truncate text-[10px] text-calm-tertiary">
                Simulation · Analyse
              </p>
            </div>
          </Link>

          <Link
            href="/logout"
            className={cn(
              "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-calm-tertiary transition-colors hover:bg-calm-accent-wash hover:text-calm-ink",
              focusRing,
            )}
          >
            <LogOut className="size-[14px] shrink-0" />
            Se déconnecter
          </Link>
        </div>
      </div>
    </aside>
  )
}

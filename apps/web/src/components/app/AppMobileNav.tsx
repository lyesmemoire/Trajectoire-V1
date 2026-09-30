"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, Target, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { NAV, SECONDARY_NAV, isActive, type NavItem } from "@/components/app/AppSidebar"

/**
 * Navigation de l'espace connecté sous 1024 px : la barre latérale (AppSidebar) n'est affichée
 * qu'à partir de `lg`. En-tête fixe avec bouton menu + tiroir.
 *
 * Accessibilité : bouton `aria-expanded`/`aria-controls`, tiroir `role="dialog"` modal, Échap ferme,
 * le focus entre dans le tiroir à l'ouverture, y reste (Tab cyclique) et revient au bouton à la fermeture.
 */

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"

function NavLinks({ title, items, pathname }: { title: string; items: NavItem[]; pathname: string }) {
  return (
    <div>
      <p className="mb-1.5 px-3 text-xs font-medium uppercase tracking-[0.14em] text-white/60">{title}</p>
      <ul className="space-y-0.5">
        {items.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                  active ? "bg-white/[0.08] text-white" : "text-white/75 hover:bg-white/[0.05] hover:text-white",
                  focusRing,
                )}
              >
                <Icon className="size-[18px] shrink-0" aria-hidden />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function AppMobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    buttonRef.current?.focus()
  }, [])

  // Fermer à chaque changement de page.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Tiroir ouvert : focus dans le tiroir, Échap, Tab cyclique, pas de défilement de la page derrière.
  useEffect(() => {
    if (!open) return
    const drawer = drawerRef.current
    const focusable = () =>
      Array.from(drawer?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])
    focusable()[0]?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== "Tab") return
      const items = focusable()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close])

  return (
    <div className="lg:hidden">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.06] bg-zinc-950/95 px-4 backdrop-blur">
        <Link href="/dashboard" className={cn("flex items-center gap-2.5 rounded-lg", focusRing)}>
          <span className="grid size-[30px] place-items-center rounded-lg bg-indigo-500 text-white">
            <Target className="size-[15px]" strokeWidth={2} aria-hidden />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white/90">Trajectoire</span>
        </Link>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          aria-controls="app-mobile-drawer"
          className={cn(
            "grid size-11 place-items-center rounded-lg text-white/80 transition-colors hover:bg-white/[0.06]",
            focusRing,
          )}
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Fermer le menu"
            onClick={close}
            className="absolute inset-0 bg-black/60"
          />
          <div
            id="app-mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation principale"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r border-white/[0.08] bg-zinc-950 pb-[env(safe-area-inset-bottom)]"
          >
            <div className="flex h-14 shrink-0 items-center justify-between px-4">
              <span className="text-[15px] font-semibold tracking-tight text-white/90">Menu</span>
              <button
                type="button"
                onClick={close}
                aria-label="Fermer le menu"
                className={cn(
                  "grid size-11 place-items-center rounded-lg text-white/80 transition-colors hover:bg-white/[0.06]",
                  focusRing,
                )}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <nav aria-label="Navigation principale" className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
              <NavLinks title="Personnel" items={NAV} pathname={pathname} />
              <NavLinks title="Système" items={SECONDARY_NAV} pathname={pathname} />
            </nav>
            <div className="border-t border-white/[0.06] px-3 py-3">
              <Link
                href="/logout"
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.05] hover:text-white",
                  focusRing,
                )}
              >
                <LogOut className="size-[18px] shrink-0" aria-hidden />
                Se déconnecter
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

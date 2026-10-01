"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Logo } from "./Logo"
import { NAV_LINKS } from "./content"

const link =
  "inline-flex min-h-11 items-center rounded-[14px] px-3 text-sm font-medium text-calm-secondary transition-colors hover:text-calm-ink"

/** En-tête de la homepage. Client uniquement pour le menu mobile (sous 760 px). */
export function HomeHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-calm-line bg-calm-surface">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-5">
        <Logo />

        <nav aria-label="Navigation principale" className="flex items-center gap-1 max-[759px]:hidden">
          {NAV_LINKS.map((item) => (
            <a key={item.href} href={item.href} className={link}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className={`${link} max-[759px]:hidden`}>
            Connexion
          </Link>
          <a
            href="#diagnostic"
            className="tap-target inline-flex items-center justify-center rounded-full bg-calm-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-calm-accent-deep"
          >
            Diagnostic gratuit
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
            className="tap-target inline-flex size-11 items-center justify-center rounded-[14px] text-calm-ink transition-colors hover:bg-calm-accent-wash min-[760px]:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Menu"
          className="border-t border-calm-line bg-calm-surface px-5 py-2 min-[760px]:hidden"
        >
          <ul>
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className={`${link} w-full`}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/login" className={`${link} w-full`}>
                Connexion
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

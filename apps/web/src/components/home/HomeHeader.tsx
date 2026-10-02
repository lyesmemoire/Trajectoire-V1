"use client"

import { useState } from "react"
import Link from "next/link"
import { Logo } from "./Logo"
import { NAV_LINKS } from "./content"

const link =
  "inline-flex min-h-11 items-center text-sm text-calm-ink no-underline transition-colors hover:text-calm-accent"

/** En-tête de la homepage. Client uniquement pour le menu déplié sous 700 px. */
export function HomeHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="home-wrap border-b border-calm-line">
      <div className="flex min-h-20 items-center justify-between gap-4">
        <Logo />

        <div className="flex items-center gap-[30px] text-sm max-[700px]:gap-2">
          <nav aria-label="Navigation principale" className="flex items-center gap-[30px] max-[700px]:hidden">
            {NAV_LINKS.map((item) => (
              <a key={item.href} href={item.href} className={link}>
                {item.label}
              </a>
            ))}
          </nav>
          <Link href="/login" className={`${link} max-[700px]:hidden`}>
            Connexion
          </Link>
          <a
            href="#diagnostic"
            className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[4px] bg-calm-accent px-[18px] text-sm font-semibold text-white no-underline transition-colors hover:bg-calm-accent-deep max-[700px]:px-3 max-[700px]:text-[13px]"
          >
            Diagnostic gratuit
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className="hidden min-h-11 items-center rounded-[4px] border border-calm-line bg-transparent px-3 text-[13px] font-bold text-calm-ink max-[700px]:inline-flex"
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Menu" className="border-t border-calm-line py-2 min-[701px]:hidden">
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

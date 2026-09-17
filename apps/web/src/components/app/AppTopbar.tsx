import { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AppTopbarProps {
  /** Petit label au-dessus du titre (optionnel) */
  eyebrow?: string
  title: string
  subtitle?: string
  /** Éléments d'action alignés à droite */
  actions?: ReactNode
  /** Affiche un border-bottom — par défaut true */
  border?: boolean
  className?: string
}

export function AppTopbar({
  eyebrow,
  title,
  subtitle,
  actions,
  border = true,
  className,
}: AppTopbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-5 sm:flex-row sm:items-end sm:justify-between",
        border && "border-b border-border/60",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground-muted/70">
            {eyebrow}
          </p>
        )}
        <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}

// ── Boutons d'action standards pour AppTopbar ──────────────────────────────

/** CTA principal violet — utilisé dans les page headers */
export function TopbarPrimary({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 active:scale-[0.98]"
    >
      {children}
    </Link>
  )
}

/** CTA secondaire neutre */
export function TopbarSecondary({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-slate-50"
    >
      {children}
    </Link>
  )
}

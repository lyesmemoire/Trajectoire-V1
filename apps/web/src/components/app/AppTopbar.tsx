import Link from "next/link"
import { Crown, Play } from "lucide-react"

export function AppTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-4 border-b border-ivoire-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-ink-600">{subtitle}</p> : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-ivoire-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 shadow-sm transition hover:bg-ivoire-50"
        >
          <Crown className="size-4" aria-hidden="true" />
          Passer Premium
        </Link>

        <Link
          href="/simulation/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-premium-lg ring-1 ring-bronze-400/35 transition hover:-translate-y-[1px] hover:ring-bronze-400/60"
        >
          <Play className="size-4" aria-hidden="true" />
          Démarrer un entretien
        </Link>
      </div>
    </div>
  )
}

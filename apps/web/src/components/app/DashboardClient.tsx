"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AppTopbar } from "@/components/app/AppTopbar"
import { KpiCard } from "@/components/app/KpiCard"
import { Clock3, Mic, Trophy, TrendingUp } from "lucide-react"

type DashboardData = {
  sessionsTotal: number
  avgScore: number | null
  totalTimeMin: number
  badgesUnlocked: number
  badgesTotal: number
}

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/app/dashboard", { credentials: "same-origin" })
        const json = (await res.json()) as any
        if (!res.ok) throw new Error(json?.error || "Erreur chargement dashboard")
        if (!cancelled) setData(json)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <AppTopbar title="Tableau de bord" subtitle="Vue d’ensemble & progression" />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Sessions totales" value={loading ? "…" : String(data?.sessionsTotal ?? 0)} icon={<Mic className="size-5" />} />
        <KpiCard label="Score moyen" value={loading ? "…" : `${data?.avgScore ?? 0}%`} icon={<TrendingUp className="size-5" />} />
        <KpiCard label="Temps total" value={loading ? "…" : `${data?.totalTimeMin ?? 0}m`} icon={<Clock3 className="size-5" />} />
        <KpiCard label="Badges" value={loading ? "…" : `${data?.badgesUnlocked ?? 0}/${data?.badgesTotal ?? 0}`} icon={<Trophy className="size-5" />} tone="bronze" />
      </div>

      <section className="rounded-3xl border border-ivoire-200 bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white shadow-premium-lg ring-1 ring-bronze-400/25">
        <h2 className="font-serif text-2xl font-bold tracking-tight">Démarrer une simulation</h2>
        <p className="mt-2 max-w-[62ch] text-sm text-white/80">
          Lancez un entretien guidé, obtenez un feedback instantané et suivez votre progression.
        </p>
        <div className="mt-5">
          <Link
            href="/simulation/new"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 shadow-sm transition hover:-translate-y-[1px]"
          >
            Démarrer maintenant
          </Link>
        </div>
      </section>
    </div>
  )
}

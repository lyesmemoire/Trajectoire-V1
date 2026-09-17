"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AppTopbar, TopbarPrimary } from "@/components/app/AppTopbar"
import { KpiCard } from "@/components/app/KpiCard"
import { Clock3, Mic, Play, Trophy, TrendingUp } from "lucide-react"

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
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-6">
      <AppTopbar
        title="Tableau de bord"
        subtitle="Vue d'ensemble & progression"
        actions={
          <TopbarPrimary href="/simulation/new">
            <Play className="size-4" />
            Démarrer un entretien
          </TopbarPrimary>
        }
      />

      {error ? (
        <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Sessions totales" value={loading ? "…" : String(data?.sessionsTotal ?? 0)} icon={<Mic className="size-5" />} />
        <KpiCard label="Score moyen" value={loading ? "…" : `${data?.avgScore ?? 0}%`} icon={<TrendingUp className="size-5" />} />
        <KpiCard label="Temps total" value={loading ? "…" : `${data?.totalTimeMin ?? 0}m`} icon={<Clock3 className="size-5" />} />
        <KpiCard label="Badges" value={loading ? "…" : `${data?.badgesUnlocked ?? 0}/${data?.badgesTotal ?? 0}`} icon={<Trophy className="size-5" />} tone="bronze" />
      </div>

      {/* Simulation CTA card */}
      <section className="rounded-xl border border-foreground/10 bg-foreground p-6 text-white shadow-sm">
        <h2 className="font-sans text-xl font-semibold tracking-tight">
          Démarrer une simulation
        </h2>
        <p className="mt-2 max-w-[62ch] text-sm text-white/75">
          Lancez un entretien guidé, obtenez un feedback instantané et suivez votre progression.
        </p>
        <div className="mt-5">
          <Link
            href="/simulation/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-px hover:shadow-md active:scale-[0.98]"
          >
            <Play className="size-4 text-primary" />
            Démarrer maintenant
          </Link>
        </div>
      </section>
    </div>
  )
}

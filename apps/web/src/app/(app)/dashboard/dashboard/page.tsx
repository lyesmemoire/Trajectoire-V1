import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AppTopbar } from "@/components/app/AppTopbar"
import { KpiCard } from "@/components/app/KpiCard"
import { Clock3, Mic, Trophy, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const h = await headers()
  const userId = h.get("x-user-id")

  if (!userId) {
    redirect("/login?redirect=/dashboard&reason=Authentication+required")
  }

  const stats = {
    sessions: "0",
    avgScore: "0%",
    totalTime: "0m",
    badges: "0/4",
  }

  return (
    <div className="space-y-6">
      <AppTopbar title="Tableau de bord" subtitle="Bienvenue 👋" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Sessions totales" value={stats.sessions} icon={<Mic className="size-5" />} />
        <KpiCard label="Score moyen" value={stats.avgScore} icon={<TrendingUp className="size-5" />} />
        <KpiCard label="Temps total" value={stats.totalTime} icon={<Clock3 className="size-5" />} />
        <KpiCard label="Badges" value={stats.badges} icon={<Trophy className="size-5" />} tone="bronze" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-ivoire-200 bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white shadow-premium-lg ring-1 ring-bronze-400/25">
            <h2 className="font-serif text-2xl font-bold tracking-tight">
              Commencez votre prochaine simulation
            </h2>
            <p className="mt-2 max-w-[62ch] text-sm text-white/80">
              Préparez-vous efficacement : l’IA s’adapte à votre profil et vous donne un feedback immédiat.
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

          <section className="rounded-3xl border border-ivoire-200 bg-white/85 p-6 shadow-premium backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold text-ink-900">Sessions récentes</h3>
              <Link
                href="/history"
                className="text-sm font-semibold text-ink-900 underline underline-offset-4 hover:text-ink-700"
              >
                Voir tout
              </Link>
            </div>

            <div className="mt-8 grid place-items-center rounded-2xl border border-dashed border-ivoire-200 bg-ivoire-50 px-6 py-14 text-center">
              <Mic className="size-8 text-ink-400" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-ink-900">Aucune session</p>
              <p className="mt-1 text-sm text-ink-600">Commencez votre première simulation !</p>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-ivoire-200 bg-white/85 p-6 shadow-premium backdrop-blur">
            <h3 className="text-sm font-semibold text-ink-900">Progression</h3>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-ink-600">
                  <span>Objectif mensuel</span>
                  <span className="font-medium text-ink-900">0/20</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-ivoire-100">
                  <div className="h-2 w-[0%] rounded-full bg-ink-900" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-ink-600">
                  <span>Score moyen cible</span>
                  <span className="font-medium text-ink-900">0/85</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-ivoire-100">
                  <div className="h-2 w-[0%] rounded-full bg-bronze-500" />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-ivoire-200 bg-white/85 p-6 shadow-premium backdrop-blur">
            <h3 className="text-sm font-semibold text-ink-900">Badges</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {["Premier entretien", "Semaine productive", "Score excellent", "Régularité"].map((label) => (
                <div key={label} className="rounded-2xl border border-ivoire-200 bg-white px-3 py-4 text-center">
                  <Trophy className="mx-auto size-5 text-ink-400" aria-hidden="true" />
                  <p className="mt-2 text-xs font-medium text-ink-700">{label}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
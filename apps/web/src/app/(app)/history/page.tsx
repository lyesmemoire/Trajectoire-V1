import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { StatsOverview } from "@/components/dashboard/StatsOverview"

export const metadata: Metadata = {
  title: "Historique – Trajectoire",
  description: "Consultez votre historique de simulations.",
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  return `${minutes} min`
}

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: sessions } = await supabase
    .from("interview_sessions")
    .select(`
      *,
      reports (
        id,
        overall_score
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const totalSimulations = sessions?.length || 0
  const totalDuration = sessions?.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) || 0
  const allReports = sessions?.map(s => s.reports).filter(r => r !== null).flat() || []
  const averageScore = allReports.length > 0
    ? allReports.reduce((sum, report) => sum + (report.overall_score || 0), 0) / allReports.length
    : 0
  const bestScore = allReports.length > 0
    ? Math.max(...allReports.map(r => r.overall_score || 0))
    : 0
  const confidenceScore = averageScore / 100
  const currentStreak = 0

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-50 mb-4 transition-colors"
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-sans font-bold text-zinc-50 mb-2">
          Historique des simulations
        </h1>
        <p className="text-zinc-400">Consultez toutes vos simulations et leurs rapports.</p>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="bg-gradient-to-br from-indigo-500/[0.12] via-indigo-500/[0.03] to-transparent p-8 rounded-2xl border border-indigo-400/20 text-center">
          <h3 className="text-xl font-sans font-semibold text-zinc-50 mb-2">Aucune simulation</h3>
          <p className="text-zinc-400 mb-6">Vous n&apos;avez pas encore réalisé de simulation.</p>
          <Link href="/simulation/new">
            <Button variant="dark" size="md">
              Commencer ma première simulation
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="mb-6">
            <StatsOverview
              totalSimulations={totalSimulations}
              totalDuration={totalDuration}
              averageScore={averageScore}
              bestScore={bestScore}
              currentStreak={currentStreak}
              confidenceScore={confidenceScore}
            />
          </div>

          {/* History Table */}
          <div className="bg-zinc-900 rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.03] border-b border-white/[0.08]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-50">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-50">Poste</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-50">Niveau</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-50">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-50">Durée</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-50">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-50">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-50">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => {
                    const report = session.reports as { id: string; overall_score: number } | null
                    const isCompleted = session.status === "completed"
                    
                    return (
                      <tr key={session.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03] transition-colors">
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {formatDate(session.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-zinc-50">
                          {session.job_title}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {session.level}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {session.interview_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {session.duration_seconds ? formatDuration(session.duration_seconds) : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {report ? (
                            <span className="font-semibold text-zinc-50">{report.overall_score}%</span>
                          ) : (
                            <span className="text-zinc-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${
                            isCompleted
                              ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20"
                              : "bg-amber-500/15 text-amber-300 ring-amber-400/20"
                          }`}>
                            {isCompleted ? "Terminé" : "En cours"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {report && isCompleted ? (
                            <Link
                              href={`/report/${report.id}`}
                              className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline font-medium transition-colors"
                            >
                              Voir rapport
                            </Link>
                          ) : (
                            <span className="text-sm text-zinc-500">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
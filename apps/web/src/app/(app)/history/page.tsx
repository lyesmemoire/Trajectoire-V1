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
          className="inline-flex items-center text-sm text-ink-600 hover:text-ink-900 mb-4 transition-colors"
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-serif font-bold text-ink-900 mb-2">
          Historique des simulations
        </h1>
        <p className="text-ink-600">Consultez toutes vos simulations et leurs rapports.</p>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="bg-gradient-to-br from-bronze-50 to-ivoire-100/50 p-8 rounded-2xl border border-bronze-200/50 text-center">
          <h3 className="text-xl font-serif font-semibold text-ink-900 mb-2">Aucune simulation</h3>
          <p className="text-ink-600 mb-6">Vous n&apos;avez pas encore réalisé de simulation.</p>
          <Link href="/simulation">
            <Button size="md">
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
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-ivoire-200/60 overflow-hidden shadow-premium">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ivoire-50/80 border-b border-ivoire-200/60">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink-900">Poste</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink-900">Niveau</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink-900">Durée</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink-900">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink-900">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ink-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => {
                    const report = session.reports as { id: string; overall_score: number } | null
                    const isCompleted = session.status === "completed"
                    
                    return (
                      <tr key={session.id} className="border-b border-ivoire-100 last:border-0 hover:bg-ivoire-50/60 transition-colors">
                        <td className="px-6 py-4 text-sm text-ink-600">
                          {formatDate(session.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-ink-900">
                          {session.job_title}
                        </td>
                        <td className="px-6 py-4 text-sm text-ink-600">
                          {session.level}
                        </td>
                        <td className="px-6 py-4 text-sm text-ink-600">
                          {session.interview_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-ink-600">
                          {session.duration_seconds ? formatDuration(session.duration_seconds) : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {report ? (
                            <span className="font-semibold text-bronze-700">{report.overall_score}%</span>
                          ) : (
                            <span className="text-ink-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            isCompleted 
                              ? "bg-forest-50 text-forest-700 border border-forest-200/50" 
                              : "bg-bronze-50 text-bronze-700 border border-bronze-200/50"
                          }`}>
                            {isCompleted ? "Terminé" : "En cours"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {report && isCompleted ? (
                            <Link
                              href={`/report/${report.id}`}
                              className="text-sm text-bronze-700 hover:text-bronze-800 hover:underline font-medium transition-colors"
                            >
                              Voir rapport
                            </Link>
                          ) : (
                            <span className="text-sm text-ink-400">-</span>
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
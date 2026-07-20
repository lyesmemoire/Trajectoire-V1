import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatsOverview } from "@/components/dashboard/StatsOverview";

export const metadata: Metadata = {
  title: "Historique – Trajectoire",
  description: "Consultez votre historique de simulations.",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all sessions with reports
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
    .order("created_at", { ascending: false });

  // Calculate statistics for history page
  const totalSimulations = sessions?.length || 0;
  const totalDuration = sessions?.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) || 0;
  const allReports = sessions?.map(s => s.reports).filter(r => r !== null).flat() || [];
  const averageScore = allReports.length > 0
    ? allReports.reduce((sum, report) => sum + (report.overall_score || 0), 0) / allReports.length
    : 0;
  const bestScore = allReports.length > 0
    ? Math.max(...allReports.map(r => r.overall_score || 0))
    : 0;
  const confidenceScore = averageScore / 100;
  const currentStreak = 0; // Would be calculated from consecutive days

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Historique des simulations</h1>
        <p className="text-slate-600">Consultez toutes vos simulations et leurs rapports.</p>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100 text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucune simulation</h3>
          <p className="text-slate-600 mb-6">Vous n&apos;avez pas encore réalisé de simulation.</p>
          <Link
            href="/simulation"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Commencer ma première simulation
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
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Poste</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Niveau</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Durée</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const report = session.reports as { id: string; overall_score: number } | null;
                  const isCompleted = session.status === "completed";
                  
                  return (
                    <tr key={session.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatDate(session.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {session.job_title}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {session.level}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {session.interview_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {session.duration_seconds ? formatDuration(session.duration_seconds) : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {report ? (
                          <span className="font-semibold text-blue-600">{report.overall_score}%</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          isCompleted 
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {isCompleted ? "Terminé" : "En cours"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {report && isCompleted ? (
                          <Link
                            href={`/report/${report.id}`}
                            className="text-sm text-blue-600 hover:underline font-medium"
                          >
                            Voir rapport
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

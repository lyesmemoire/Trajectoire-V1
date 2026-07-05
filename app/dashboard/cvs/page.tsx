import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DeleteButton } from "./DeleteButton";
import { Sparkline } from "./Sparkline";
import { FileText, Target, Zap, Plus, Clock, Sparkles } from "lucide-react";
import { GetSubscriptionQuery } from "@/lib/billing/application/queries/get-subscription.query";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { DashboardCard } from "@/components/design-system";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { EmptyState } from "@/components/design-system";

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <DashboardCard
      title={label}
      value={value}
    />
  );
}

export default async function CvsPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/dashboard/cvs");

  const { data: cvs } = await supabase
    .from("cvs")
    .select("id, file_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch ATS reports for analytics
  const { data: stats } = await supabase
    .from("ats_reports")
    .select("cv_id, score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const safeStats = stats || [];

  // User Billing Info
  const getSubscriptionQuery = appContainer.resolve<GetSubscriptionQuery>("GetSubscriptionQuery");
  const subscriptionResult = await getSubscriptionQuery.execute({ userId: user.id });
  const plan = subscriptionResult.isSuccess() ? subscriptionResult.unwrap().plan : "free";
  const hasUsedFreeTrial = plan === "free"; // Simplified logic

  // Global KPIs
  const totalAnalyses = safeStats.length;
  const averageScore = totalAnalyses > 0
    ? Math.round(safeStats.reduce((acc: number, r: any) => acc + (r.score ?? 0), 0) / totalAnalyses)
    : null;
  const lastAnalysisDate = totalAnalyses > 0 && safeStats[0]
    ? new Date(safeStats[0].created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
    : null;

  // Group by CV
  const reportsByCv = safeStats.reduce((acc: Record<string, typeof safeStats>, report: any) => {
    if (!acc[report.cv_id]) acc[report.cv_id] = [];
    acc[report.cv_id]!.push(report);
    return acc;
  }, {} as Record<string, typeof safeStats>);

  // Determine Best CV
  const bestCvId = Object.entries(reportsByCv).reduce(
    (best: any, [cvId, reports]: [string, any]) => {
      const bestScoreForCv = Math.max(...reports.map((r: any) => r.score ?? 0));
      if (!best || bestScoreForCv > best.score) {
        return { cvId, score: bestScoreForCv };
      }
      return best;
    },
    null as { cvId: string; score: number } | null
  )?.cvId ?? null;

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {plan === "free" && hasUsedFreeTrial && (
        <Card variant="elevated" className="mb-6 bg-warning/5 border-warning/20">
          <CardContent className="p-6">
            <p className="text-text font-medium mb-2">
              🎯 Votre analyse gratuite a été utilisée.
            </p>
            <p className="text-text-secondary text-sm mb-4">
              Passez à un plan payant pour des analyses illimitées et un rapport complet.
            </p>
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard/billing">
                Voir les offres
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-semibold text-text tracking-tight">Mes Documents</h1>
          <p className="text-text-secondary mt-2">
            Centralisez vos CV pour lancer des analyses ATS et des optimisations ciblées.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/cv">
            <Plus className="w-5 h-5" /> Ajouter un CV
          </Link>
        </Button>
      </div>

      {/* KPI Global Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <KpiCard
          label="Analyses ATS"
          value={totalAnalyses}
        />
        <KpiCard
          label="Score moyen"
          value={averageScore ? `${averageScore}%` : "—"}
        />
        <KpiCard
          label="Dernière analyse"
          value={lastAnalysisDate ?? "—"}
        />
      </div>

      <div className="space-y-6">
        {(!cvs || cvs.length === 0) && (
          <Card variant="elevated">
            <CardContent className="py-20 px-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Aucun CV pour le moment</h3>
              <p className="text-text-secondary max-w-sm mx-auto mb-6">
                Ajoutez votre premier CV en format PDF pour débloquer l'analyse ATS et l'optimisation.
              </p>
              <Button asChild size="lg">
                <Link href="/cv">
                  <Plus className="w-5 h-5" /> Ajouter un CV
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {cvs?.map((cv: any, index: number) => {
          const isLatest = index === 0;
          const cvReports = reportsByCv[cv.id] ?? [];
          const totalCvAnalyses = cvReports.length;
          const lastScore = totalCvAnalyses > 0 ? cvReports[0]?.score ?? null : null;
          const previousScore = totalCvAnalyses > 1 ? cvReports[1]?.score ?? null : null;

          const scoreDelta =
            lastScore !== null && previousScore !== null
              ? lastScore - previousScore
              : null;

          const sparklineData = cvReports
            .slice()
            .reverse()
            .map((r: any) => ({ score: r.score ?? 0 }));

          let sparklineColor = "#6366f1"; // indigo
          if (scoreDelta !== null) {
            if (scoreDelta > 0) sparklineColor = "#10b981"; // emerald
            else if (scoreDelta < 0) sparklineColor = "#ef4444"; // red
          }

          let primaryAction = null;
          let secondaryAction = null;

          if (totalCvAnalyses === 0) {
            primaryAction = {
              label: "🎯 Lancer l'analyse ATS",
              href: `/dashboard/ats?cvId=${cv.id}`,
              style: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20",
            };
          } else if (scoreDelta !== null && scoreDelta < 0 && lastScore !== null && lastScore < 80) {
            primaryAction = {
              label: "🛠 Corriger la baisse",
              href: `/dashboard/optimize?cvId=${cv.id}`,
              style: "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20",
            };
          } else if (lastScore !== null && lastScore < 60) {
            primaryAction = {
              label: "✨ Réécrire avec l'IA",
              href: `/dashboard/optimize?cvId=${cv.id}`,
              style: "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20",
            };
          } else if (lastScore !== null && lastScore < 80) {
            primaryAction = {
              label: scoreDelta !== null && scoreDelta > 0 ? "📈 Continuer l'amélioration" : "📈 Améliorer le score",
              href: `/dashboard/optimize?cvId=${cv.id}`,
              style: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20",
            };
          } else {
            primaryAction = {
              label: "🚀 Exporter ce CV",
              href: `/dashboard/export?cvId=${cv.id}`,
              style: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20",
            };
            secondaryAction = {
              label: "Re-tester",
              href: `/dashboard/ats?cvId=${cv.id}`,
            };
          }

          return (
            <Card
              key={cv.id}
              variant={isLatest ? "elevated" : "default"}
              className={`group transition-all ${isLatest ? "border-primary/30" : ""}`}
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                      isLatest ? "bg-primary/10 text-primary" : "bg-gray-100 text-text-muted"
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-text truncate max-w-[200px] sm:max-w-xs">
                          {cv.file_name || "Document sans titre"}
                        </h3>
                        {isLatest && (
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider rounded-full">
                            CV Actif
                          </span>
                        )}
                        {cv.id === bestCvId && (
                          <span className="px-3 py-1 bg-warning/10 text-warning text-xs font-medium uppercase tracking-wider rounded-full">
                            🏆 Meilleur CV
                          </span>
                        )}
                      </div>

                      {/* CV Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          Ajouté le {new Date(cv.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        {totalCvAnalyses > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Target className="w-4 h-4" />
                            {totalCvAnalyses} analyse{totalCvAnalyses > 1 ? "s" : ""} ATS
                          </div>
                        )}
                      </div>

                      {/* Badges CV-Level */}
                      {lastScore !== null && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium text-text">Dernier score : {lastScore}%</span>

                          {/* Delta Progression */}
                          {scoreDelta !== null && (
                            <span
                              className={`text-xs font-medium ${
                                scoreDelta > 0
                                  ? "text-success bg-success/10 px-2 py-0.5 rounded-md"
                                  : scoreDelta < 0
                                  ? "text-error bg-error/10 px-2 py-0.5 rounded-md"
                                  : "text-text-muted bg-gray-100 px-2 py-0.5 rounded-md"
                              }`}
                            >
                              {scoreDelta > 0 && "📈 +"}
                              {scoreDelta < 0 && "📉 "}
                              {scoreDelta === 0 && "〰️ "}
                              {scoreDelta}%
                            </span>
                          )}

                          {/* Score Rating */}
                          {lastScore >= 80 && (
                            <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium uppercase tracking-wider rounded-md">
                              🔥 Excellent
                            </span>
                          )}
                          {lastScore < 60 && (
                            <span className="px-2 py-0.5 bg-error/10 text-error text-xs font-medium uppercase tracking-wider rounded-md">
                              ⚠️ À optimiser
                            </span>
                          )}
                        </div>
                      )}

                      {/* Sparkline */}
                      {totalCvAnalyses >= 3 && (
                        <div className="w-full max-w-[250px] pt-1">
                          <Sparkline data={sparklineData} color={sparklineColor} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {secondaryAction && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={secondaryAction.href}>
                          <Target className="w-4 h-4" />
                          <span>{secondaryAction.label}</span>
                        </Link>
                      </Button>
                    )}

                    <Button asChild size="sm">
                      <Link href={primaryAction.href}>
                        <span>{primaryAction.label}</span>
                      </Link>
                    </Button>

                    <div className="w-px h-8 bg-gray-200 hidden md:block mx-2"></div>
                    <DeleteButton cvId={cv.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

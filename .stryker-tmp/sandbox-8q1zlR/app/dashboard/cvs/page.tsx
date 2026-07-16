// @ts-nocheck
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DeleteButton } from "./DeleteButton";
import { Sparkline } from "./Sparkline";
import { UploadSection } from "./upload-section";
import { FileText, Target, Plus, Clock } from "lucide-react";
import { GetSubscriptionQuery } from "@/lib/billing/application/queries/get-subscription.query";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { DashboardCard } from "@/components/design-system";
import { Card, CardContent } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { motion } from "framer-motion";

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
    <div className="max-w-5xl mx-auto pb-24 space-y-8">
      {plan === "free" && hasUsedFreeTrial && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-yellow-50 border border-yellow-200 shadow-sm">
            <CardContent className="p-6">
              <p className="text-gray-900 font-medium mb-2">
                🎯 Votre analyse gratuite a été utilisée.
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Passez à un plan payant pour des analyses illimitées et un rapport complet.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/billing">
                  Voir les offres
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="font-serif text-4xl font-semibold text-gray-900 tracking-tight">
            Mes Documents
          </h1>
          <p className="text-gray-600 mt-2 text-[15px]">
            Centralisez vos CV pour lancer des analyses ATS et des optimisations ciblées.
          </p>
        </div>
        <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
          <Link href="/cv">
            <Plus className="w-5 h-5" /> Ajouter un CV
          </Link>
        </Button>
      </motion.div>

      {/* KPI Global Block */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
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
      </motion.div>

      <UploadSection />

      <div className="space-y-6">
        {(!cvs || cvs.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="bg-white border border-gray-200/60 shadow-sm">
              <CardContent className="py-20 px-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Aucun CV pour le moment</h3>
                <p className="text-gray-600 max-w-sm mx-auto mb-6 text-[15px]">
                  Ajoutez votre premier CV en format PDF pour débloquer l'analyse ATS et l'optimisation.
                </p>
                <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Link href="/cv">
                    <Plus className="w-5 h-5" /> Ajouter un CV
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
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
            <motion.div
              key={cv.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card
                className={`
                  bg-white border shadow-sm hover:shadow-md transition-all duration-200
                  ${isLatest ? "border-gray-900/20" : "border-gray-200/60"}
                `}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex items-start gap-5">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 ${
                        isLatest ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-serif text-xl font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                            {cv.file_name || "Document sans titre"}
                          </h3>
                          {isLatest && (
                            <span className="px-3 py-1 bg-gray-900 text-white text-xs font-medium uppercase tracking-wider rounded-full">
                              CV Actif
                            </span>
                          )}
                          {cv.id === bestCvId && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium uppercase tracking-wider rounded-full">
                              🏆 Meilleur CV
                            </span>
                          )}
                        </div>

                        {/* CV Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
                            <span className="text-sm font-medium text-gray-900">Dernier score : {lastScore}%</span>

                            {/* Delta Progression */}
                            {scoreDelta !== null && (
                              <span
                                className={`text-xs font-medium ${
                                  scoreDelta > 0
                                    ? "text-green-700 bg-green-100 px-2 py-0.5 rounded-md"
                                    : scoreDelta < 0
                                    ? "text-red-700 bg-red-100 px-2 py-0.5 rounded-md"
                                    : "text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md"
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
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium uppercase tracking-wider rounded-md">
                                🔥 Excellent
                              </span>
                            )}
                            {lastScore < 60 && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium uppercase tracking-wider rounded-md">
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

                      <Button
                        asChild
                        size="sm"
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                      >
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

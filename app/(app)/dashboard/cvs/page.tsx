import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GetSubscriptionQuery } from "@/lib/billing";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { CvsPageContent } from "./CvsPageContent";
import type { DashboardCv, DashboardCvsData } from "./types";

export const dynamic = "force-dynamic";

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

  type ReportRow = { cv_id: string; score: number | null; created_at: string };
  const safeStats = (stats as ReportRow[]) || [];

  // User Billing Info
  const getSubscriptionQuery = appContainer.resolve<GetSubscriptionQuery>("GetSubscriptionQuery");
  const subscriptionResult = await getSubscriptionQuery.execute({ userId: user.id });
  const plan = subscriptionResult.isSuccess() ? subscriptionResult.unwrap().plan : "free";
  const hasUsedFreeTrial = plan === "free"; // Simplified logic

  // Global KPIs
  const totalAnalyses = safeStats.length;
  const averageScore = totalAnalyses > 0
    ? Math.round(safeStats.reduce((acc: number, r: { score: number | null }) => acc + (r.score ?? 0), 0) / totalAnalyses)
    : null;
  const lastAnalysisDate = totalAnalyses > 0 && safeStats[0]
    ? new Date(safeStats[0].created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
    : null;

  // Group by CV
  const reportsByCv = safeStats.reduce((acc: Record<string, ReportRow[]>, report: ReportRow) => {
    if (!acc[report.cv_id]) acc[report.cv_id] = [];
    acc[report.cv_id]!.push(report);
    return acc;
  }, {} as Record<string, ReportRow[]>);

  // Determine Best CV
  const bestCvId = Object.entries(reportsByCv).reduce(
    (best: { cvId: string; score: number } | null, [cvId, reports]) => {
      const bestScoreForCv = Math.max(...reports.map((r) => r.score ?? 0));
      if (!best || bestScoreForCv > best.score) {
        return { cvId, score: bestScoreForCv };
      }
      return best;
    },
    null as { cvId: string; score: number } | null
  )?.cvId ?? null;

  const mappedCvs: DashboardCv[] = (cvs || []).map((cv: { id: string, file_name: string | null, created_at: string }, index: number) => {
    const isLatest = index === 0;
    const cvReports = reportsByCv[cv.id] ?? [];
    const totalCvAnalyses = cvReports.length;
    const lastScore = totalCvAnalyses > 0 ? cvReports[0]?.score ?? null : null;
    const previousScore = totalCvAnalyses > 1 ? cvReports[1]?.score ?? null : null;

    const sparklineData = cvReports
      .slice()
      .reverse()
      .map((r) => ({ score: r.score ?? 0 }));

    return {
      id: cv.id,
      title: cv.file_name || "Document sans titre",
      createdAt: cv.created_at,
      score: lastScore,
      previousScore: previousScore,
      totalAnalyses: totalCvAnalyses,
      isLatest,
      isBest: cv.id === bestCvId,
      sparklineData,
    };
  });

  const pageData: DashboardCvsData = {
    cvs: mappedCvs,
    kpis: {
      totalAnalyses,
      averageScore,
      lastAnalysisDate,
    },
    billing: {
      plan,
      hasUsedFreeTrial,
    }
  };

  return <CvsPageContent data={pageData} />;
}

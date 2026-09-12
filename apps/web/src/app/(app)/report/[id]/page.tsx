import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StrengthsWeaknessesSection } from "@/components/dashboard/StrengthsWeaknessesSection"
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection"
import { UpgradeCTA } from "@/components/premium/UpgradeCTA"
import { checkUserSubscription } from "@/lib/subscription/check-subscription"

export const metadata: Metadata = {
  title: "Rapport – Trajectoire",
  description: "Consultez votre rapport d'entretien.",
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Vérifier le statut Premium
  const subscriptionCheck = await checkUserSubscription(user.id)
  const isPremium =
    subscriptionCheck.hasAccess || subscriptionCheck.plan !== "FREE"

  // Fetch report with session data (IDOR protection: verify user ownership)
  const { data: report } = await supabase
    .from("reports")
    .select(
      `
      *,
      interview_sessions!inner (
        job_title,
        level,
        interview_type,
        created_at,
        user_id
      )
    `,
    )
    .eq("id", id)
    .eq("interview_sessions.user_id", user.id)
    .single()

  if (!report) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
          >
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Rapport introuvable
          </h1>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">
            Ce rapport n'existe pas ou vous n'avez pas accès.
          </p>
        </div>
      </div>
    )
  }

  const session = (report as any).interview_sessions as {
    job_title: string
    level: string
    interview_type: string
    created_at: string
  } | null

  const strengths = (report.strengths as string[]) || []
  const improvements = (report.improvements as string[]) || []

  // Fallback pour session manquante
  const sessionData = session || {
    job_title: "Entretien",
    level: "Non spécifié",
    interview_type: "Non spécifié",
    created_at: new Date().toISOString(),
  }

  // Pour les utilisateurs FREE, limiter les données envoyées
  const limitedStrengths = isPremium ? strengths : strengths.slice(0, 1)
  const limitedImprovements = isPremium ? improvements : []

  // Insight clé pour les utilisateurs FREE (1 insight uniquement)
  const keyInsight =
    strengths[0] || "Aucun insight disponible pour cette simulation."

  // Formater les recommandations réelles
  let realRecommendations: any[] = []
  if (Array.isArray((report as any).recommendations)) {
    realRecommendations = (report as any).recommendations.map(
      (rec: any, index: number) => {
        if (typeof rec === "string") {
          return {
            id: `rec-${index}`,
            title: rec.substring(0, 50) + (rec.length > 50 ? "..." : ""),
            description: rec,
            priority: "medium",
            category: "General",
          }
        }
        return {
          id: rec.id || `rec-${index}`,
          title: rec.title || rec.recommendation || "Recommandation",
          description: rec.description || rec.content || "",
          priority: rec.priority || "medium",
          category: rec.category || "General",
        }
      },
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Rapport d'entretien
        </h1>
        <p className="text-slate-600">
          {sessionData.job_title} · {sessionData.interview_type} ·{" "}
          {sessionData.level}
        </p>
      </div>

      {/* Overall Score */}
      <div className="mb-6 rounded-lg border border-violet-100 bg-gradient-to-br from-violet-50 to-violet-100/50 p-8 text-center">
        <p className="mb-2 text-sm font-semibold text-violet-800">
          Score global
        </p>
        <p className="mb-2 text-6xl font-bold text-violet-700">
          {report.overall_score}/100
        </p>
        <p className="font-medium text-violet-900">
          {(report.overall_score ?? 0) >= 80
            ? "Excellent"
            : (report.overall_score ?? 0) >= 60
              ? "Bon"
              : "À améliorer"}
        </p>
      </div>

      {/* Detailed Scores */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="mb-2 text-sm text-slate-600">Communication</p>
          <p className="text-3xl font-bold text-slate-900">
            {report.communication || 0}/100
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="mb-2 text-sm text-slate-600">Technique</p>
          <p className="text-3xl font-bold text-slate-900">
            {report.technical || 0}/100
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="mb-2 text-sm text-slate-600">Confiance</p>
          <p className="text-3xl font-bold text-slate-900">
            {report.confidence || 0}/100
          </p>
        </div>
      </div>

      {/* Insight clé pour les utilisateurs FREE */}
      {!isPremium && (
        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Insight clé
          </h3>
          <p className="leading-relaxed text-slate-700">{keyInsight}</p>
          <p className="mt-4 text-sm text-slate-500">
            Débloquez l'analyse complète pour voir tous vos points forts et
            axes d'amélioration.
          </p>
        </div>
      )}

      {/* Strengths and Weaknesses */}
      {isPremium ? (
        <StrengthsWeaknessesSection
          strengths={limitedStrengths}
          weaknesses={limitedImprovements}
        />
      ) : (
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Points forts et axes d'amélioration
          </h3>
          <p className="mb-4 text-slate-600">
            {limitedStrengths[0] || "Aucun point fort détecté"}
          </p>
          <div className="relative">
            <div className="pointer-events-none select-none blur-sm opacity-50">
              <p className="text-slate-400">Contenu premium masqué</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <UpgradeCTA />
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {isPremium ? (
        realRecommendations.length > 0 ? (
          <RecommendationsSection recommendations={realRecommendations} />
        ) : (
          <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Recommandations
            </h3>
            <p className="text-slate-600">
              Aucune recommandation détaillée n'est disponible pour cette
              simulation.
            </p>
          </div>
        )
      ) : (
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Recommandations
          </h3>
          <div className="relative">
            <div className="pointer-events-none select-none blur-sm opacity-50">
              <p className="text-slate-400">Contenu premium masqué</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <UpgradeCTA />
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {report.summary && (
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Résumé</h3>
          <p className="leading-relaxed text-slate-700">{report.summary}</p>
        </div>
      )}

      {/* Final Recommendation */}
      {report.recommendation && (
        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Recommandation finale
          </h3>
          <p className="leading-relaxed text-slate-700">
            {report.recommendation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/simulation"
          className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-700"
        >
          Nouvelle simulation
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-200"
        >
          Retour au tableau de bord
        </Link>
      </div>

      {/* Premium CTA at the end of report */}
      {!isPremium && (
        <div className="mt-8 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 p-8 text-white">
          <div className="space-y-4 text-center">
            <h3 className="text-2xl font-bold">Prêt à aller plus loin ?</h3>
            <p className="text-violet-100">
              Débloquez l'analyse complète, le plan d'action personnalisé et
              les recommandations avancées.
            </p>
            <UpgradeCTA feature="le rapport complet" />
          </div>
        </div>
      )}
    </div>
  )
}

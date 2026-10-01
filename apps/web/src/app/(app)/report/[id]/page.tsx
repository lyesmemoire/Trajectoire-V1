import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StrengthsWeaknessesSection } from "@/components/dashboard/StrengthsWeaknessesSection"
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection"
import { UpgradeCTA } from "@/components/premium/UpgradeCTA"
import { checkUserSubscription } from "@/lib/subscription/check-subscription"
import { QuestionByQuestionSection } from "@/components/report/QuestionByQuestionSection"

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
  // `hasAccess` seul : en cas d'erreur `plan` vaut null, et `null !== "FREE"` ouvrirait l'accès.
  const isPremium = subscriptionCheck.hasAccess

  // Fetch report with session data (IDOR protection: verify user ownership)
  const { data: report } = await supabase
    .from("reports")
    .select(
      `
      *,
      interview_sessions!inner (
        id,
        job_title,
        level,
        interview_type,
        created_at,
        user_id,
        analysis,
        feedback
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
            className="mb-4 inline-flex items-center text-sm text-calm-secondary hover:text-calm-ink"
          >
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-calm-ink">
            Rapport introuvable
          </h1>
        </div>
        <div className="rounded-lg border border-calm-line bg-calm-surface p-8 text-center">
          <p className="text-calm-secondary">
            Ce rapport n'existe pas ou vous n'avez pas accès.
          </p>
        </div>
      </div>
    )
  }

  const session = (report as any).interview_sessions as {
    id: string
    job_title: string
    level: string
    interview_type: string
    created_at: string
    analysis?: Record<string, any>
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

  // Extraire questionByQuestion depuis interview_sessions.feedback (upserted lors de la génération)
  const sessionFeedback = (session as any)?.feedback
  const rawQna = Array.isArray(sessionFeedback?.questionByQuestion)
    ? sessionFeedback.questionByQuestion
    : []

  const qnaEvaluations = Array.isArray(session?.analysis?.qnaEvaluations)
    ? session.analysis.qnaEvaluations
    : []

  const questionByQuestion: Array<{
    messageId?: string
    sessionId?: string
    hasAudio?: boolean
    question: string
    answer: string
    competency: string | null
    score: number
    whatWentWell: string[]
    whatWasMissing: string[]
    howToImprove: string[]
    betterAnswer: string
  }> = rawQna
    .filter(
      (q: any) =>
        q &&
        typeof q.question === "string" &&
        q.question.length > 0 &&
        typeof q.answer === "string" &&
        typeof q.score === "number" &&
        Number.isFinite(q.score),
    )
    .map((q: any) => {
      const qnaEval = qnaEvaluations.find((e: any) => e.messageId === q.messageId)
      const hasAudio = !!(qnaEval && qnaEval.audio && qnaEval.audio.path)

      return {
        messageId: typeof q.messageId === "string" ? q.messageId : undefined,
        sessionId: session?.id,
        hasAudio,
        question: q.question,
        answer: q.answer,
      competency: typeof q.competency === "string" ? q.competency : null,
      score: q.score,
      whatWentWell: Array.isArray(q.whatWentWell) ? q.whatWentWell.filter((s: any) => typeof s === "string") : [],
      whatWasMissing: Array.isArray(q.whatWasMissing) ? q.whatWasMissing.filter((s: any) => typeof s === "string") : [],
      howToImprove: Array.isArray(q.howToImprove) ? q.howToImprove.filter((s: any) => typeof s === "string") : [],
      betterAnswer: typeof q.betterAnswer === "string" ? q.betterAnswer : "",
    }
  })

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
          className="mb-4 inline-flex items-center text-sm text-calm-secondary hover:text-calm-ink"
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="mb-2 text-calm-h1 text-calm-ink">
          Rapport d'entretien
        </h1>
        <p className="text-calm-secondary">
          {sessionData.job_title} · {sessionData.interview_type} ·{" "}
          {sessionData.level}
        </p>
      </div>

      {/* Point fort d'abord */}
      {strengths[0] && (
        <section
          aria-labelledby="point-fort"
          className="mb-4 rounded-xl border border-calm-accent-line bg-calm-accent-wash p-6"
        >
          <h2 id="point-fort" className="mb-2 text-sm font-semibold text-calm-accent-deep">
            Votre point fort
          </h2>
          <p className="text-lg leading-relaxed text-calm-ink">{strengths[0]}</p>
        </section>
      )}

      {/* Axe prioritaire : avertissement doux, réservé aux plans qui voient les axes d'amélioration */}
      {isPremium && improvements[0] && (
        <section
          aria-labelledby="axe-prioritaire"
          className="mb-6 rounded-xl border border-calm-warn-line bg-calm-warn-soft p-6"
        >
          <h2 id="axe-prioritaire" className="mb-2 text-sm font-semibold text-calm-warn">
            Votre axe prioritaire
          </h2>
          <p className="text-lg leading-relaxed text-calm-ink">{improvements[0]}</p>
        </section>
      )}

      {/* Overall Score */}
      <div className="mb-6 rounded-xl border border-calm-accent-line bg-calm-accent-soft p-8 text-center">
        <p className="mb-2 text-sm font-semibold text-calm-accent-deep">
          Score global
        </p>
        <p className="mb-2 text-6xl font-bold text-calm-accent-deep">
          {report.overall_score}/100
        </p>
        <p className="font-medium text-calm-ink">
          {(report.overall_score ?? 0) >= 80
            ? "Excellent"
            : (report.overall_score ?? 0) >= 60
              ? "Bon"
              : "À améliorer"}
        </p>
      </div>

      {/* Detailed Scores */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-calm-line bg-calm-surface p-6">
          <p className="mb-2 text-sm text-calm-secondary">Communication</p>
          <p className="text-3xl font-bold text-calm-ink">
            {report.communication || 0}/100
          </p>
        </div>
        <div className="rounded-lg border border-calm-line bg-calm-surface p-6">
          <p className="mb-2 text-sm text-calm-secondary">Technique</p>
          <p className="text-3xl font-bold text-calm-ink">
            {report.technical || 0}/100
          </p>
        </div>
        <div className="rounded-lg border border-calm-line bg-calm-surface p-6">
          <p className="mb-2 text-sm text-calm-secondary">Confiance</p>
          <p className="text-3xl font-bold text-calm-ink">
            {report.confidence || 0}/100
          </p>
        </div>
      </div>

      {/* Insight clé pour les utilisateurs FREE */}
      {!isPremium && (
        <div className="mb-6 rounded-lg border border-calm-line bg-calm-accent-wash p-6">
          <h3 className="mb-4 text-lg font-semibold text-calm-ink">
            Insight clé
          </h3>
          <p className="leading-relaxed text-calm-ink">{keyInsight}</p>
          <p className="mt-4 text-sm text-calm-secondary">
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
        <div className="mb-6 rounded-lg border border-calm-line bg-calm-surface p-6">
          <h3 className="mb-4 text-lg font-semibold text-calm-ink">
            Points forts et axes d'amélioration
          </h3>
          <p className="mb-4 text-calm-secondary">
            {limitedStrengths[0] || "Aucun point fort détecté"}
          </p>
          <div className="relative">
            <div className="pointer-events-none select-none blur-sm opacity-50">
              <p className="text-calm-tertiary">Contenu premium masqué</p>
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
          <div className="mb-6 rounded-lg border border-calm-line bg-calm-surface p-6">
            <h3 className="mb-4 text-lg font-semibold text-calm-ink">
              Recommandations
            </h3>
            <p className="text-calm-secondary">
              Aucune recommandation détaillée n'est disponible pour cette
              simulation.
            </p>
          </div>
        )
      ) : (
        <div className="mb-6 rounded-lg border border-calm-line bg-calm-surface p-6">
          <h3 className="mb-4 text-lg font-semibold text-calm-ink">
            Recommandations
          </h3>
          <div className="relative">
            <div className="pointer-events-none select-none blur-sm opacity-50">
              <p className="text-calm-tertiary">Contenu premium masqué</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <UpgradeCTA />
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {report.summary && (
        <div className="mb-6 rounded-lg border border-calm-line bg-calm-surface p-6">
          <h3 className="mb-4 text-lg font-semibold text-calm-ink">Résumé</h3>
          <p className="leading-relaxed text-calm-ink">{report.summary}</p>
        </div>
      )}

      {/* Question by question — Premium only */}
      {isPremium && questionByQuestion.length > 0 && (
        <QuestionByQuestionSection items={questionByQuestion} />
      )}
      {!isPremium && questionByQuestion.length > 0 && (
        <div className="mb-6 rounded-xl border border-calm-line bg-calm-surface p-6 relative overflow-hidden">
          <h2 className="text-xl font-sans font-semibold text-calm-ink mb-1">
            Analyse de vos réponses
          </h2>
          <p className="text-sm text-calm-secondary mb-4">
            Analyse détaillée question par question avec exemples de meilleures réponses.
          </p>
          <div className="pointer-events-none select-none blur-sm opacity-40 space-y-3">
            {questionByQuestion.slice(0, 2).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-calm-accent-wash" />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <UpgradeCTA feature="l'analyse question par question" />
          </div>
        </div>
      )}

      {/* Final Recommendation */}
      {report.recommendation && (
        <div className="mb-6 rounded-lg border border-calm-line bg-calm-accent-wash p-6">
          <h3 className="mb-4 text-lg font-semibold text-calm-ink">
            Recommandation finale
          </h3>
          <p className="leading-relaxed text-calm-ink">
            {report.recommendation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/simulation/new"
          className="inline-flex items-center justify-center tap-target rounded-xl bg-calm-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-calm-accent-deep"
        >
          Nouvelle simulation
        </Link>
        <Link
          href="/dashboard"
          className="tap-target inline-flex items-center justify-center rounded-xl border border-calm-line bg-calm-surface px-6 py-3 font-semibold text-calm-ink transition-colors hover:bg-calm-accent-soft"
        >
          Retour au tableau de bord
        </Link>
      </div>

      {/* Premium CTA at the end of report */}
      {!isPremium && (
        <div className="mt-8 rounded-xl border border-calm-accent-line bg-calm-accent-wash p-8 text-calm-ink">
          <div className="space-y-4 text-center">
            <h3 className="text-calm-h3 font-semibold">Prêt à aller plus loin ?</h3>
            <p className="text-calm-secondary">
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

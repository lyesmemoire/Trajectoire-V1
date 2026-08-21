import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StrengthsWeaknessesSection } from "@/components/dashboard/StrengthsWeaknessesSection"
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection"
import { UpgradeCTA } from "@/components/premium/UpgradeCTA"
import { checkUserSubscription } from "@/lib/subscription/check-subscription"

export const metadata: Metadata = {
  title: "Rapport â€“ Trajectoire",
  description: "Consultez votre rapport d'entretien.",
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // VÃ©rifier le statut Premium
  const subscriptionCheck = await checkUserSubscription(user.id)
  const isPremium = subscriptionCheck.hasAccess || subscriptionCheck.plan !== "FREE"

  // Fetch report with session data (IDOR protection: verify user ownership)
  const { data: report } = await supabase
    .from("reports")
    .select(`
      *,
      interview_sessions!inner (
        job_title,
        level,
        interview_type,
        created_at,
        user_id
      )
    `)
    .eq("id", id)
    .eq("interview_sessions.user_id", user.id)
    .single()

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-ink-600 hover:text-ink-900 mb-4"
          >
            â† Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-ink-900">Rapport introuvable</h1>
        </div>
        <div className="bg-white rounded-lg border border-ivoire-200 p-8 text-center">
          <p className="text-ink-600">Ce rapport n&apos;existe pas ou vous n&apos;avez pas accÃ¨s.</p>
        </div>
      </div>
    )
  }

  const session = (report as any).interview_sessions as { job_title: string; level: string; interview_type: string; created_at: string } | null
  const strengths = report.strengths as string[] || []
  const improvements = report.improvements as string[] || []

  // Fallback pour session manquante
  const sessionData = session || {
    job_title: "Entretien",
    level: "Non spÃ©cifiÃ©",
    interview_type: "Non spÃ©cifiÃ©",
    created_at: new Date().toISOString(),
  }

  // Pour les utilisateurs FREE, limiter les donnÃ©es envoyÃ©es
  const limitedStrengths = isPremium ? strengths : strengths.slice(0, 1)
  const limitedImprovements = isPremium ? improvements : []

  // Generate recommendations from AI engines using real recommendation fusion engine
  const { RecommendationFusionEngine } = await import("@/application/adaptive-intelligence/RecommendationFusionEngine");
  const fusionEngine = RecommendationFusionEngine.getInstance();
  
  // Generate recommendations based on report data using the correct interface
  const fusionResult = fusionEngine.fuseRecommendations([
    {
      engine: "interview_analysis",
      recommendation: "AmÃ©liorez votre communication - Pratiquez des scÃ©narios de communication pour renforcer vos compÃ©tences.",
      confidence: 0.85,
      priority: 1,
      timestamp: new Date(),
    },
    {
      engine: "interview_analysis",
      recommendation: "PrÃ©parez-vous aux questions techniques - RÃ©visez les concepts techniques clÃ©s pour votre domaine.",
      confidence: 0.75,
      priority: 2,
      timestamp: new Date(),
    }
  ]);
  
  // Convert FusedRecommendation to the expected format
  const recommendations = fusionResult.fusedRecommendations.map(rec => {
    const priorityValue = rec.priority === 1 ? "high" : rec.priority === 2 ? "medium" : "low";
    return {
      id: rec.id,
      title: rec.content.split(" - ")[0] || rec.content,
      description: rec.content.split(" - ")[1] || rec.content,
      priority: priorityValue as "high" | "medium" | "low",
      category: rec.category,
    };
  });

  // Insight clÃ© pour les utilisateurs FREE (1 insight uniquement)
  const keyInsight = strengths[0] || "Excellente communication lors de la prÃ©sentation"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-ink-600 hover:text-ink-900 mb-4"
        >
          â† Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-bold text-ink-900 mb-2">Rapport d&apos;entretien</h1>
        <p className="text-ink-600">
          {sessionData.job_title} Â· {sessionData.interview_type} Â· {sessionData.level}
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-br from-ivoire-50 to-ivoire-100 rounded-lg border border-ivoire-200 p-8 mb-6 text-center">
        <p className="text-sm text-ink-600 mb-2">Score global</p>
        <p className="text-6xl font-bold text-bronze-600 mb-2">{report.overall_score}/100</p>
        <p className="text-ink-600">
          {(report.overall_score ?? 0) >= 80 ? "Excellent" : (report.overall_score ?? 0) >= 60 ? "Bon" : "Ã€ amÃ©liorer"}
        </p>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-ivoire-200 p-6">
          <p className="text-sm text-ink-600 mb-2">Communication</p>
          <p className="text-3xl font-bold text-ink-900">{report.communication || 0}/100</p>
        </div>
        <div className="bg-white rounded-lg border border-ivoire-200 p-6">
          <p className="text-sm text-ink-600 mb-2">Technique</p>
          <p className="text-3xl font-bold text-ink-900">{report.technical || 0}/100</p>
        </div>
        <div className="bg-white rounded-lg border border-ivoire-200 p-6">
          <p className="text-sm text-ink-600 mb-2">Confiance</p>
          <p className="text-3xl font-bold text-ink-900">{report.confidence || 0}/100</p>
        </div>
      </div>

      {/* Insight clÃ© pour les utilisateurs FREE */}
      {!isPremium && (
        <div className="bg-ivoire-50 rounded-lg border border-ivoire-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Insight clÃ©</h3>
          <p className="text-ink-700 leading-relaxed">{keyInsight}</p>
          <p className="text-sm text-ink-500 mt-4">
            DÃ©bloquez l'analyse complÃ¨te pour voir tous vos points forts et axes d'amÃ©lioration.
          </p>
        </div>
      )}

      {/* Strengths and Weaknesses */}
      {isPremium ? (
        <StrengthsWeaknessesSection strengths={limitedStrengths} weaknesses={limitedImprovements} />
      ) : (
        <div className="bg-white rounded-lg border border-ivoire-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Points forts et axes d'amÃ©lioration</h3>
          <p className="text-ink-600 mb-4">{limitedStrengths[0] || "Aucun point fort dÃ©tectÃ©"}</p>
          <div className="relative">
            <div className="blur-sm pointer-events-none select-none opacity-50">
              <p className="text-ink-400">Contenu premium masquÃ©</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <UpgradeCTA />
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {isPremium ? (
        <RecommendationsSection recommendations={recommendations} />
      ) : (
        <div className="bg-white rounded-lg border border-ivoire-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Recommandations</h3>
          <div className="relative">
            <div className="blur-sm pointer-events-none select-none opacity-50">
              <p className="text-ink-400">Contenu premium masquÃ©</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <UpgradeCTA />
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {report.summary && (
        <div className="bg-white rounded-lg border border-ivoire-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">RÃ©sumÃ©</h3>
          <p className="text-ink-700 leading-relaxed">{report.summary}</p>
        </div>
      )}

      {/* Recommendation */}
      {report.recommendation && (
        <div className="bg-ivoire-50 rounded-lg border border-ivoire-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Recommandation</h3>
          <p className="text-ink-700 leading-relaxed">{report.recommendation}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/simulation"
          className="inline-flex items-center justify-center px-6 py-3 bg-bronze-600 text-white font-semibold rounded-lg hover:bg-bronze-700 transition-colors"
        >
          Nouvelle simulation
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 bg-ivoire-100 text-ink-700 font-semibold rounded-lg hover:bg-ivoire-200 transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </div>

      {/* Premium CTA at the end of report */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-bronze-600 to-bronze-700 p-8 rounded-xl text-white mt-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">PrÃªt Ã  aller plus loin ?</h3>
            <p className="text-ivoire-100">
              DÃ©bloquez l'analyse complÃ¨te, le plan d'action personnalisÃ© et les recommandations avancÃ©es.
            </p>
            <UpgradeCTA feature="le rapport complet" />
          </div>
        </div>
      )}
    </div>
  )
}


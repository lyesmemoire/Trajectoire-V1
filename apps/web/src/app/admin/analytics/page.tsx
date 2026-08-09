import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import {
  sessionAnalytics
} from "@/application/analytics/SessionAnalytics"
import {
  interviewAnalytics
} from "@/application/analytics/InterviewAnalytics"
import {
  retentionAnalytics
} from "@/application/analytics/RetentionAnalytics"
import {
  funnelAnalytics
} from "@/application/analytics/FunnelAnalytics"
import {
  heatmapEvents
} from "@/application/analytics/HeatmapEvents"
import {
  featureUsage
} from "@/application/analytics/FeatureUsage"
import {
  userJourney
} from "@/application/analytics/UserJourney"
import {
  feedbackAnalytics
} from "@/application/analytics/FeedbackAnalytics"

export const metadata: Metadata = {
  title: "Analytics Admin – Trajectoire",
  description: "Dashboard d'analytics pour administrateurs.",
}

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is admin using authorization module
  const { AuthorizationModule } = await import("@/lib/authorization/AuthorizationModule");
  const auth = await AuthorizationModule.create(user.id);
  
  if (!auth.isAdmin()) {
    redirect("/dashboard")
  }

  // Calculate all metrics
  const sessionMetrics = sessionAnalytics.calculateMetrics()
  const interviewMetrics = interviewAnalytics.calculateMetrics()
  const retentionMetrics = retentionAnalytics.calculateMetrics()
  const funnelMetrics = funnelAnalytics.calculateMetrics()
  const heatmapMetrics = heatmapEvents.calculateMetrics()
  const featureMetrics = featureUsage.calculateMetrics()
  const journeyMetrics = userJourney.calculateMetrics()
  const feedbackMetrics = feedbackAnalytics.calculateMetrics()
  const npsSegments = feedbackAnalytics.getNPSSegments()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-ink-600 hover:text-ink-900 mb-4"
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-bold text-ink-900 mb-2">Analytics Admin</h1>
        <p className="text-ink-600">Vue d'ensemble des métriques produit.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">Sessions totales</p>
          <p className="text-3xl font-bold text-ink-900">{sessionMetrics.totalSessions}</p>
          <p className="text-xs text-ink-500 mt-2">
            {sessionMetrics.averageDuration.toFixed(0)}s durée moyenne
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">Entretiens</p>
          <p className="text-3xl font-bold text-ink-900">{interviewMetrics.totalInterviews}</p>
          <p className="text-xs text-ink-500 mt-2">
            {(interviewMetrics.completionRate * 100).toFixed(0)}% complétion
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">Rétention J7</p>
          <p className="text-3xl font-bold text-ink-900">
            {(retentionMetrics.day7Retention * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-ink-500 mt-2">
            {retentionMetrics.churnRate.toFixed(0)}% churn
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">NPS Score</p>
          <p className="text-3xl font-bold text-ink-900">{npsSegments.npsScore.toFixed(0)}</p>
          <p className="text-xs text-ink-500 mt-2">
            {feedbackMetrics.totalFeedbacks} feedbacks
          </p>
        </div>
      </div>

      {/* Session Analytics */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Analytics Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-ink-600">Taux de rebond</p>
            <p className="text-2xl font-bold text-ink-900">
              {(sessionMetrics.bounceRate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Taux de conversion</p>
            <p className="text-2xl font-bold text-ink-900">
              {(sessionMetrics.conversionRate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Pages vues/session</p>
            <p className="text-2xl font-bold text-ink-900">
              {sessionMetrics.averagePageViews.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Interview Analytics */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Analytics Entretiens</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-ink-600">Durée moyenne</p>
            <p className="text-2xl font-bold text-ink-900">
              {Math.floor(interviewMetrics.averageDuration / 60)}m {Math.floor(interviewMetrics.averageDuration % 60)}s
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Taux d'abandon</p>
            <p className="text-2xl font-bold text-ink-900">
              {(interviewMetrics.abandonmentRate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Score moyen</p>
            <p className="text-2xl font-bold text-ink-900">
              {interviewMetrics.averageScore.toFixed(1)}/100
            </p>
          </div>
        </div>
        <div className="border-t border-ivoire-200 pt-4">
          <p className="text-sm font-medium text-ink-700 mb-2">Top postes</p>
          <div className="space-y-2">
            {interviewMetrics.interviewsByJobTitle.slice(0, 5).map((item) => (
              <div key={item.jobTitle} className="flex justify-between items-center">
                <span className="text-sm text-ink-600">{item.jobTitle}</span>
                <span className="text-sm font-medium text-ink-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel Analytics */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Analytics Funnels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-ink-600">Taux de conversion global</p>
            <p className="text-2xl font-bold text-ink-900">
              {(funnelMetrics.overallConversionRate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Plus gros drop-off</p>
            <p className="text-2xl font-bold text-ink-900">
              {funnelMetrics.biggestDropoffStep}
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Temps moyen funnel</p>
            <p className="text-2xl font-bold text-ink-900">
              {Math.floor(funnelMetrics.averageFunnelCompletionTime / 60)}s
            </p>
          </div>
        </div>
      </div>

      {/* Feature Usage */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Utilisation Fonctionnalités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-ink-600">Utilisations totales</p>
            <p className="text-2xl font-bold text-ink-900">{featureMetrics.totalFeatureUses}</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Taux d'adoption</p>
            <p className="text-2xl font-bold text-ink-900">
              {(featureMetrics.featureAdoptionRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="border-t border-ivoire-200 pt-4">
          <p className="text-sm font-medium text-ink-700 mb-2">Fonctionnalités les plus utilisées</p>
          <div className="space-y-2">
            {featureMetrics.mostUsedFeatures.slice(0, 5).map((item) => (
              <div key={item.featureName} className="flex justify-between items-center">
                <span className="text-sm text-ink-600">{item.featureName}</span>
                <span className="text-sm font-medium text-ink-900">{item.usageCount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Analytics */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Analytics Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-ink-600">NPS moyen</p>
            <p className="text-2xl font-bold text-ink-900">{feedbackMetrics.averageNPS.toFixed(1)}/10</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">CSAT moyen</p>
            <p className="text-2xl font-bold text-ink-900">{feedbackMetrics.averageCSAT.toFixed(1)}/5</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Taux de réponse</p>
            <p className="text-2xl font-bold text-ink-900">
              {(feedbackMetrics.responseRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="border-t border-ivoire-200 pt-4">
          <p className="text-sm font-medium text-ink-700 mb-2">Problèmes les plus courants</p>
          <div className="space-y-2">
            {feedbackMetrics.mostCommonIssues.slice(0, 5).map((item) => (
              <div key={item.category} className="flex justify-between items-center">
                <span className="text-sm text-ink-600">{item.category}</span>
                <span className="text-sm font-medium text-ink-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Events */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Heatmap Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-ink-600">Événements totaux</p>
            <p className="text-2xl font-bold text-ink-900">{heatmapMetrics.totalEvents}</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Profondeur scroll moyen</p>
            <p className="text-2xl font-bold text-ink-900">
              {(heatmapMetrics.scrollDepth.averageScrollDepth * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        <div className="border-t border-ivoire-200 pt-4">
          <p className="text-sm font-medium text-ink-700 mb-2">Éléments les plus cliqués</p>
          <div className="space-y-2">
            {heatmapMetrics.topClickedElements.slice(0, 5).map((item) => (
              <div key={item.elementSelector} className="flex justify-between items-center">
                <span className="text-sm text-ink-600">{item.elementSelector}</span>
                <span className="text-sm font-medium text-ink-900">{item.clickCount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Journey */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Parcours Utilisateur</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-ink-600">Parcours totaux</p>
            <p className="text-2xl font-bold text-ink-900">{journeyMetrics.totalJourneys}</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Étapes moyennes/parcours</p>
            <p className="text-2xl font-bold text-ink-900">
              {journeyMetrics.averageStepsPerJourney.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Taux de complétion</p>
            <p className="text-2xl font-bold text-ink-900">
              {(journeyMetrics.completionRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Retention Analytics */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Analytics Rétention</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-ink-600">Utilisateurs totaux</p>
            <p className="text-2xl font-bold text-ink-900">{retentionMetrics.totalUsers}</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Rétention J1</p>
            <p className="text-2xl font-bold text-ink-900">
              {(retentionMetrics.day1Retention * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Rétention J7</p>
            <p className="text-2xl font-bold text-ink-900">
              {(retentionMetrics.day7Retention * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Rétention J30</p>
            <p className="text-2xl font-bold text-ink-900">
              {(retentionMetrics.day30Retention * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

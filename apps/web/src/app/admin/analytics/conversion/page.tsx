import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ConversionService } from "@/lib/analytics/ConversionService"
import { FunnelService } from "@/lib/analytics/FunnelService"
import { EventType } from "@/types/events"

export const metadata: Metadata = {
  title: "Conversion Analytics – Trajectoire",
  description: "Dashboard d'analytics de conversion et funnel.",
}

export default async function ConversionAnalyticsPage() {
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

  // Calculate date range (last 30 days)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  // Get conversion stats
  const conversionStats = await ConversionService.getConversionStats(startDate, endDate)

  // Get funnel data
  const funnelData = await FunnelService.analyzeFunnel(startDate, endDate)

  // Get dropoff points
  const dropoffPoints = await FunnelService.getDropoffPoints(startDate, endDate)

  // Get average time between steps
  const timeBetweenSteps = await FunnelService.getAverageTimeBetweenSteps(startDate, endDate)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/analytics"
          className="inline-flex items-center text-sm text-ink-600 hover:text-ink-900 mb-4"
        >
          ← Retour aux analytics
        </Link>
        <h1 className="text-3xl font-bold text-ink-900 mb-2">Conversion Analytics</h1>
        <p className="text-ink-600">Analytics de conversion et funnel utilisateur (30 derniers jours).</p>
      </div>

      {/* Conversion Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">Inscriptions</p>
          <p className="text-3xl font-bold text-ink-900">{conversionStats.totalSignups}</p>
          <p className="text-xs text-ink-500 mt-2">
            {conversionStats.signupToEmailConfirmed.toFixed(1)}% → Email confirmé
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">CV Uploadés</p>
          <p className="text-3xl font-bold text-ink-900">{conversionStats.cvUploaded}</p>
          <p className="text-xs text-ink-500 mt-2">
            {conversionStats.emailConfirmedToCVUpload.toFixed(1)}% conversion
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">Premium Cliqués</p>
          <p className="text-3xl font-bold text-ink-900">{conversionStats.premiumClicked}</p>
          <p className="text-xs text-ink-500 mt-2">
            {conversionStats.cvUploadToPremiumClicked.toFixed(1)}% conversion
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">Upgrades Complétés</p>
          <p className="text-3xl font-bold text-ink-900">{conversionStats.upgradeCompleted}</p>
          <p className="text-xs text-ink-500 mt-2">
            {conversionStats.premiumClickedToUpgradeCompleted.toFixed(1)}% conversion
          </p>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Funnel Principal</h2>
        <div className="space-y-4">
          {funnelData.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ink-900">{step.step}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-ink-600">{step.count} utilisateurs</span>
                  <span className="text-sm font-semibold text-bronze-600">{step.percentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-full bg-ivoire-200 rounded-full h-2">
                <div
                  className="bg-bronze-600 h-2 rounded-full transition-all"
                  style={{ width: `${step.cumulativePercentage}%` }}
                />
              </div>
              {index < funnelData.length - 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2">
                  <div className="w-0.5 h-4 bg-ivoire-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dropoff Points */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Points d'Abandon</h2>
        <div className="space-y-3">
          {dropoffPoints.slice(0, 5).map((point) => (
            <div key={point.step} className="flex items-center justify-between">
              <span className="text-sm text-ink-600">{point.step}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-ink-600">{point.dropoffCount} utilisateurs</span>
                <span className={`text-sm font-semibold ${point.dropoffRate > 50 ? 'text-brick-600' : 'text-bronze-600'}`}>
                  {point.dropoffRate.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Between Steps */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Temps Moyen Entre Étapes</h2>
        <div className="space-y-3">
          {timeBetweenSteps.map((time) => (
            <div key={`${time.from}-${time.to}`} className="flex items-center justify-between">
              <span className="text-sm text-ink-600">{time.from} → {time.to}</span>
              <span className="text-sm font-semibold text-ink-900">
                {time.averageTime > 60
                  ? `${Math.floor(time.averageTime / 60)}h ${Math.floor(time.averageTime % 60)}m`
                  : `${Math.floor(time.averageTime)}m`
                }
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Conversion Stats */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Statistiques Détaillées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-ink-700 mb-3">Engagement</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-ink-600">Matching effectués</span>
                <span className="text-sm font-medium text-ink-900">{conversionStats.matchingDone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink-600">Copilot utilisé</span>
                <span className="text-sm font-medium text-ink-900">{conversionStats.copilotUsed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink-600">Recherches effectuées</span>
                <span className="text-sm font-medium text-ink-900">{conversionStats.searchDone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink-600">Fiches de poste uploadées</span>
                <span className="text-sm font-medium text-ink-900">{conversionStats.jobUploaded}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-ink-700 mb-3">Conversion Premium</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-ink-600">Upgrades commencés</span>
                <span className="text-sm font-medium text-ink-900">{conversionStats.upgradeStarted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink-600">Upgrades complétés</span>
                <span className="text-sm font-medium text-ink-900">{conversionStats.upgradeCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink-600">Taux complétion upgrade</span>
                <span className="text-sm font-medium text-ink-900">
                  {conversionStats.upgradeStarted > 0
                    ? ((conversionStats.upgradeCompleted / conversionStats.upgradeStarted) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

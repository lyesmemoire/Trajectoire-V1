import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "AI Quality Dashboard – Trajectoire",
  description: "Dashboard d'évaluation de la qualité de l'IA.",
}

export default async function AIQualityDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is admin (mock - should check role in production)
  const isAdmin = true; // Mock
  if (!isAdmin) {
    redirect("/dashboard")
  }

  // Mock data for the dashboard
  const qualityMetrics = {
    overallScore: 85,
    conversationScore: 82,
    promptScore: 88,
    coachingScore: 80,
    reportScore: 86,
  }

  const criteriaScores = {
    coherence: 8.5,
    relevance: 8.2,
    variety: 8.0,
    naturalness: 7.8,
    fluency: 8.5,
    personality: 8.0,
    realism: 7.5,
    listeningAbility: 8.2,
    followUpQuality: 8.0,
    silenceManagement: 8.5,
    stressManagement: 7.8,
    adaptation: 8.2,
    repetitionAvoidance: 8.0,
    cvRespect: 8.5,
    contextRespect: 8.2,
    difficultyRespect: 8.0,
  }

  const metricsData = {
    cost: 0.025,
    latency: 1200,
    hallucinationRate: 0.03,
    successRate: 0.92,
  }

  const regressionHistory = [
    { version: "1.0.0", score: 75, date: "2024-01-01" },
    { version: "1.1.0", score: 78, date: "2024-01-15" },
    { version: "1.2.0", score: 82, date: "2024-02-01" },
    { version: "1.3.0", score: 80, date: "2024-02-15" },
    { version: "1.4.0", score: 85, date: "2024-03-01" },
  ]

  const abTests = [
    { id: "1", name: "Prompt A vs B", status: "completed", winner: "A", confidence: 0.95 },
    { id: "2", name: "Model X vs Y", status: "running", winner: null, confidence: 0 },
    { id: "3", name: "Temperature 0.7 vs 0.9", status: "completed", winner: "B", confidence: 0.87 },
  ]

  const goldenDatasetCoverage = {
    totalScenarios: 100,
    coveredScenarios: 85,
    coverage: 0.85,
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-ink-600 hover:text-ink-900 mb-4"
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-bold text-ink-900 mb-2">AI Quality Dashboard</h1>
        <p className="text-ink-600">Vue d'ensemble de la qualité de l'intelligence artificielle.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">Score Global</p>
          <p className="text-3xl font-bold text-ink-900">{qualityMetrics.overallScore}/100</p>
          <p className="text-xs text-ink-500 mt-2">Qualité globale de l'IA</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">Score Conversation</p>
          <p className="text-3xl font-bold text-ink-900">{qualityMetrics.conversationScore}/100</p>
          <p className="text-xs text-ink-500 mt-2">Qualité des conversations</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">Score Prompt</p>
          <p className="text-3xl font-bold text-ink-900">{qualityMetrics.promptScore}/100</p>
          <p className="text-xs text-ink-500 mt-2">Qualité des prompts</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-ivoire-200">
          <p className="text-sm text-ink-600 mb-1">Score Coaching</p>
          <p className="text-3xl font-bold text-ink-900">{qualityMetrics.coachingScore}/100</p>
          <p className="text-xs text-ink-500 mt-2">Qualité du coaching</p>
        </div>
      </div>

      {/* Criteria Scores */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Scores par Critère</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(criteriaScores).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-ink-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-sm font-medium text-ink-900">{value.toFixed(1)}/10</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Métriques de Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-ink-600">Coût moyen</p>
            <p className="text-2xl font-bold text-ink-900">${metricsData.cost.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Latence moyenne</p>
            <p className="text-2xl font-bold text-ink-900">{metricsData.latency}ms</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Taux d'hallucination</p>
            <p className="text-2xl font-bold text-ink-900">{(metricsData.hallucinationRate * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Taux de succès</p>
            <p className="text-2xl font-bold text-ink-900">{(metricsData.successRate * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Regression History */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Historique des Régressions</h2>
        <div className="space-y-2">
          {regressionHistory.map((item) => (
            <div key={item.version} className="flex justify-between items-center">
              <span className="text-sm text-ink-600">Version {item.version}</span>
              <span className="text-sm font-medium text-ink-900">{item.score}/100</span>
            </div>
          ))}
        </div>
      </div>

      {/* A/B Tests */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Tests A/B</h2>
        <div className="space-y-2">
          {abTests.map((test) => (
            <div key={test.id} className="flex justify-between items-center">
              <span className="text-sm text-ink-600">{test.name}</span>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2 py-1 rounded ${
                  test.status === "completed" ? "bg-forest-100 text-forest-800" :
                  test.status === "running" ? "bg-ivoire-100 text-ink-800" :
                  "bg-ivoire-100 text-ink-800"
                }`}>
                  {test.status}
                </span>
                {test.winner && (
                  <span className="text-sm font-medium text-ink-900">
                    Winner: {test.winner} ({(test.confidence * 100).toFixed(0)}%)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Golden Dataset Coverage */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Couverture du Golden Dataset</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-ink-600">Scénarios totaux</p>
            <p className="text-2xl font-bold text-ink-900">{goldenDatasetCoverage.totalScenarios}</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Scénarios couverts</p>
            <p className="text-2xl font-bold text-ink-900">{goldenDatasetCoverage.coveredScenarios}</p>
          </div>
          <div>
            <p className="text-sm text-ink-600">Couverture</p>
            <p className="text-2xl font-bold text-ink-900">{(goldenDatasetCoverage.coverage * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Report Score */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Score Rapport</h2>
        <div className="flex justify-between items-center">
          <span className="text-sm text-ink-600">Qualité des rapports générés</span>
          <span className="text-2xl font-bold text-ink-900">{qualityMetrics.reportScore}/100</span>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Adaptive Intelligence Dashboard – Trajectoire",
  description: "Dashboard d'orchestration de l'intelligence adaptative.",
};

export default async function AdaptiveIntelligenceDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user is admin (mock - should check role in production)
  const isAdmin = true; // Mock
  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Mock data for the dashboard
  const orchestratorStats = {
    totalDecisions: 1250,
    totalExecutions: 1180,
    successfulExecutions: 1120,
    failedExecutions: 60,
    averageDecisionTime: 150,
    averageExecutionTime: 3200,
    averageValue: 0.75,
    enginesUsed: [
      "careerProfile",
      "weaknessDetector",
      "goalEngine",
      "recommendationEngine",
      "learningPath",
      "confidenceScore",
      "employability",
      "diagnostic",
      "conversationEngine",
      "personalityEngine",
      "evaluationEngine",
      "aiQualityPlatform",
    ],
    commonActions: {
      analyze: 450,
      recommend: 380,
      guide: 220,
      evaluate: 150,
      train: 80,
      adapt: 60,
      intervene: 40,
      report: 20,
    },
    commonEngines: {
      conversationEngine: 320,
      recommendationEngine: 280,
      evaluationEngine: 180,
      learningPath: 150,
      goalEngine: 120,
      weaknessDetector: 90,
      confidenceScore: 70,
      careerProfile: 50,
      personalityEngine: 40,
      employability: 30,
      diagnostic: 25,
      aiQualityPlatform: 15,
    },
  };

  const recentDecisions = [
    {
      id: "1",
      timestamp: "2024-03-15T10:30:00Z",
      userId: "user_1",
      priority: "critical",
      reasoning: "User experiencing high stress - immediate intervention required",
      expectedOutcome: "Reduced stress and improved user state",
      actionsCount: 2,
    },
    {
      id: "2",
      timestamp: "2024-03-15T10:15:00Z",
      userId: "user_2",
      priority: "high",
      reasoning: "User has low confidence - confidence building intervention needed",
      expectedOutcome: "Increased confidence and engagement",
      actionsCount: 2,
    },
    {
      id: "3",
      timestamp: "2024-03-15T10:00:00Z",
      userId: "user_3",
      priority: "medium",
      reasoning: "Periodic career profile analysis needed",
      expectedOutcome: "Updated career insights and recommendations",
      actionsCount: 2,
    },
  ];

  const engineStatus = [
    { engine: "careerProfile", status: "active", lastExecution: "2024-03-15T10:30:00Z", successRate: 0.98 },
    { engine: "weaknessDetector", status: "active", lastExecution: "2024-03-15T10:25:00Z", successRate: 0.95 },
    { engine: "goalEngine", status: "active", lastExecution: "2024-03-15T10:20:00Z", successRate: 0.97 },
    { engine: "recommendationEngine", status: "active", lastExecution: "2024-03-15T10:15:00Z", successRate: 0.96 },
    { engine: "learningPath", status: "active", lastExecution: "2024-03-15T10:10:00Z", successRate: 0.94 },
    { engine: "confidenceScore", status: "active", lastExecution: "2024-03-15T10:05:00Z", successRate: 0.93 },
    { engine: "employability", status: "active", lastExecution: "2024-03-15T10:00:00Z", successRate: 0.92 },
    { engine: "diagnostic", status: "active", lastExecution: "2024-03-15T09:55:00Z", successRate: 0.91 },
    { engine: "conversationEngine", status: "active", lastExecution: "2024-03-15T10:30:00Z", successRate: 0.99 },
    { engine: "personalityEngine", status: "active", lastExecution: "2024-03-15T09:50:00Z", successRate: 0.90 },
    { engine: "evaluationEngine", status: "active", lastExecution: "2024-03-15T10:25:00Z", successRate: 0.97 },
    { engine: "aiQualityPlatform", status: "active", lastExecution: "2024-03-15T10:30:00Z", successRate: 1.00 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Adaptive Intelligence Dashboard</h1>
        <p className="text-slate-600">Vue d'ensemble de l'orchestration de l'intelligence adaptative.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600 mb-1">Décisions Totales</p>
          <p className="text-3xl font-bold text-slate-900">{orchestratorStats.totalDecisions}</p>
          <p className="text-xs text-slate-500 mt-2">Décisions prises</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600 mb-1">Exécutions Totales</p>
          <p className="text-3xl font-bold text-slate-900">{orchestratorStats.totalExecutions}</p>
          <p className="text-xs text-slate-500 mt-2">Actions exécutées</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600 mb-1">Taux de Succès</p>
          <p className="text-3xl font-bold text-slate-900">
            {((orchestratorStats.successfulExecutions / orchestratorStats.totalExecutions) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-2">Exécutions réussies</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600 mb-1">Valeur Moyenne</p>
          <p className="text-3xl font-bold text-slate-900">{orchestratorStats.averageValue.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-2">Valeur estimée</p>
        </div>
      </div>

      {/* Timing Metrics */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Métriques de Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-600">Temps de Décision Moyen</p>
            <p className="text-2xl font-bold text-slate-900">{orchestratorStats.averageDecisionTime}ms</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Temps d'Exécution Moyen</p>
            <p className="text-2xl font-bold text-slate-900">{orchestratorStats.averageExecutionTime}ms</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Moteurs Utilisés</p>
            <p className="text-2xl font-bold text-slate-900">{orchestratorStats.enginesUsed.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Échecs</p>
            <p className="text-2xl font-bold text-slate-900">{orchestratorStats.failedExecutions}</p>
          </div>
        </div>
      </div>

      {/* Common Actions */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions les Plus Fréquentes</h2>
        <div className="space-y-2">
          {Object.entries(orchestratorStats.commonActions).map(([action, count]) => (
            <div key={action} className="flex justify-between items-center">
              <span className="text-sm text-slate-600 capitalize">{action}</span>
              <span className="text-sm font-medium text-slate-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Common Engines */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Moteurs les Plus Utilisés</h2>
        <div className="space-y-2">
          {Object.entries(orchestratorStats.commonEngines).map(([engine, count]) => (
            <div key={engine} className="flex justify-between items-center">
              <span className="text-sm text-slate-600 capitalize">{engine}</span>
              <span className="text-sm font-medium text-slate-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Decisions */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Décisions Récentes</h2>
        <div className="space-y-4">
          {recentDecisions.map((decision) => (
            <div key={decision.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">{decision.reasoning}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(decision.timestamp).toLocaleString()} - {decision.userId}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  decision.priority === "critical" ? "bg-red-100 text-red-800" :
                  decision.priority === "high" ? "bg-orange-100 text-orange-800" :
                  decision.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {decision.priority}
                </span>
              </div>
              <p className="text-sm text-slate-600">{decision.expectedOutcome}</p>
              <p className="text-xs text-slate-500 mt-1">{decision.actionsCount} actions</p>
            </div>
          ))}
        </div>
      </div>

      {/* Engine Status */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Statut des Moteurs</h2>
        <div className="space-y-2">
          {engineStatus.map((engine) => (
            <div key={engine.engine} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  engine.status === "active" ? "bg-green-500" : "bg-gray-400"
                }`} />
                <span className="text-sm text-slate-600 capitalize">{engine.engine}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">
                  {(engine.successRate * 100).toFixed(0)}% succès
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(engine.lastExecution).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

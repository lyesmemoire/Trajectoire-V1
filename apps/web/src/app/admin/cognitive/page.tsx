/**
 * Cognitive Dashboard
 * Admin dashboard for cognitive intelligence visualization
 */

import { worldModelEngine } from "@/application/cognitive-intelligence/world-model/WorldModelEngine"
import { reasoningEngine } from "@/application/cognitive-intelligence/reasoning/ReasoningEngine"
import { reflectionEngine } from "@/application/cognitive-intelligence/reflection/ReflectionEngine"
import { multiAgentCollaborationService } from "@/application/cognitive-intelligence/multi-agent/MultiAgentCollaborationService"
import { hierarchicalMemoryEngine } from "@/application/cognitive-intelligence/hierarchical-memory/HierarchicalMemoryEngine"
import { metaCognitionEngine } from "@/application/cognitive-intelligence/meta-cognition/MetaCognitionEngine"

export default async function CognitiveDashboardPage() {
  // Get statistics from all cognitive engines
  const worldModelStats = worldModelEngine.getStatistics()
  const reasoningStats = reasoningEngine.getStatistics()
  const reflectionStats = reflectionEngine.getStatistics()
  const multiAgentStats = multiAgentCollaborationService.getStatistics()
  const memoryStats = hierarchicalMemoryEngine.getStatistics()
  const metaCognitionStats = metaCognitionEngine.getStatistics()
  const latestReport = metaCognitionEngine.getLatestReport()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Cognitive Intelligence Dashboard</h1>
          <p className="text-ink-600 mt-1">Real-time monitoring of cognitive systems</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            latestReport?.healthStatus === "healthy" ? "bg-forest-100 text-forest-700" :
            latestReport?.healthStatus === "degraded" ? "bg-terracotta-100 text-terracotta-700" :
            "bg-brick-100 text-brick-700"
          }`}>
            {latestReport?.healthStatus || "Unknown"}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-ivoire-100 text-ink-700">
            Health: {((latestReport?.overallHealth || 0) * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* World Model */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-2">World Model</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Total Skills</span>
              <span className="font-medium">{worldModelStats.totalSkills}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Total Jobs</span>
              <span className="font-medium">{worldModelStats.totalJobs}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Total Companies</span>
              <span className="font-medium">{worldModelStats.totalCompanies}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Total Edges</span>
              <span className="font-medium">{worldModelStats.totalEdges}</span>
            </div>
          </div>
        </div>

        {/* Reasoning Engine */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-2">Reasoning Engine</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Total Traces</span>
              <span className="font-medium">{reasoningStats.totalTraces}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Avg Confidence</span>
              <span className="font-medium">{(reasoningStats.averageConfidence * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Avg Duration</span>
              <span className="font-medium">{reasoningStats.averageDuration.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Success Rate</span>
              <span className="font-medium">{(reasoningStats.successRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Reflection Engine */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-2">Reflection Engine</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Total Reports</span>
              <span className="font-medium">{reflectionStats.totalReports}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Total Insights</span>
              <span className="font-medium">{reflectionStats.totalInsights}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Learning Events</span>
              <span className="font-medium">{reflectionStats.totalLearningEvents}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Avg Rating</span>
              <span className="font-medium">{(reflectionStats.averageRating * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Multi-Agent Collaboration */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-2">Multi-Agent Collaboration</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Total Agents</span>
              <span className="font-medium">{multiAgentStats.totalAgents}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Conversations</span>
              <span className="font-medium">{multiAgentStats.totalConversations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Events</span>
              <span className="font-medium">{multiAgentStats.totalEvents}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Avg Priority</span>
              <span className="font-medium">{multiAgentStats.averagePriority.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Hierarchical Memory */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-2">Hierarchical Memory</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Total Memories</span>
              <span className="font-medium">{memoryStats.totalMemories}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Memory Links</span>
              <span className="font-medium">{memoryStats.totalLinks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Consolidations</span>
              <span className="font-medium">{memoryStats.totalConsolidations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Avg Importance</span>
              <span className="font-medium">{(memoryStats.averageImportance * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Meta Cognition */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-2">Meta Cognition</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Total Reports</span>
              <span className="font-medium">{metaCognitionStats.totalReports}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Proposals</span>
              <span className="font-medium">{metaCognitionStats.totalProposals}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Avg Health</span>
              <span className="font-medium">{(metaCognitionStats.averageHealth * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Healthy</span>
              <span className="font-medium">{metaCognitionStats.healthDistribution.healthy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reasoning Stage Distribution */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Reasoning Stage Distribution</h3>
          <div className="space-y-3">
            {Object.entries(reasoningStats.stageDistribution).map(([stage, count]) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="w-32 text-sm text-ink-600 capitalize">{stage.replace(/_/g, " ")}</div>
                <div className="flex-1 bg-ivoire-100 rounded-full h-2">
                  <div
                    className="bg-ink-800 h-2 rounded-full"
                    style={{ width: `${(count / reasoningStats.totalTraces) * 100}%` }}
                  />
                </div>
                <div className="text-sm font-medium w-12 text-right">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Insight Distribution */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Insight Distribution</h3>
          <div className="space-y-3">
            {Object.entries(reflectionStats.insightDistribution).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <div className="w-32 text-sm text-ink-600 capitalize">{type.replace(/_/g, " ")}</div>
                <div className="flex-1 bg-ivoire-100 rounded-full h-2">
                  <div
                    className="bg-forest-600 h-2 rounded-full"
                    style={{ width: `${(count / reflectionStats.totalInsights) * 100}%` }}
                  />
                </div>
                <div className="text-sm font-medium w-12 text-right">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Type Distribution */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Memory Type Distribution</h3>
          <div className="space-y-3">
            {Object.entries(memoryStats.memoriesByType).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <div className="w-32 text-sm text-ink-600 capitalize">{type.replace(/_/g, " ")}</div>
                <div className="flex-1 bg-ivoire-100 rounded-full h-2">
                  <div
                    className="bg-ink-600 h-2 rounded-full"
                    style={{ width: `${(count / memoryStats.totalMemories) * 100}%` }}
                  />
                </div>
                <div className="text-sm font-medium w-12 text-right">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Event Distribution */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Learning Event Distribution</h3>
          <div className="space-y-3">
            {Object.entries(reflectionStats.learningEventDistribution).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3">
                <div className="w-32 text-sm text-ink-600 capitalize">{type.replace(/_/g, " ")}</div>
                <div className="flex-1 bg-ivoire-100 rounded-full h-2">
                  <div
                    className="bg-terracotta-600 h-2 rounded-full"
                    style={{ width: `${(count / reflectionStats.totalLearningEvents) * 100}%` }}
                  />
                </div>
                <div className="text-sm font-medium w-12 text-right">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts and Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Recent Alerts</h3>
          {latestReport?.alerts && latestReport.alerts.length > 0 ? (
            <div className="space-y-2">
              {latestReport.alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-brick-50 rounded-lg border border-brick-100">
                  <span className="text-brick-600 mt-0.5">⚠</span>
                  <span className="text-sm text-brick-800">{alert}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-500">No active alerts</p>
          )}
        </div>

        {/* Improvement Proposals */}
        <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Improvement Proposals</h3>
          {latestReport?.improvementProposals && latestReport.improvementProposals.length > 0 ? (
            <div className="space-y-2">
              {latestReport.improvementProposals.slice(0, 5).map((proposal) => (
                <div key={proposal.id} className="p-3 bg-ivoire-50 rounded-lg border border-ivoire-200">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-ink-900 capitalize">{proposal.metricType.replace(/_/g, " ")}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      proposal.status === "pending" ? "bg-terracotta-100 text-terracotta-700" :
                      proposal.status === "in_progress" ? "bg-ivoire-100 text-ink-700" :
                      proposal.status === "implemented" ? "bg-forest-100 text-forest-700" :
                      "bg-ivoire-100 text-ink-700"
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink-700">{proposal.description}</p>
                  <p className="text-xs text-ink-600 mt-1">Priority: {proposal.priority}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-500">No pending proposals</p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-lg border border-ivoire-200 shadow-sm">
        <h3 className="text-lg font-semibold text-ink-900 mb-4">System Summary</h3>
        <p className="text-sm text-ink-600">{latestReport?.summary || "No summary available"}</p>
      </div>
    </div>
  )
}

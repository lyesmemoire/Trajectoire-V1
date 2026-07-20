/**
 * AI Operating System Dashboard
 * Main cockpit for autonomous AI operations
 */

import { globalExecutionGraph } from "@/application/ai-operating-system/global-execution-graph/GlobalExecutionGraph";
import { aiLifecycleManager } from "@/application/ai-operating-system/lifecycle-manager/AILifecycleManager";
import { decisionExplainabilityEngine } from "@/application/ai-operating-system/decision-explainability/DecisionExplainabilityEngine";
import { autonomousOptimizationEngine } from "@/application/ai-operating-system/autonomous-optimization/AutonomousOptimizationEngine";
import { aiGovernanceEngine } from "@/application/ai-operating-system/governance/AIGovernanceEngine";
import { continuousImprovementEngine } from "@/application/ai-operating-system/continuous-improvement/ContinuousImprovementEngine";
import { aiHealthMonitor } from "@/application/ai-operating-system/health-monitor/AIHealthMonitor";
import { aiTimelineEngine } from "@/application/ai-operating-system/timeline-engine/AITimelineEngine";
import { enterpriseObservabilityPlatform } from "@/application/ai-operating-system/observability/EnterpriseObservabilityPlatform";
import { productEvolutionEngine } from "@/application/ai-operating-system/product-evolution/ProductEvolutionEngine";

export default async function AIOperatingSystemDashboardPage() {
  // Get statistics from all AI OS engines
  const executionGraphStats = globalExecutionGraph.getStatistics();
  const lifecycleStats = aiLifecycleManager.getMetrics();
  const explainabilityStats = decisionExplainabilityEngine.getMetrics();
  const optimizationStats = autonomousOptimizationEngine.getMetrics();
  const governanceStats = aiGovernanceEngine.getMetrics();
  const improvementStats = continuousImprovementEngine.getMetrics();
  const healthSnapshot = aiHealthMonitor.getLatestSnapshot();
  const timelineStats = aiTimelineEngine.getMetrics();
  const observabilityStats = enterpriseObservabilityPlatform.getMetricsSummary();
  const evolutionStats = productEvolutionEngine.getMetrics();
  const latestRoadmap = productEvolutionEngine.getLatestRoadmap();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Operating System Dashboard</h1>
          <p className="text-slate-600 mt-1">Autonomous AI Operations Cockpit</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            healthSnapshot?.healthStatus === "healthy" ? "bg-green-100 text-green-700" :
            healthSnapshot?.healthStatus === "degraded" ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          }`}>
            {healthSnapshot?.healthStatus || "Unknown"}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            Health: {((healthSnapshot?.overallHealth || 0) * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Global Intelligence Score */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Global Intelligence Score</h2>
            <p className="text-blue-100 mt-1">Overall AI system performance</p>
          </div>
          <div className="text-5xl font-bold">
            {((healthSnapshot?.globalIntelligenceScore || 0) * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Engine Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Execution Graph */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Execution Graph</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Graphs</span>
              <span className="font-medium">{executionGraphStats.totalGraphs}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Executions</span>
              <span className="font-medium">{executionGraphStats.totalExecutions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Success Rate</span>
              <span className="font-medium">{(executionGraphStats.successRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Avg Duration</span>
              <span className="font-medium">{executionGraphStats.averageExecutionTime.toFixed(0)}ms</span>
            </div>
          </div>
        </div>

        {/* Lifecycle Manager */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Lifecycle Manager</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Lifecycles</span>
              <span className="font-medium">{lifecycleStats.totalLifecycles}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Active</span>
              <span className="font-medium">{lifecycleStats.activeLifecycles}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Completed</span>
              <span className="font-medium">{lifecycleStats.completedLifecycles}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Avg Confidence</span>
              <span className="font-medium">{(lifecycleStats.averageConfidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Explainability */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Explainability</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Explanations</span>
              <span className="font-medium">{explainabilityStats.totalExplanations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Avg Confidence</span>
              <span className="font-medium">{(explainabilityStats.averageConfidence * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Avg Evidence</span>
              <span className="font-medium">{explainabilityStats.averageEvidence.toFixed(1)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Clarity Score</span>
              <span className="font-medium">{(explainabilityStats.clarityScore * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Optimization */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Optimization</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Inefficiencies</span>
              <span className="font-medium">{optimizationStats.totalInefficiencies}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Proposals</span>
              <span className="font-medium">{optimizationStats.totalProposals}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Implemented</span>
              <span className="font-medium">{optimizationStats.totalImplemented}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Savings</span>
              <span className="font-medium">${optimizationStats.totalSavings.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Scores Grid */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Engine Health Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {healthSnapshot && (
            <>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Reasoning</div>
                <div className="text-2xl font-bold text-blue-600">{(healthSnapshot.reasoningScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Memory</div>
                <div className="text-2xl font-bold text-green-600">{(healthSnapshot.memoryScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Planning</div>
                <div className="text-2xl font-bold text-purple-600">{(healthSnapshot.planningScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Conversation</div>
                <div className="text-2xl font-bold text-orange-600">{(healthSnapshot.conversationScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Recommendation</div>
                <div className="text-2xl font-bold text-pink-600">{(healthSnapshot.recommendationScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Reflection</div>
                <div className="text-2xl font-bold text-teal-600">{(healthSnapshot.reflectionScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Cost</div>
                <div className="text-2xl font-bold text-red-600">{(healthSnapshot.costScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Product</div>
                <div className="text-2xl font-bold text-indigo-600">{(healthSnapshot.productScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Execution</div>
                <div className="text-2xl font-bold text-cyan-600">{(healthSnapshot.executionScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Governance</div>
                <div className="text-2xl font-bold text-amber-600">{(healthSnapshot.governanceScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Optimization</div>
                <div className="text-2xl font-bold text-lime-600">{(healthSnapshot.optimizationScore * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Explainability</div>
                <div className="text-2xl font-bold text-rose-600">{(healthSnapshot.explainabilityScore * 100).toFixed(0)}%</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Governance and Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Governance */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Governance</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Policies</span>
              <span className="font-medium">{governanceStats.totalPolicies}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Active Policies</span>
              <span className="font-medium">{governanceStats.activePolicies}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Validations</span>
              <span className="font-medium">{governanceStats.totalValidations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Passed Validations</span>
              <span className="font-medium">{governanceStats.passedValidations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Violations</span>
              <span className="font-medium">{governanceStats.totalViolations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Auto-Correction Rate</span>
              <span className="font-medium">{(governanceStats.autoCorrectionRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Average Score</span>
              <span className="font-medium">{(governanceStats.averageScore * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Continuous Improvement */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Continuous Improvement</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Sessions</span>
              <span className="font-medium">{improvementStats.totalSessions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Learning Events</span>
              <span className="font-medium">{improvementStats.totalLearningEvents}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Improvement Actions</span>
              <span className="font-medium">{improvementStats.totalImprovementActions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Applied Actions</span>
              <span className="font-medium">{improvementStats.totalAppliedActions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Average Improvement</span>
              <span className="font-medium">{(improvementStats.averageImprovement * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Success Rate</span>
              <span className="font-medium">{(improvementStats.successRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Average Confidence</span>
              <span className="font-medium">{(improvementStats.averageConfidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline and Observability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Timeline Engine</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Events</span>
              <span className="font-medium">{timelineStats.totalEvents}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Segments</span>
              <span className="font-medium">{timelineStats.totalSegments}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Comparisons</span>
              <span className="font-medium">{timelineStats.totalComparisons}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Avg Events/Segment</span>
              <span className="font-medium">{timelineStats.averageEventsPerSegment.toFixed(1)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Avg Impact</span>
              <span className="font-medium">{(timelineStats.averageImpact * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Avg Confidence</span>
              <span className="font-medium">{(timelineStats.averageConfidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Observability */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Observability Platform</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Traces</span>
              <span className="font-medium">{observabilityStats.totalTraces}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Spans</span>
              <span className="font-medium">{observabilityStats.totalSpans}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Logs</span>
              <span className="font-medium">{observabilityStats.totalLogs}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Metrics</span>
              <span className="font-medium">{observabilityStats.totalMetrics}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Avg Trace Duration</span>
              <span className="font-medium">{observabilityStats.averageTraceDuration.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Error Rate</span>
              <span className="font-medium">{(observabilityStats.errorRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Success Rate</span>
              <span className="font-medium">{(observabilityStats.successRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Evolution */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Evolution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Total Roadmaps</span>
            <span className="font-medium">{evolutionStats.totalRoadmaps}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Evolution Items</span>
            <span className="font-medium">{evolutionStats.totalEvolutionItems}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Completed</span>
            <span className="font-medium">{evolutionStats.totalCompletedItems}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Rejected</span>
            <span className="font-medium">{evolutionStats.totalRejectedItems}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Avg ROI</span>
            <span className="font-medium">{(evolutionStats.averageROI * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Success Rate</span>
            <span className="font-medium">{(evolutionStats.successRate * 100).toFixed(1)}%</span>
          </div>
        </div>

        {latestRoadmap && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">Latest Roadmap: {latestRoadmap.week}</h4>
            <p className="text-sm text-slate-600">{latestRoadmap.summary}</p>
            <div className="mt-2 flex gap-4 text-sm">
              <span>Expected ROI: {(latestRoadmap.expectedROI * 100).toFixed(0)}%</span>
              <span>Expected Impact: {(latestRoadmap.expectedImpact * 100).toFixed(0)}%</span>
              <span>Total Effort: {(latestRoadmap.totalEffort * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Cost Monitoring */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Monitoring</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">Avg Execution Cost</div>
            <div className="text-2xl font-bold text-slate-900">${executionGraphStats.averageExecutionCost.toFixed(2)}</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">Avg Lifecycle Cost</div>
            <div className="text-2xl font-bold text-slate-900">${lifecycleStats.averageCost.toFixed(2)}</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">Total Savings</div>
            <div className="text-2xl font-bold text-green-600">${optimizationStats.totalSavings.toFixed(2)}</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">Avg Observability Cost</div>
            <div className="text-2xl font-bold text-slate-900">${observabilityStats.averageCost.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Alerts and Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Alerts */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Health Alerts</h3>
          <div className="space-y-2">
            {aiHealthMonitor.getActiveAlerts().slice(0, 5).map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg border ${
                alert.severity === "critical" ? "bg-red-50 border-red-200" :
                alert.severity === "error" ? "bg-orange-50 border-orange-200" :
                alert.severity === "warning" ? "bg-yellow-50 border-yellow-200" :
                "bg-blue-50 border-blue-200"
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-sm">{alert.componentName}</span>
                    <p className="text-sm mt-1">{alert.message}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert.acknowledged ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {alert.acknowledged ? "Acknowledged" : "New"}
                  </span>
                </div>
              </div>
            ))}
            {aiHealthMonitor.getActiveAlerts().length === 0 && (
              <p className="text-sm text-slate-500">No active alerts</p>
            )}
          </div>
        </div>

        {/* Optimization Proposals */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Optimization Proposals</h3>
          <div className="space-y-2">
            {autonomousOptimizationEngine.getProposals().slice(0, 5).map(proposal => (
              <div key={proposal.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-sm capitalize">{proposal.type}</span>
                    <p className="text-sm mt-1">{proposal.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    proposal.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    proposal.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                    proposal.status === "implemented" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {proposal.status}
                  </span>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-slate-600">
                  <span>Priority: {proposal.priority}</span>
                  <span>Expected Savings: ${proposal.expectedSavings.toFixed(2)}</span>
                </div>
              </div>
            ))}
            {autonomousOptimizationEngine.getProposals().length === 0 && (
              <p className="text-sm text-slate-500">No pending proposals</p>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-700">Execution Graph: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-700">Lifecycle Manager: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-700">Health Monitor: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-700">Observability: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

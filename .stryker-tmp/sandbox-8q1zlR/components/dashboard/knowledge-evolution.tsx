// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/design-system";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, ArrowUp, ArrowDown, BarChart3, PieChart, Settings, RefreshCw, Shield, Search, Plus, Minus, BookOpen, Lightbulb, Archive, Clock, Flame, EyeOff, Star, AlertCircle, ChevronRight, ChevronDown } from "lucide-react";

interface KnowledgeEvolutionProps {
  knowledge: {
    knowledgeSummary: {
      totalKnowledge: number;
      confirmedCount: number;
      strengthenedCount: number;
      fragilizedCount: number;
      obsoleteCount: number;
      replacedCount: number;
      veryReliableCount: number;
      veryUncertainCount: number;
      recentlyLearnedCount: number;
      neverReusedCount: number;
      healthScore: number;
      averageConfidence: number;
      averageFreshness: number;
    };
    knowledgeByState: Array<{
      state: "confirmed" | "strengthened" | "fragilized" | "obsolete" | "replaced" | "very_reliable" | "very_uncertain" | "recently_learned" | "never_reused";
      knowledgeItems: Array<{
        id: string;
        description: string;
        origin: string;
        sourceEngine: string;
        learnedDate: string;
        evidence: {
          supportingCount: number;
          contradictingCount: number;
          quality: "high" | "medium" | "low";
          recency: string;
        };
        freshness: {
          lastConfirmation: string;
          lastContradiction: string;
          lastApplication: string;
          age: string;
        };
        stability: {
          consistency: number;
          volatility: number;
          resistance: number;
          robustness: number;
        };
        reuse: {
          applicationCount: number;
          referenceCount: number;
          successCount: number;
          failureCount: number;
        };
        impact: {
          scope: "broad" | "medium" | "narrow";
          criticality: "high" | "medium" | "low";
          dependencyCount: number;
          influence: number;
        };
        confidence: {
          current: number;
          trend: "increasing" | "decreasing" | "stable";
          volatility: number;
          justification: string;
        };
        importance: number;
        reasonForState: string;
      }>;
      count: number;
    }>;
    knowledgeActions: {
      toKeep: string[];
      toStrengthen: string[];
      toConfirm: string[];
      toReplace: string[];
      toAbandon: string[];
    };
    detectedIssues: {
      uselessRules: string[];
      unusedKnowledge: string[];
      outdatedKnowledge: string[];
      criticalKnowledge: string[];
    };
    knowledgeEvolution: {
      newKnowledge: string[];
      strengthenedKnowledge: string[];
      weakenedKnowledge: string[];
      obsoleteKnowledge: string[];
      replacedKnowledge: string[];
    };
    mostImportantKnowledge: Array<{
      id: string;
      description: string;
      importance: number;
      confidence: number;
      impact: string;
      reason: string;
    }>;
    knowledgeHealthTrends: {
      overallTrend: "improving" | "stable" | "declining";
      confidenceTrend: "increasing" | "stable" | "decreasing";
      freshnessTrend: "improving" | "stable" | "declining";
      stabilityTrend: "increasing" | "stable" | "decreasing";
    };
  };
}

const getStateIcon = (state: string) => {
  switch (state) {
    case "confirmed":
      return <CheckCircle className="w-4 h-4" />;
    case "strengthened":
      return <TrendingUp className="w-4 h-4" />;
    case "fragilized":
      return <TrendingDown className="w-4 h-4" />;
    case "obsolete":
      return <Archive className="w-4 h-4" />;
    case "replaced":
      return <RefreshCw className="w-4 h-4" />;
    case "very_reliable":
      return <Shield className="w-4 h-4" />;
    case "very_uncertain":
      return <AlertTriangle className="w-4 h-4" />;
    case "recently_learned":
      return <Lightbulb className="w-4 h-4" />;
    case "never_reused":
      return <EyeOff className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

const getStateColor = (state: string) => {
  switch (state) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "strengthened":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "fragilized":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "obsolete":
      return "bg-red-100 text-red-800 border-red-200";
    case "replaced":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "very_reliable":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "very_uncertain":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "recently_learned":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "never_reused":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "improving":
    case "increasing":
      return <ArrowUp className="w-3 h-3 text-green-600" />;
    case "declining":
    case "decreasing":
      return <ArrowDown className="w-3 h-3 text-red-600" />;
    case "stable":
      return <Minus className="w-3 h-3 text-gray-600" />;
    default:
      return <Minus className="w-3 h-3 text-gray-600" />;
  }
};

const getCriticalityColor = (criticality: string) => {
  switch (criticality) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const KnowledgeEvolution: React.FC<KnowledgeEvolutionProps> = ({ knowledge }) => {
  const [expandedState, setExpandedState] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Knowledge Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{knowledge.knowledgeSummary.healthScore}/100</div>
              <div className="text-sm text-gray-600">Overall Health</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {getTrendIcon(knowledge.knowledgeHealthTrends.overallTrend)}
                <span className="text-xs text-gray-500">{knowledge.knowledgeHealthTrends.overallTrend}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{Math.round(knowledge.knowledgeSummary.averageConfidence * 100)}%</div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {getTrendIcon(knowledge.knowledgeHealthTrends.confidenceTrend)}
                <span className="text-xs text-gray-500">{knowledge.knowledgeHealthTrends.confidenceTrend}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{Math.round(knowledge.knowledgeSummary.averageFreshness * 100)}%</div>
              <div className="text-sm text-gray-600">Avg Freshness</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {getTrendIcon(knowledge.knowledgeHealthTrends.freshnessTrend)}
                <span className="text-xs text-gray-500">{knowledge.knowledgeHealthTrends.freshnessTrend}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Knowledge Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{knowledge.knowledgeSummary.confirmedCount}</div>
              <div className="text-xs text-gray-600">Confirmed</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{knowledge.knowledgeSummary.strengthenedCount}</div>
              <div className="text-xs text-gray-600">Strengthened</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{knowledge.knowledgeSummary.fragilizedCount}</div>
              <div className="text-xs text-gray-600">Fragilized</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{knowledge.knowledgeSummary.obsoleteCount}</div>
              <div className="text-xs text-gray-600">Obsolete</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{knowledge.knowledgeSummary.replacedCount}</div>
              <div className="text-xs text-gray-600">Replaced</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{knowledge.knowledgeSummary.veryReliableCount}</div>
              <div className="text-xs text-gray-600">Very Reliable</div>
            </div>
            <div className="text-center p-3 bg-rose-50 rounded-lg">
              <div className="text-2xl font-bold text-rose-600">{knowledge.knowledgeSummary.veryUncertainCount}</div>
              <div className="text-xs text-gray-600">Very Uncertain</div>
            </div>
            <div className="text-center p-3 bg-cyan-50 rounded-lg">
              <div className="text-2xl font-bold text-cyan-600">{knowledge.knowledgeSummary.recentlyLearnedCount}</div>
              <div className="text-xs text-gray-600">Recently Learned</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2">
              <div className="text-2xl font-bold text-gray-600">{knowledge.knowledgeSummary.neverReusedCount}</div>
              <div className="text-xs text-gray-600">Never Reused</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge by State */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Knowledge by State
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {knowledge.knowledgeByState.map((stateGroup) => (
            <div key={stateGroup.state} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedState(expandedState === stateGroup.state ? null : stateGroup.state)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStateIcon(stateGroup.state)}
                  <span className="font-medium capitalize">{stateGroup.state.replace(/_/g, " ")}</span>
                  <Badge className={getStateColor(stateGroup.state)}>{stateGroup.count}</Badge>
                </div>
                {expandedState === stateGroup.state ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {expandedState === stateGroup.state && (
                <div className="p-4 space-y-3 border-t">
                  {stateGroup.knowledgeItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="p-3 bg-white rounded border">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Source: {item.sourceEngine} • Confidence: {Math.round(item.confidence.current * 100)}%
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{item.reasonForState}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getCriticalityColor(item.impact.criticality)}>
                            {item.impact.criticality}
                          </Badge>
                          <div className="text-xs text-gray-500">Importance: {Math.round(item.importance * 100)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stateGroup.knowledgeItems.length > 5 && (
                    <div className="text-center text-sm text-gray-500">
                      +{stateGroup.knowledgeItems.length - 5} more items
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Knowledge Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {knowledge.knowledgeActions.toKeep.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm">To Keep ({knowledge.knowledgeActions.toKeep.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.knowledgeActions.toKeep.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-gray-600 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
          {knowledge.knowledgeActions.toStrengthen.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">To Strengthen ({knowledge.knowledgeActions.toStrengthen.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.knowledgeActions.toStrengthen.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-gray-600 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
          {knowledge.knowledgeActions.toConfirm.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-sm">To Confirm ({knowledge.knowledgeActions.toConfirm.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.knowledgeActions.toConfirm.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-gray-600 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
          {knowledge.knowledgeActions.toReplace.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-sm">To Replace ({knowledge.knowledgeActions.toReplace.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.knowledgeActions.toReplace.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-gray-600 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
          {knowledge.knowledgeActions.toAbandon.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-sm">To Abandon ({knowledge.knowledgeActions.toAbandon.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.knowledgeActions.toAbandon.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-gray-600 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detected Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Detected Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {knowledge.detectedIssues.criticalKnowledge.length > 0 && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-sm text-red-800">Critical Knowledge ({knowledge.detectedIssues.criticalKnowledge.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.detectedIssues.criticalKnowledge.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-red-700 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
          {knowledge.detectedIssues.outdatedKnowledge.length > 0 && (
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-sm text-orange-800">Outdated Knowledge ({knowledge.detectedIssues.outdatedKnowledge.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.detectedIssues.outdatedKnowledge.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-orange-700 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
          {knowledge.detectedIssues.unusedKnowledge.length > 0 && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <EyeOff className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-sm text-yellow-800">Unused Knowledge ({knowledge.detectedIssues.unusedKnowledge.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.detectedIssues.unusedKnowledge.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-yellow-700 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
          {knowledge.detectedIssues.uselessRules.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-sm text-gray-800">Useless Rules ({knowledge.detectedIssues.uselessRules.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.detectedIssues.uselessRules.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-gray-700 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Knowledge Evolution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Knowledge Evolution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {knowledge.knowledgeEvolution.newKnowledge.length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm text-green-800">New Knowledge ({knowledge.knowledgeEvolution.newKnowledge.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.knowledgeEvolution.newKnowledge.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-green-700 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
          {knowledge.knowledgeEvolution.strengthenedKnowledge.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm text-blue-800">Strengthened ({knowledge.knowledgeEvolution.strengthenedKnowledge.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.knowledgeEvolution.strengthenedKnowledge.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-blue-700 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
          {knowledge.knowledgeEvolution.weakenedKnowledge.length > 0 && (
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-sm text-orange-800">Weakened ({knowledge.knowledgeEvolution.weakenedKnowledge.length})</span>
              </div>
              <div className="space-y-1">
                {knowledge.knowledgeEvolution.weakenedKnowledge.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-orange-700 pl-6">• {item}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Most Important Knowledge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Most Important Knowledge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {knowledge.mostImportantKnowledge.slice(0, 5).map((item) => (
              <div key={item.id} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.reason}</div>
                    <div className="text-xs text-gray-400 mt-1">Impact: {item.impact}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-sm font-bold text-blue-600">{Math.round(item.importance * 100)}%</div>
                    <div className="text-xs text-gray-500">Confidence: {Math.round(item.confidence * 100)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

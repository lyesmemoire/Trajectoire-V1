"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Lightbulb, Info, TrendingUp, Target } from "lucide-react";

export interface RecommendationExplanation {
  recommendation: string;
  origin: string;
  explanation: string;
  expectedImpact: string;
  confidence: number;
  strategyChange?: {
    hasChanged: boolean;
    oldStrategy: string;
    newStrategy: string;
    reason: string;
  };
  priorityDecision?: {
    absolutePriority: string;
    priorityReason: string;
    whyNotOthers: string;
    whyNow: string;
  };
  followUpExplanation?: {
    action: string;
    explanation: string;
    urgency: "high" | "medium" | "low";
  };
}

export interface WhyRecommendationProps {
  recommendations: RecommendationExplanation[];
}

export function WhyRecommendation({ recommendations }: WhyRecommendationProps) {
  const getOriginIcon = (origin: string) => {
    switch (origin.toLowerCase()) {
      case "interview":
        return <Target className="w-4 h-4 text-blue-600" />;
      case "ats":
        return <Info className="w-4 h-4 text-purple-600" />;
      case "career analysis":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "forecast":
        return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      case "digital twin":
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getOriginColor = (origin: string) => {
    switch (origin.toLowerCase()) {
      case "interview":
        return "text-blue-600 bg-blue-50";
      case "ats":
        return "text-purple-600 bg-purple-50";
      case "career analysis":
        return "text-green-600 bg-green-50";
      case "forecast":
        return "text-indigo-600 bg-indigo-50";
      case "digital twin":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-50";
    if (confidence >= 60) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Pourquoi cette recommandation ?
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Recommendation */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 mb-1">Recommandation</p>
                <p className="text-base font-bold text-gray-900">{rec.recommendation}</p>
              </div>

              {/* Origin */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 mb-1">Origine</p>
                <div className="flex items-center gap-2">
                  {getOriginIcon(rec.origin)}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getOriginColor(rec.origin)}`}>
                    {rec.origin}
                  </span>
                </div>
              </div>

              {/* Explanation */}
              {rec.explanation && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Explication</p>
                  <p className="text-sm text-gray-700">{rec.explanation}</p>
                </div>
              )}

              {/* Expected Impact */}
              {rec.expectedImpact && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Impact attendu</p>
                  <p className="text-sm text-gray-700">{rec.expectedImpact}</p>
                </div>
              )}

              {/* Confidence */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Confiance</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(rec.confidence)}`}>
                  {rec.confidence}%
                </span>
              </div>

              {/* Strategy Change */}
              {rec.strategyChange && rec.strategyChange.hasChanged && (
                <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-medium text-purple-900 mb-2">Pourquoi la stratégie a changé</p>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-purple-600 font-medium">Ancienne:</span>
                      <span className="text-xs text-purple-800">{rec.strategyChange.oldStrategy}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-purple-600 font-medium">Nouvelle:</span>
                      <span className="text-xs font-bold text-purple-900">{rec.strategyChange.newStrategy}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-purple-600 font-medium">Raison:</span>
                      <span className="text-xs text-purple-800">{rec.strategyChange.reason}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Priority Decision */}
              {rec.priorityDecision && (
                <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-medium text-amber-900 mb-2">Pourquoi cette priorité</p>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-amber-600 font-medium">Priorité absolue:</span>
                      <span className="text-xs font-bold text-amber-900">{rec.priorityDecision.absolutePriority}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-amber-600 font-medium">Raison:</span>
                      <span className="text-xs text-amber-800">{rec.priorityDecision.priorityReason}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-amber-600 font-medium">Pourquoi les autres attendent:</span>
                      <span className="text-xs text-amber-800">{rec.priorityDecision.whyNotOthers}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-amber-600 font-medium">Pourquoi maintenant:</span>
                      <span className="text-xs text-amber-800">{rec.priorityDecision.whyNow}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Follow-up Explanation */}
              {rec.followUpExplanation && (
                <div className="mt-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                  <p className="text-xs font-medium text-teal-900 mb-2">Relance explicative</p>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-teal-600 font-medium">Action:</span>
                      <span className="text-xs font-bold text-teal-900">{rec.followUpExplanation.action}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-teal-600 font-medium">Explication:</span>
                      <span className="text-xs text-teal-800">{rec.followUpExplanation.explanation}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-teal-600 font-medium">Urgence:</span>
                      <span className="text-xs text-teal-800">{rec.followUpExplanation.urgency === "high" ? "Urgent" : rec.followUpExplanation.urgency === "medium" ? "Moyen" : "Faible"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

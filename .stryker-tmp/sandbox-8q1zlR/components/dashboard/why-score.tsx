// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

export interface MetricChange {
  metric: string;
  change: string;
  value: number;
}

export interface WhyScoreProps {
  metricChanges: MetricChange[];
  totalImpact: number;
  explanation: string;
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

export function WhyScore({ metricChanges, totalImpact, explanation, confidence, strategyChange, priorityDecision, followUpExplanation }: WhyScoreProps) {
  const getChangeIcon = (change: string) => {
    if (change.startsWith("+")) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change.startsWith("-")) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith("+")) return "text-green-600";
    if (change.startsWith("-")) return "text-red-600";
    return "text-gray-600";
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
          <Info className="w-5 h-5" />
          Pourquoi ce score ?
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Metric Changes */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Évolution par métrique</p>
            <div className="space-y-2">
              {metricChanges.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getChangeIcon(metric.change)}
                    <span className="text-sm font-medium text-gray-900">{metric.metric}</span>
                  </div>
                  <span className={`text-sm font-bold ${getChangeColor(metric.change)}`}>
                    {metric.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Impact */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-900">Impact total</p>
              <p className={`text-2xl font-bold ${totalImpact > 0 ? "text-green-600" : totalImpact < 0 ? "text-red-600" : "text-gray-600"}`}>
                {totalImpact > 0 ? "+" : ""}{totalImpact}
              </p>
            </div>
          </div>

          {/* Explanation */}
          {explanation && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Explication</p>
              <p className="text-sm text-gray-700">{explanation}</p>
            </div>
          )}

          {/* Confidence */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Confiance</p>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(confidence)}`}>
              {confidence}%
            </span>
          </div>

          {/* Strategy Change */}
          {strategyChange && strategyChange.hasChanged && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-900 mb-2">Pourquoi la stratégie a changé</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-purple-600 font-medium">Ancienne:</span>
                  <span className="text-sm text-purple-800">{strategyChange.oldStrategy}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-purple-600 font-medium">Nouvelle:</span>
                  <span className="text-sm font-bold text-purple-900">{strategyChange.newStrategy}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-purple-600 font-medium">Raison:</span>
                  <span className="text-sm text-purple-800">{strategyChange.reason}</span>
                </div>
              </div>
            </div>
          )}

          {/* Priority Decision */}
          {priorityDecision && (
            <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <p className="text-sm font-medium text-amber-900 mb-2">Pourquoi cette priorité</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-amber-600 font-medium">Priorité absolue:</span>
                  <span className="text-sm font-bold text-amber-900">{priorityDecision.absolutePriority}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-amber-600 font-medium">Raison:</span>
                  <span className="text-sm text-amber-800">{priorityDecision.priorityReason}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-amber-600 font-medium">Pourquoi les autres attendent:</span>
                  <span className="text-sm text-amber-800">{priorityDecision.whyNotOthers}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-amber-600 font-medium">Pourquoi maintenant:</span>
                  <span className="text-sm text-amber-800">{priorityDecision.whyNow}</span>
                </div>
              </div>
            </div>
          )}

          {/* Follow-up Explanation */}
          {followUpExplanation && (
            <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
              <p className="text-sm font-medium text-teal-900 mb-2">Relance explicative</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-teal-600 font-medium">Action:</span>
                  <span className="text-sm font-bold text-teal-900">{followUpExplanation.action}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-teal-600 font-medium">Explication:</span>
                  <span className="text-sm text-teal-800">{followUpExplanation.explanation}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-teal-600 font-medium">Urgence:</span>
                  <span className="text-sm text-teal-800">{followUpExplanation.urgency === "high" ? "Urgent" : followUpExplanation.urgency === "medium" ? "Moyen" : "Faible"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

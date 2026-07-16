// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Target, Info, AlertTriangle } from "lucide-react";

export interface WhyPlanProps {
  priorityAction: string;
  explanation: string;
  blockingFactor: string;
  otherActions: {
    action: string;
    reason: string;
  }[];
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

export function WhyPlan({ priorityAction, explanation, blockingFactor, otherActions, confidence, strategyChange, priorityDecision, followUpExplanation }: WhyPlanProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-50";
    if (confidence >= 60) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Pourquoi ce plan ?
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Priority Action */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-900 mb-1">Action prioritaire aujourd'hui</p>
                <p className="text-base font-bold text-purple-900">{priorityAction}</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          {explanation && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Pourquoi cette action est prioritaire ?</p>
              <p className="text-sm text-gray-700">{explanation}</p>
            </div>
          )}

          {/* Blocking Factor */}
          {blockingFactor && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 mb-1">Facteur bloquant principal</p>
                  <p className="text-sm text-amber-800">{blockingFactor}</p>
                </div>
              </div>
            </div>
          )}

          {/* Other Actions */}
          {otherActions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Pourquoi les autres actions passent après ?</p>
              <div className="space-y-2">
                {otherActions.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{index + 2}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-600">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-600" />
              <p className="text-sm text-gray-600">Confiance</p>
            </div>
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

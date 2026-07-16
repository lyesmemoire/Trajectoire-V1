"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { ArrowRight, Calendar, AlertTriangle, Info, TrendingUp } from "lucide-react";

export interface StrategyChange {
  currentStrategy: string;
  proposedStrategy: string;
  changeReason: string;
  oldStrategyRelevance: string;
  oldStrategyObsolescence: string;
  newStrategyAdvantage: string;
  triggerEvents: string[];
  transitionPlan: string;
  confidence: number;
  timestamp: Date;
}

export interface StrategyEvolutionProps {
  currentStrategy: string;
  strategyHistory: StrategyChange[];
  conclusionStability?: {
    strategyStable: boolean;
    conclusionsChanged: boolean;
    explanation: string;
  };
  confidenceAdaptation?: {
    globalConfidence: number;
    confidenceLevel: "very_high" | "high" | "moderate" | "low" | "insufficient";
    isPrudent: boolean;
    prudentRecommendation: string;
    reason: string;
  };
}

export function StrategyEvolution({ currentStrategy, strategyHistory, conclusionStability, confidenceAdaptation }: StrategyEvolutionProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-50";
    if (confidence >= 60) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const latestChange = strategyHistory.length > 0 ? strategyHistory[0] : null;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Evolution de la stratégie
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Current Strategy */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-1">Stratégie actuelle</p>
            <p className="text-base font-bold text-blue-900">{currentStrategy}</p>
          </div>

          {/* Latest Strategy Change */}
          {latestChange && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Dernier changement de stratégie</p>
              <div className="space-y-3">
                {/* From -> To */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Ancienne stratégie</p>
                    <p className="text-sm font-medium text-gray-900">{latestChange.currentStrategy}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Nouvelle stratégie</p>
                    <p className="text-sm font-bold text-indigo-900">{latestChange.proposedStrategy}</p>
                  </div>
                </div>

                {/* Change Reason */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Raison du changement</p>
                  <p className="text-sm text-gray-700">{latestChange.changeReason}</p>
                </div>

                {/* Trigger Events */}
                {latestChange.triggerEvents.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Éléments déclencheurs</p>
                    <ul className="space-y-1">
                      {latestChange.triggerEvents.map((event, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>{event}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Old Strategy Relevance */}
                {latestChange.oldStrategyRelevance && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Pourquoi l'ancienne stratégie était pertinente</p>
                    <p className="text-sm text-gray-700">{latestChange.oldStrategyRelevance}</p>
                  </div>
                )}

                {/* Old Strategy Obsolescence */}
                {latestChange.oldStrategyObsolescence && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Pourquoi elle ne l'est plus</p>
                    <p className="text-sm text-gray-700">{latestChange.oldStrategyObsolescence}</p>
                  </div>
                )}

                {/* New Strategy Advantage */}
                {latestChange.newStrategyAdvantage && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Pourquoi la nouvelle est meilleure</p>
                    <p className="text-sm text-gray-700">{latestChange.newStrategyAdvantage}</p>
                  </div>
                )}

                {/* Transition Plan */}
                {latestChange.transitionPlan && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Plan de transition</p>
                    <p className="text-sm text-gray-700">{latestChange.transitionPlan}</p>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{latestChange.timestamp.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Confiance</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(latestChange.confidence)}`}>
                    {latestChange.confidence}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Conclusion Stability */}
          {conclusionStability && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
              <p className="text-sm font-medium text-indigo-900 mb-2">Stabilité des conclusions</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-indigo-600 font-medium">Stratégie stable:</span>
                  <span className="text-sm text-indigo-800">{conclusionStability.strategyStable ? "Oui" : "Non"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-indigo-600 font-medium">Conclusions changées:</span>
                  <span className="text-sm text-indigo-800">{conclusionStability.conclusionsChanged ? "Oui" : "Non"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-indigo-600 font-medium">Explication:</span>
                  <span className="text-sm text-indigo-800">{conclusionStability.explanation}</span>
                </div>
              </div>
            </div>
          )}

          {/* Confidence Adaptation */}
          {confidenceAdaptation && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <p className="text-sm font-medium text-amber-900 mb-2">Adaptation de confiance</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-600 font-medium">Confiance globale:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(confidenceAdaptation.globalConfidence)}`}>
                    {confidenceAdaptation.globalConfidence}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-600 font-medium">Niveau:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(confidenceAdaptation.globalConfidence)}`}>
                    {confidenceAdaptation.confidenceLevel === "very_high" ? "Très élevée" : confidenceAdaptation.confidenceLevel === "high" ? "Élevée" : confidenceAdaptation.confidenceLevel === "moderate" ? "Modérée" : confidenceAdaptation.confidenceLevel === "low" ? "Faible" : "Insuffisante"}
                  </span>
                </div>
                {confidenceAdaptation.isPrudent && (
                  <div className="mt-2 p-2 bg-white rounded border border-orange-200">
                    <p className="text-xs text-orange-900 mb-1">Recommandation prudente:</p>
                    <p className="text-xs text-orange-800">{confidenceAdaptation.prudentRecommendation}</p>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-xs text-amber-600 font-medium">Raison:</span>
                  <span className="text-xs text-amber-800">{confidenceAdaptation.reason}</span>
                </div>
              </div>
            </div>
          )}

          {/* Strategy History */}
          {strategyHistory.length > 1 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Historique des changements</p>
              <div className="space-y-2">
                {strategyHistory.slice(1).map((change, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{change.currentStrategy}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm font-bold text-indigo-900">{change.proposedStrategy}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{change.changeReason}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{change.timestamp.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

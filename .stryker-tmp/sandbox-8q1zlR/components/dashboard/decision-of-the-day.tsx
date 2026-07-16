// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Target, Clock, AlertTriangle, TrendingUp, CheckCircle, Info, Zap } from "lucide-react";

export interface DecisionOfTheDayProps {
  absolutePriority: string;
  priorityReason: string;
  expectedImpact: string;
  urgency: "immediate" | "this_week" | "this_month" | "flexible";
  difficulty: "easy" | "moderate" | "hard";
  estimatedTime: string;
  longTermBenefit: string;
  successProbability: number;
  strategyAlignment: number;
  riskOfInaction: string;
  whyNotOthers: string;
  whyNow: string;
  whyLater: string;
  secondaryActions: string[];
  confidence: number;
  limitations: string[];
  missingData: string[];
}

export function DecisionOfTheDay({ decision }: { decision: DecisionOfTheDayProps }) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return "text-red-600 bg-red-50";
      case "this_week":
        return "text-amber-600 bg-amber-50";
      case "this_month":
        return "text-blue-600 bg-blue-50";
      case "flexible":
        return "text-gray-600 bg-gray-50";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "moderate":
        return "text-amber-600 bg-amber-50";
      case "hard":
        return "text-red-600 bg-red-50";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-50";
    if (confidence >= 60) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
      <CardHeader className="border-b border-amber-200">
        <CardTitle className="text-amber-900 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Décision du jour
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Absolute Priority */}
          <div className="p-4 bg-white rounded-lg border border-amber-200 shadow-sm">
            <p className="text-xs text-amber-600 mb-1">Priorité absolue</p>
            <p className="text-xl font-bold text-amber-900">{decision.absolutePriority}</p>
          </div>

          {/* Priority Reason */}
          <div>
            <p className="text-sm font-medium text-amber-900 mb-2">Pourquoi</p>
            <p className="text-sm text-amber-800">{decision.priorityReason}</p>
          </div>

          {/* Expected Impact */}
          <div>
            <p className="text-sm font-medium text-amber-900 mb-2">Impact attendu</p>
            <p className="text-sm text-amber-800">{decision.expectedImpact}</p>
          </div>

          {/* Urgency, Difficulty, Estimated Time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600">Urgence</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(decision.urgency)}`}>
                {decision.urgency === "immediate" ? "Immédiat" : decision.urgency === "this_week" ? "Cette semaine" : decision.urgency === "this_month" ? "Ce mois" : "Flexible"}
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600">Difficulté</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(decision.difficulty)}`}>
                {decision.difficulty === "easy" ? "Facile" : decision.difficulty === "moderate" ? "Modéré" : "Difficile"}
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600">Temps</p>
              </div>
              <p className="text-xs font-medium text-amber-900">{decision.estimatedTime}</p>
            </div>
          </div>

          {/* Long-term Benefit */}
          <div>
            <p className="text-sm font-medium text-amber-900 mb-2">Bénéfice long terme</p>
            <p className="text-sm text-amber-800">{decision.longTermBenefit}</p>
          </div>

          {/* Success Probability and Strategy Alignment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600">Probabilité de réussite</p>
              </div>
              <p className="text-2xl font-bold text-amber-900">{decision.successProbability}%</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600">Alignement stratégie</p>
              </div>
              <p className="text-2xl font-bold text-amber-900">{decision.strategyAlignment}%</p>
            </div>
          </div>

          {/* Risk of Inaction */}
          <div>
            <p className="text-sm font-medium text-amber-900 mb-2">Risque d'inaction</p>
            <p className="text-sm text-amber-800">{decision.riskOfInaction}</p>
          </div>

          {/* Why Not Others */}
          <div>
            <p className="text-sm font-medium text-amber-900 mb-2">Pourquoi les autres attendent</p>
            <p className="text-sm text-amber-800">{decision.whyNotOthers}</p>
          </div>

          {/* Why Now */}
          <div>
            <p className="text-sm font-medium text-amber-900 mb-2">Pourquoi maintenant</p>
            <p className="text-sm text-amber-800">{decision.whyNow}</p>
          </div>

          {/* Why Later */}
          <div>
            <p className="text-sm font-medium text-amber-900 mb-2">Pourquoi plus tard</p>
            <p className="text-sm text-amber-800">{decision.whyLater}</p>
          </div>

          {/* Secondary Actions */}
          {decision.secondaryActions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-amber-900 mb-2">Actions secondaires</p>
              <ul className="space-y-1">
                {decision.secondaryActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="text-amber-600">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-600">Confiance</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(decision.confidence)}`}>
              {decision.confidence}%
            </span>
          </div>

          {/* Limitations */}
          {decision.limitations.length > 0 && (
            <div>
              <p className="text-sm font-medium text-amber-900 mb-2">Limitations</p>
              <ul className="space-y-1">
                {decision.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Data */}
          {decision.missingData.length > 0 && (
            <div>
              <p className="text-sm font-medium text-amber-900 mb-2">Données manquantes</p>
              <ul className="space-y-1">
                {decision.missingData.map((data, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{data}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Lightbulb, AlertTriangle, CheckCircle, Clock, MessageSquare, TrendingUp, Zap } from "lucide-react";

interface LiveCoachingData {
  coachingNeeded: boolean;
  coachingPriority: "critical" | "high" | "medium" | "low";
  recommendedHint: {
    type: string;
    message: string;
    priority: string;
    urgency: string;
    timing: string;
    why: string;
    expectedBenefit: string;
    riskIfIgnored: string;
    confidence: number;
  } | null;
  recommendedTiming: string;
  recommendedMessage: string;
  interventionReason: string;
  expectedImprovement: string;
  confidence: number;
}

interface LiveCoachingProps {
  coachingData: LiveCoachingData | null;
}

export function LiveCoaching({ coachingData }: LiveCoachingProps) {
  if (!coachingData) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Coaching en Temps Réel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 text-sm py-8">
            Aucun coaching en temps réel disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  const { coachingNeeded, coachingPriority, recommendedHint, recommendedTiming, interventionReason, expectedImprovement, confidence } = coachingData;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return "bg-red-100 text-red-700 border-red-200";
      case "soon":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "later":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case "now":
        return "bg-red-100 text-red-700 border-red-200";
      case "after response":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "next question":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Coaching en Temps Réel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Coaching Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {coachingNeeded ? (
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              <span className="text-sm font-medium text-gray-900">
                {coachingNeeded ? "Coaching Requis" : "Aucun Coaching Requis"}
              </span>
            </div>
            {coachingNeeded && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(coachingPriority)}`}>
                {coachingPriority}
              </div>
            )}
          </div>

          {coachingNeeded && recommendedHint && (
            <>
              {/* Coaching Hint */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">Suggestion de Coaching</span>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-yellow-900">{recommendedHint.type}</span>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(recommendedHint.priority)}`}>
                        {recommendedHint.priority}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getUrgencyColor(recommendedHint.urgency)}`}>
                        {recommendedHint.urgency}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-2">{recommendedHint.message}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span className={`px-2 py-0.5 rounded-full ${getTimingColor(recommendedHint.timing)}`}>
                      {recommendedHint.timing}
                    </span>
                  </div>
                </div>
              </div>

              {/* Intervention Reason */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Raison de l'Intervention</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{interventionReason}</p>
                </div>
              </div>

              {/* Expected Improvement */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Amélioration Attendue</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{expectedImprovement}</p>
                </div>
              </div>

              {/* Coaching Details */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Détails du Coaching</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Pourquoi</span>
                    <span className="font-medium text-gray-900">{recommendedHint.why}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Bénéfice Attendu</span>
                    <span className="font-medium text-gray-900">{recommendedHint.expectedBenefit}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Risque si Ignoré</span>
                    <span className="font-medium text-gray-900">{recommendedHint.riskIfIgnored}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Confiance</span>
                    <span className="font-medium text-gray-900">{recommendedHint.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Overall Confidence */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-900">Confiance Globale</span>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Niveau de Confiance</span>
                    <span className="text-2xl font-bold text-indigo-900">{confidence}%</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {!coachingNeeded && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Statut</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-900">La réponse du candidat est de bonne qualité. Aucun coaching n'est nécessaire pour le moment.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

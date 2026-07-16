"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle, AlertTriangle, TrendingUp, RefreshCw, Lightbulb, BarChart3, Clock, Target } from "lucide-react";

export interface ConclusionEvolutionProps {
  confirmedConclusions: number;
  revisedConclusions: number;
  abandonedConclusions: number;
  newConclusions: number;
  overallConfidence: number;
  conclusionChanges: {
    type: "confirmation" | "contradiction" | "reinforcement" | "weakening" | "replacement";
    oldConclusion: string;
    newConclusion: string;
    explanation: string;
    confidence: number;
  }[];
}

export function ConclusionEvolution({ evolution }: { evolution: ConclusionEvolutionProps }) {
  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "confirmation":
        return "text-green-600 bg-green-50";
      case "contradiction":
        return "text-red-600 bg-red-50";
      case "reinforcement":
        return "text-blue-600 bg-blue-50";
      case "weakening":
        return "text-amber-600 bg-amber-50";
      case "replacement":
        return "text-purple-600 bg-purple-50";
    }
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case "confirmation":
        return <CheckCircle className="w-4 h-4" />;
      case "contradiction":
        return <AlertTriangle className="w-4 h-4" />;
      case "reinforcement":
        return <TrendingUp className="w-4 h-4" />;
      case "weakening":
        return <RefreshCw className="w-4 h-4" />;
      case "replacement":
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-50";
    if (confidence >= 60) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
      <CardHeader className="border-b border-indigo-200">
        <CardTitle className="text-indigo-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Évolution de mes conclusions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 bg-white rounded-lg border border-green-200">
              <p className="text-xs text-green-600 mb-1">Confirmées</p>
              <p className="text-2xl font-bold text-green-900">{evolution.confirmedConclusions}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 mb-1">Révisées</p>
              <p className="text-2xl font-bold text-blue-900">{evolution.revisedConclusions}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-red-200">
              <p className="text-xs text-red-600 mb-1">Abandonnées</p>
              <p className="text-2xl font-bold text-red-900">{evolution.abandonedConclusions}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-purple-200">
              <p className="text-xs text-purple-600 mb-1">Nouvelles</p>
              <p className="text-2xl font-bold text-purple-900">{evolution.newConclusions}</p>
            </div>
          </div>

          {/* Overall Confidence */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-indigo-600">Confiance globale</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-bold ${getConfidenceColor(evolution.overallConfidence)}`}>
              {evolution.overallConfidence}%
            </span>
          </div>

          {/* Conclusion Changes */}
          {evolution.conclusionChanges.length > 0 && (
            <div>
              <p className="text-sm font-medium text-indigo-900 mb-2">Changements récents</p>
              <div className="space-y-2">
                {evolution.conclusionChanges.slice(0, 5).map((change, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-indigo-200">
                    <div className="flex items-start gap-2">
                      {getChangeTypeIcon(change.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(change.type)}`}>
                            {change.type === "confirmation" ? "Confirmation" : change.type === "contradiction" ? "Contradiction" : change.type === "reinforcement" ? "Renforcement" : change.type === "weakening" ? "Affaiblissement" : "Remplacement"}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(change.confidence)}`}>
                            {change.confidence}%
                          </span>
                        </div>
                        <p className="text-sm text-indigo-800 mb-1">{change.explanation}</p>
                        {change.oldConclusion && (
                          <p className="text-xs text-gray-600 mb-1">
                            <span className="font-medium">Avant:</span> {change.oldConclusion}
                          </p>
                        )}
                        {change.newConclusion && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Après:</span> {change.newConclusion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Review Date */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-indigo-600">Dernière révision</p>
            </div>
            <p className="text-sm font-medium text-indigo-900">Aujourd'hui</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

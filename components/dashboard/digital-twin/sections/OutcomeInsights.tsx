import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, Sparkles, TrendingDown, Shield, Award, Lightbulb } from "lucide-react";
import { DigitalTwin } from "../types";

export interface OutcomeInsightsProps {
  twin: DigitalTwin;
}

export function OutcomeInsights({ twin }: OutcomeInsightsProps) {
  return (
    <>
      {/* Outcome Insights */}
      {twin.outcomeInsights && (
        <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 shadow-sm">
          <CardHeader className="border-b border-violet-200">
            <CardTitle className="text-violet-900 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Insights sur les résultats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-violet-200">
                <p className="text-sm font-medium text-violet-900 mb-2">Ce qui fonctionne le mieux pour toi</p>
                <div className="space-y-1">
                  {twin.outcomeInsights.whatWorksBest.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-violet-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-violet-200">
                <p className="text-sm font-medium text-violet-900 mb-2">Ce qui fonctionne le moins</p>
                <div className="space-y-1">
                  {twin.outcomeInsights.whatWorksLeast.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-violet-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-violet-200">
                <p className="text-sm font-medium text-violet-900 mb-2">Patterns spécifiques à ton profil</p>
                <div className="space-y-1">
                  {twin.outcomeInsights.candidateSpecificPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-violet-800">{pattern}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-violet-200">
                <p className="text-sm font-medium text-violet-900 mb-2">ROI observé</p>
                <div className="space-y-2">
                  {twin.outcomeInsights.observedROI.map((roi, index) => (
                    <div key={index} className="p-2 bg-violet-50 rounded border border-violet-100">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-violet-900">{roi.action}</p>
                        <span className="text-xs text-violet-600">{roi.roi}</span>
                      </div>
                      <p className="text-xs text-violet-700">{roi.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-violet-200">
                <p className="text-sm font-medium text-violet-900 mb-2">Apprentissages récents</p>
                <div className="space-y-1">
                  {twin.outcomeInsights.recentLearnings.map((learning, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-violet-800">{learning}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-violet-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-600" />
                  <p className="text-sm text-violet-600">Confiance dans les recommandations</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${twin.outcomeInsights.confidenceInRecommendations >= 90 ? "bg-green-100 text-green-800" : twin.outcomeInsights.confidenceInRecommendations >= 70 ? "bg-blue-100 text-blue-800" : twin.outcomeInsights.confidenceInRecommendations >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                  {twin.outcomeInsights.confidenceInRecommendations}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}

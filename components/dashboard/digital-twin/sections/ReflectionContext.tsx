import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle, Brain, Activity, GitBranch, Radar, Scale, AlertOctagon } from "lucide-react";
import { DigitalTwin } from "../types";

export interface ReflectionContextProps {
  twin: DigitalTwin;
}

export function ReflectionContext({ twin }: ReflectionContextProps) {
  return (
    <>
      {twin.reflectionContext && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
          <CardHeader className="border-b border-indigo-200">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Contexte de Réflexion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-900 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Synthèse de réflexion
                </p>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-indigo-800">{twin.reflectionContext.reflectionSummary.overallReflectionQuality}%</p>
                  <p className="text-xs text-indigo-600">Dernière réflexion: {new Date(twin.reflectionContext.reflectionSummary.reflectionTimestamp).toLocaleDateString()}</p>
                </div>
              </div>

              {twin.reflectionContext.validatedRecommendations.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Recommandations validées
                  </p>
                  <div className="space-y-1">
                    {twin.reflectionContext.validatedRecommendations.map((rec, index) => (
                      <p key={index} className="text-xs text-green-600">• {rec}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.reflectionContext.alternativeOptions.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Alternatives proposées
                  </p>
                  <div className="space-y-1">
                    {twin.reflectionContext.alternativeOptions.map((alt, index) => (
                      <p key={index} className="text-xs text-blue-600">• {alt}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.reflectionContext.blindSpots.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                    <Radar className="w-4 h-4" />
                    Angles morts détectés
                  </p>
                  <div className="space-y-1">
                    {twin.reflectionContext.blindSpots.map((spot, index) => (
                      <p key={index} className="text-xs text-red-600">• {spot}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.reflectionContext.assumptions.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4" />
                    Hypothèses détectées
                  </p>
                  <div className="space-y-1">
                    {twin.reflectionContext.assumptions.map((assumption, index) => (
                      <p key={index} className="text-xs text-amber-600">• {assumption}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.reflectionContext.contradictionsDetected.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4" />
                    Contradictions identifiées
                  </p>
                  <div className="space-y-1">
                    {twin.reflectionContext.contradictionsDetected.map((contradiction, index) => (
                      <p key={index} className="text-xs text-purple-600">• {contradiction}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.reflectionContext.evidenceReview && (
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-sm font-medium text-teal-900 mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Revue des preuves
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-teal-600">Qualité globale: {twin.reflectionContext.evidenceReview.overallEvidenceQuality}%</p>
                    {twin.reflectionContext.evidenceReview.conclusionsNeedingStrengthening.length > 0 && (
                      <p className="text-xs text-teal-600">À renforcer: {twin.reflectionContext.evidenceReview.conclusionsNeedingStrengthening.length}</p>
                    )}
                  </div>
                </div>
              )}

              {twin.reflectionContext.confidenceCalibration && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Recalibrage de confiance
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">Confiance globale: {twin.reflectionContext.confidenceCalibration.overallConfidence}%</p>
                    {twin.reflectionContext.confidenceCalibration.calibrations.length > 0 && (
                      <div className="space-y-1">
                        {twin.reflectionContext.confidenceCalibration.calibrations.map((cal, index) => (
                          <p key={index} className="text-xs text-slate-600">• {cal.recommendation}: {cal.originalConfidence}% → {cal.calibratedConfidence}%</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}

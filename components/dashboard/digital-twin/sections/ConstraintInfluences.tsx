import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { AlertTriangle, RefreshCw, Target, Award, Lightbulb, Brain, Compass, Lock as LockIcon } from "lucide-react";
import { DigitalTwin } from "../types";

export interface ConstraintInfluencesProps {
  twin: DigitalTwin;
}

export function ConstraintInfluences({ twin }: ConstraintInfluencesProps) {
  return (
    <>
      {/* Constraint Influences */}
      {twin.constraintInfluences && (
        <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200 shadow-sm">
          <CardHeader className="border-b border-rose-200">
            <CardTitle className="text-rose-900 flex items-center gap-2">
              <LockIcon className="w-5 h-5" />
              Ce qui influence réellement tes décisions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {twin.constraintInfluences.activeConstraints.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-rose-200">
                  <p className="text-sm font-medium text-rose-900 mb-2 flex items-center gap-2">
                    <LockIcon className="w-4 h-4" />
                    Contraintes actives
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.activeConstraints.map((constraint: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <LockIcon className="w-3 h-3 text-rose-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-rose-800">{constraint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.criticalConstraints.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Contraintes critiques
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.criticalConstraints.map((constraint: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-800">{constraint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintImpactOnDecisions.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    Impact sur tes décisions
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintImpactOnDecisions.map((impact: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Compass className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">{impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintImpactOnStrategy.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Impact sur ta stratégie
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintImpactOnStrategy.map((impact: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Brain className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-purple-800">{impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintImpactOnOpportunities.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Impact sur les opportunités
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintImpactOnOpportunities.map((impact: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Target className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">{impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintImpactOnGoals.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Impact sur tes objectifs
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintImpactOnGoals.map((impact: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Award className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-800">{impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintEvolution.length > 0 && (
                <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <p className="text-sm font-medium text-cyan-900 mb-2 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Évolution des contraintes
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintEvolution.map((evolution: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <RefreshCw className="w-3 h-3 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-cyan-800">{evolution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.constraintInfluences.constraintRecommendations.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm font-medium text-indigo-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Recommandations sur les contraintes
                  </p>
                  <div className="space-y-1">
                    {twin.constraintInfluences.constraintRecommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-3 h-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-indigo-800">{recommendation}</p>
                      </div>
                    ))}
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

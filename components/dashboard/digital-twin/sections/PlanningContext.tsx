import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { AlertTriangle, Zap, Shield, Target, Activity, GitBranch, Route, MapPin, Flag } from "lucide-react";
import { DigitalTwin } from "../types";

export interface PlanningContextProps {
  twin: DigitalTwin;
}

export function PlanningContext({ twin }: PlanningContextProps) {
  return (
    <>
      {twin.planningContext && (
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
          <CardHeader className="border-b border-teal-200">
            <CardTitle className="text-teal-900 flex items-center gap-2">
              <Route className="w-5 h-5" />
              Contexte de Planification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-teal-200">
                <p className="text-sm font-medium text-teal-900 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Confiance du plan
                </p>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-teal-800">{twin.planningContext.planningConfidence.overallConfidence}%</p>
                  <p className="text-xs text-teal-600">Écarts identifiés: {twin.planningContext.gapAnalysis.gaps.length}</p>
                  <p className="text-xs text-teal-600">Jalons: {twin.planningContext.milestones.length}</p>
                </div>
              </div>

              {twin.planningContext.currentPosition && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Position actuelle
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-blue-600">Rôle: {twin.planningContext.currentPosition.role}</p>
                    <p className="text-xs text-blue-600">Expérience: {twin.planningContext.currentPosition.experience}</p>
                    <p className="text-xs text-blue-600">Compétences: {twin.planningContext.currentPosition.skills.length}</p>
                  </div>
                </div>
              )}

              {twin.planningContext.targetPosition && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Position cible
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-green-600">Rôle: {twin.planningContext.targetPosition.role}</p>
                    <p className="text-xs text-green-600">Expérience requise: {twin.planningContext.targetPosition.requiredExperience}</p>
                    <p className="text-xs text-green-600">Compétences requises: {twin.planningContext.targetPosition.requiredSkills.length}</p>
                  </div>
                </div>
              )}

              {twin.planningContext.gapAnalysis.gaps.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Écarts identifiés
                  </p>
                  <div className="space-y-1">
                    {twin.planningContext.gapAnalysis.gaps.map((gap, index) => (
                      <p key={index} className="text-xs text-red-600">• {gap.category}: {gap.gapSize} ({gap.priority})</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.planningContext.milestones.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Jalons
                  </p>
                  <div className="space-y-1">
                    {twin.planningContext.milestones.map((milestone, index) => (
                      <p key={index} className="text-xs text-purple-600">• {milestone.objective} ({milestone.estimatedCompletion})</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.planningContext.priorities.length > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-900 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Priorités
                  </p>
                  <div className="space-y-1">
                    {twin.planningContext.priorities.map((priority, index) => (
                      <p key={index} className="text-xs text-orange-600">• {priority.action} ({priority.priority})</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.planningContext.dependencies.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm font-medium text-indigo-900 mb-2 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    Dépendances
                  </p>
                  <div className="space-y-1">
                    {twin.planningContext.dependencies.map((dep, index) => (
                      <p key={index} className="text-xs text-indigo-600">• {dep.sourceAction} → {dep.dependentAction}</p>
                    ))}
                  </div>
                </div>
              )}

              {twin.planningContext.riskAnalysis.risks.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Risques
                  </p>
                  <div className="space-y-1">
                    {twin.planningContext.riskAnalysis.risks.map((risk, index) => (
                      <p key={index} className="text-xs text-amber-600">• {risk.description} ({risk.probability}, {risk.impact})</p>
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

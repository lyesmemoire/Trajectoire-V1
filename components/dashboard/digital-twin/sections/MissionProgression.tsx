import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { AlertTriangle, CheckCircle, Target, Compass } from "lucide-react";
import { DigitalTwin } from "../types";

export interface MissionProgressionProps {
  twin: DigitalTwin;
}

export function MissionProgression({ twin }: MissionProgressionProps) {
  return (
    <>
      {/* Mission Progression */}
      {twin.missionProgression && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Comment tu progresses vers ta mission
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2">Mission actuelle</p>
                <p className="text-lg font-bold text-purple-900 mb-3">{twin.missionProgression.currentMission}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-purple-600">Phase actuelle</p>
                    <p className="text-sm font-medium text-purple-900">{twin.missionProgression.currentPhase}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Temps restant</p>
                    <p className="text-sm font-medium text-purple-900">{twin.missionProgression.timeRemaining}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-purple-700">Progression globale</span>
                      <span className="text-xs font-medium text-purple-900">{twin.missionProgression.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${twin.missionProgression.overallProgress}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-purple-700">Progression phase</span>
                      <span className="text-xs font-medium text-purple-900">{twin.missionProgression.phaseProgress}%</span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${twin.missionProgression.phaseProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600">Jalons atteints</p>
                  <p className="text-sm font-medium text-purple-900">{twin.missionProgression.milestonesAchieved} / {twin.missionProgression.milestonesTotal}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600">Vitesse</p>
                  <p className="text-sm font-medium text-purple-900 capitalize">{twin.missionProgression.progressVelocity.replace("_", " ")}</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2">Prochain jalon</p>
                <p className="text-sm text-purple-800">{twin.missionProgression.nextMilestone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600">Probabilité succès</p>
                  <p className="text-lg font-bold text-purple-900">{twin.missionProgression.successProbability}%</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600">À temps</p>
                  <p className="text-lg font-bold text-purple-900">{twin.missionProgression.onTimeProbability}%</p>
                </div>
              </div>

              {twin.missionProgression.topRisks.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Principaux risques</p>
                  <div className="space-y-1">
                    {twin.missionProgression.topRisks.map((risk, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">{risk}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.missionProgression.keyAchievements.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Réalisations clés</p>
                  <div className="space-y-1">
                    {twin.missionProgression.keyAchievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-800">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.missionProgression.focusAreas.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">Zones de focus</p>
                  <div className="space-y-1">
                    {twin.missionProgression.focusAreas.map((area, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Target className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">{area}</p>
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

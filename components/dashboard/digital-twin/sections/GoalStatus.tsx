import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle, Clock, Zap, RefreshCw, Target, Plus, Trash2 } from "lucide-react";
import { DigitalTwin } from "../types";

export interface GoalStatusProps {
  twin: DigitalTwin;
}

export function GoalStatus({ twin }: GoalStatusProps) {
  return (
    <>
      {/* Goal Status */}
      {twin.goalStatus && (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
          <CardHeader className="border-b border-blue-200">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Statut des objectifs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Objectif principal</p>
                <p className="text-sm text-blue-800">{twin.goalStatus.primaryGoal}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">Objectif du moment</p>
                </div>
                <p className="text-sm text-purple-800">{twin.goalStatus.goalOfTheMoment}</p>
              </div>
              {twin.goalStatus.newGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Nouveaux objectifs</p>
                  <div className="space-y-1">
                    {twin.goalStatus.newGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Plus className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {twin.goalStatus.completedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-teal-200">
                  <p className="text-sm font-medium text-teal-900 mb-2">Objectifs terminés</p>
                  <div className="space-y-1">
                    {twin.goalStatus.completedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-teal-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {twin.goalStatus.mergedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Objectifs fusionnés</p>
                  <div className="space-y-1">
                    {twin.goalStatus.mergedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <RefreshCw className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {twin.goalStatus.deletedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Objectifs supprimés</p>
                  <div className="space-y-1">
                    {twin.goalStatus.deletedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Trash2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {twin.goalStatus.postponedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Objectifs reportés</p>
                  <div className="space-y-1">
                    {twin.goalStatus.postponedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Raison</p>
                <p className="text-sm text-blue-800">{twin.goalStatus.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}

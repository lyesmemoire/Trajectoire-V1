"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Target, CheckCircle, Clock, Shield, Zap, RefreshCw, Plus, Trash2, ArrowRight } from "lucide-react";

export interface GoalIntelligenceProps {
  primaryGoal: {
    id: string;
    description: string;
    reason: string;
    expectedImpact: string;
    priority: "critical" | "high" | "medium" | "low";
    urgency: "immediate" | "soon" | "eventual" | "flexible";
    dependencies: string[];
    risk: string;
    strategicValue: string;
    status: "active" | "achieved" | "abandoned" | "obsolete" | "impossible" | "secondary" | "contradictory" | "needs_splitting";
    confidence: number;
  };
  secondaryGoals: {
    id: string;
    description: string;
    reason: string;
    expectedImpact: string;
    priority: "critical" | "high" | "medium" | "low";
    urgency: "immediate" | "soon" | "eventual" | "flexible";
    dependencies: string[];
    risk: string;
    strategicValue: string;
    status: "active" | "achieved" | "abandoned" | "obsolete" | "impossible" | "secondary" | "contradictory" | "needs_splitting";
    confidence: number;
  }[];
  newGoals: {
    id: string;
    description: string;
    reason: string;
    expectedImpact: string;
    priority: "critical" | "high" | "medium" | "low";
    urgency: "immediate" | "soon" | "eventual" | "flexible";
    dependencies: string[];
    risk: string;
    strategicValue: string;
    confidence: number;
    trigger: string;
  }[];
  completedGoals: {
    id: string;
    description: string;
    completionDate: string;
    impact: string;
    reason: string;
  }[];
  mergedGoals: {
    originalGoals: string[];
    mergedGoal: string;
    reason: string;
    date: string;
  }[];
  deletedGoals: {
    id: string;
    description: string;
    reason: string;
    since: string;
    replacement: string;
  }[];
  postponedGoals: {
    id: string;
    description: string;
    reason: string;
    until: string;
  }[];
  goalOfTheMoment: {
    id: string;
    description: string;
    reason: string;
    priority: "critical" | "high" | "medium" | "low";
    urgency: "immediate" | "soon" | "eventual" | "flexible";
    confidence: number;
  };
  changeReasons: {
    type: string;
    description: string;
    dataUsed: string[];
    analysesChanged: string[];
    confidence: number;
    missingData: string[];
  }[];
  globalConfidence: number;
  goalRecommendations: string[];
}

export function GoalIntelligence({ goals }: { goals: GoalIntelligenceProps }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return "bg-red-100 text-red-800";
      case "soon":
        return "bg-amber-100 text-amber-800";
      case "eventual":
        return "bg-blue-100 text-blue-800";
      case "flexible":
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "achieved":
        return "bg-teal-100 text-teal-800";
      case "abandoned":
        return "bg-red-100 text-red-800";
      case "obsolete":
        return "bg-gray-100 text-gray-800";
      case "impossible":
        return "bg-red-100 text-red-800";
      case "secondary":
        return "bg-blue-100 text-blue-800";
      case "contradictory":
        return "bg-orange-100 text-orange-800";
      case "needs_splitting":
        return "bg-purple-100 text-purple-800";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-50";
    if (confidence >= 70) return "text-blue-600 bg-blue-50";
    if (confidence >= 50) return "text-amber-600 bg-amber-50";
    if (confidence >= 30) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
      <CardHeader className="border-b border-blue-200">
        <CardTitle className="text-blue-900 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Objectifs Intelligents
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Primary Goal */}
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Objectif principal</p>
            </div>
            <p className="text-sm text-blue-800 mb-2">{goals.primaryGoal.description}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goals.primaryGoal.priority)}`}>
                {goals.primaryGoal.priority === "critical" ? "Critique" : goals.primaryGoal.priority === "high" ? "Haute" : goals.primaryGoal.priority === "medium" ? "Moyenne" : "Faible"}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(goals.primaryGoal.urgency)}`}>
                {goals.primaryGoal.urgency === "immediate" ? "Immédiat" : goals.primaryGoal.urgency === "soon" ? "Bientôt" : goals.primaryGoal.urgency === "eventual" ? "Éventuel" : "Flexible"}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goals.primaryGoal.status)}`}>
                {goals.primaryGoal.status === "active" ? "Actif" : goals.primaryGoal.status === "achieved" ? "Atteint" : goals.primaryGoal.status === "abandoned" ? "Abandonné" : goals.primaryGoal.status === "obsolete" ? "Obsolète" : goals.primaryGoal.status === "impossible" ? "Impossible" : goals.primaryGoal.status === "secondary" ? "Secondaire" : goals.primaryGoal.status === "contradictory" ? "Contradictoire" : "À découper"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-700">Confiance</p>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getConfidenceColor(goals.primaryGoal.confidence)}`}>
                {goals.primaryGoal.confidence}%
              </span>
            </div>
          </div>

          {/* Goal of the Moment */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-medium text-purple-900">Objectif du moment</p>
            </div>
            <p className="text-sm text-purple-800 mb-2">{goals.goalOfTheMoment.description}</p>
            <p className="text-xs text-purple-700">{goals.goalOfTheMoment.reason}</p>
          </div>

          {/* Secondary Goals */}
          {goals.secondaryGoals.length > 0 && (
            <div>
              <p className="text-sm font-medium text-blue-900 mb-2">Objectifs secondaires</p>
              <div className="space-y-2">
                {goals.secondaryGoals.map((goal, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-blue-200">
                    <p className="text-sm text-blue-800 mb-1">{goal.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                        {goal.priority === "critical" ? "Critique" : goal.priority === "high" ? "Haute" : goal.priority === "medium" ? "Moyenne" : "Faible"}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                        {goal.status === "active" ? "Actif" : goal.status === "achieved" ? "Atteint" : goal.status === "abandoned" ? "Abandonné" : goal.status === "obsolete" ? "Obsolète" : goal.status === "impossible" ? "Impossible" : goal.status === "secondary" ? "Secondaire" : goal.status === "contradictory" ? "Contradictoire" : "À découper"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Goals */}
          {goals.newGoals.length > 0 && (
            <div>
              <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouveaux objectifs
              </p>
              <div className="space-y-2">
                {goals.newGoals.map((goal, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-green-200">
                    <p className="text-sm text-green-800 mb-1">{goal.description}</p>
                    <p className="text-xs text-green-700">Déclencheur: {goal.trigger}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {goals.completedGoals.length > 0 && (
            <div>
              <p className="text-sm font-medium text-teal-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Objectifs terminés
              </p>
              <div className="space-y-2">
                {goals.completedGoals.map((goal, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-teal-200">
                    <p className="text-sm text-teal-800 mb-1">{goal.description}</p>
                    <p className="text-xs text-teal-700">Impact: {goal.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Merged Goals */}
          {goals.mergedGoals.length > 0 && (
            <div>
              <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Objectifs fusionnés
              </p>
              <div className="space-y-2">
                {goals.mergedGoals.map((goal, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-purple-200">
                    <p className="text-sm text-purple-800 mb-1">{goal.mergedGoal}</p>
                    <p className="text-xs text-purple-700">Raison: {goal.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deleted Goals */}
          {goals.deletedGoals.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Objectifs supprimés
              </p>
              <div className="space-y-2">
                {goals.deletedGoals.map((goal, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-red-200">
                    <p className="text-sm text-red-800 mb-1">{goal.description}</p>
                    <p className="text-xs text-red-700">Raison: {goal.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Postponed Goals */}
          {goals.postponedGoals.length > 0 && (
            <div>
              <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Objectifs reportés
              </p>
              <div className="space-y-2">
                {goals.postponedGoals.map((goal, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-amber-200">
                    <p className="text-sm text-amber-800 mb-1">{goal.description}</p>
                    <p className="text-xs text-amber-700">Jusqu'à: {goal.until}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Change Reasons */}
          {goals.changeReasons.length > 0 && (
            <div>
              <p className="text-sm font-medium text-blue-900 mb-2">Raisons des changements</p>
              <div className="space-y-2">
                {goals.changeReasons.map((reason, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-blue-200">
                    <p className="text-sm text-blue-900 mb-1">{reason.type}</p>
                    <p className="text-xs text-blue-800 mb-1">{reason.description}</p>
                    <p className="text-xs text-blue-700">Confiance: {reason.confidence}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Global Confidence */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-600">Confiance globale</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-bold ${getConfidenceColor(goals.globalConfidence)}`}>
              {goals.globalConfidence}%
            </span>
          </div>

          {/* Goal Recommendations */}
          {goals.goalRecommendations.length > 0 && (
            <div>
              <p className="text-sm font-medium text-blue-900 mb-2">Recommandations</p>
              <div className="space-y-2">
                {goals.goalRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-white rounded border border-blue-200">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">{recommendation}</p>
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

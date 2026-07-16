// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Calendar, TrendingUp, TrendingDown, Target, Award, ArrowRight, CheckCircle, Sparkles, Clock, AlertTriangle, Lightbulb, BarChart3, RefreshCw, Shield, Zap, Plus, Trash2, Globe } from "lucide-react";

export interface DailySummary {
  sinceLastVisit: {
    newObservations: string[];
    progression: string[];
    regression: string[];
    goalsAchieved: string[];
    newPriorities: string[];
    newRecommendations: string[];
    newOpportunities: string[];
  };
  today: {
    priority: string;
    exercise: string;
    goal: string;
    progression: string;
    nextStep: string;
  };
  satisfaction: {
    smallWins: string[];
    progression: string;
    achievements: string[];
  };
  history: {
    whereYouWere: string;
    whereYouAre: string;
    whereYouAreGoing: string;
  };
  reward: {
    goalAchieved: string;
    recognition: string;
  };
  absolutePriority?: {
    action: string;
    reason: string;
    expectedImpact: string;
    urgency: string;
  };
  commitmentTracking?: {
    completedCount: number;
    totalCount: number;
    completedActions: string[];
    pendingActions: string[];
    abandonedActions: string[];
  };
  conclusionEvolution?: {
    confirmedCount: number;
    revisedCount: number;
    abandonedCount: number;
    newCount: number;
    changes: {
      type: string;
      oldConclusion: string;
      newConclusion: string;
      explanation: string;
    }[];
  };
  confidenceEvolution?: {
    previousConfidence: number;
    currentConfidence: number;
    change: number;
    reason: string;
  };
  synchronizationStatus?: {
    isSynchronized: boolean;
    globalCoherence: number;
    synchronizedAnalyses: number;
    totalAnalyses: number;
    lastConflictResolved?: string;
    reason: string;
  };
  goalStatus?: {
    primaryGoal: string;
    goalOfTheMoment: string;
    newGoals: string[];
    completedGoals: string[];
    mergedGoals: string[];
    deletedGoals: string[];
    postponedGoals: string[];
    reason: string;
  };
  marketContext?: {
    newOpportunities: string[];
    newTrends: string[];
    marketEvolution: string[];
    importantChanges: string[];
    reason: string;
  };
}

interface DailySummaryProps {
  summary: DailySummary;
}

export function DailySummary({ summary }: DailySummaryProps) {
  const hasChanges = 
    summary.sinceLastVisit.newObservations.length > 0 ||
    summary.sinceLastVisit.progression.length > 0 ||
    summary.sinceLastVisit.regression.length > 0 ||
    summary.sinceLastVisit.goalsAchieved.length > 0 ||
    summary.sinceLastVisit.newPriorities.length > 0 ||
    summary.sinceLastVisit.newRecommendations.length > 0 ||
    summary.sinceLastVisit.newOpportunities.length > 0;

  const hasSatisfaction = 
    summary.satisfaction.smallWins.length > 0 ||
    summary.satisfaction.achievements.length > 0;

  const hasReward = summary.reward.goalAchieved && summary.reward.goalAchieved.length > 0;

  return (
    <div className="space-y-6">
      {/* Commitment Tracking */}
      {summary.commitmentTracking && (
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
          <CardHeader className="border-b border-teal-200">
            <CardTitle className="text-teal-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Suivi des engagements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <p className="text-sm text-teal-900">
                Depuis notre dernière interaction, tu as tenu <span className="font-bold">{summary.commitmentTracking.completedCount}</span> engagement{summary.commitmentTracking.completedCount > 1 ? "s" : ""} sur <span className="font-bold">{summary.commitmentTracking.totalCount}</span>.
              </p>
              {summary.commitmentTracking.completedActions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-teal-700 mb-1">Actions réalisées:</p>
                  <ul className="space-y-1 text-sm text-teal-800">
                    {summary.commitmentTracking.completedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {summary.commitmentTracking.pendingActions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-teal-700 mb-1">Actions en attente:</p>
                  <ul className="space-y-1 text-sm text-teal-800">
                    {summary.commitmentTracking.pendingActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {summary.commitmentTracking.abandonedActions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-teal-700 mb-1">Actions abandonnées:</p>
                  <ul className="space-y-1 text-sm text-teal-800">
                    {summary.commitmentTracking.abandonedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conclusion Evolution */}
      {summary.conclusionEvolution && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
          <CardHeader className="border-b border-indigo-200">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Évolution de mes conclusions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2 bg-white rounded border border-green-200">
                  <p className="text-xs text-green-600">Confirmées</p>
                  <p className="text-lg font-bold text-green-900">{summary.conclusionEvolution.confirmedCount}</p>
                </div>
                <div className="p-2 bg-white rounded border border-blue-200">
                  <p className="text-xs text-blue-600">Révisées</p>
                  <p className="text-lg font-bold text-blue-900">{summary.conclusionEvolution.revisedCount}</p>
                </div>
                <div className="p-2 bg-white rounded border border-red-200">
                  <p className="text-xs text-red-600">Abandonnées</p>
                  <p className="text-lg font-bold text-red-900">{summary.conclusionEvolution.abandonedCount}</p>
                </div>
                <div className="p-2 bg-white rounded border border-purple-200">
                  <p className="text-xs text-purple-600">Nouvelles</p>
                  <p className="text-lg font-bold text-purple-900">{summary.conclusionEvolution.newCount}</p>
                </div>
              </div>
              {summary.conclusionEvolution.changes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-indigo-700 mb-2">Changements récents</p>
                  <div className="space-y-2">
                    {summary.conclusionEvolution.changes.slice(0, 3).map((change, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-indigo-200">
                        <p className="text-xs text-indigo-900 mb-1">{change.explanation}</p>
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confidence Evolution */}
      {summary.confidenceEvolution && (
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
          <CardHeader className="border-b border-teal-200">
            <CardTitle className="text-teal-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Évolution de la confiance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-teal-200">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-teal-600">Confiance précédente:</p>
                  <span className="text-lg font-bold text-teal-900">{summary.confidenceEvolution.previousConfidence}%</span>
                </div>
                <div className="flex items-center gap-2">
                  {summary.confidenceEvolution.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-lg font-bold ${summary.confidenceEvolution.change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {summary.confidenceEvolution.change > 0 ? "+" : ""}{summary.confidenceEvolution.change}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-teal-600">Confiance actuelle:</p>
                  <span className="text-lg font-bold text-teal-900">{summary.confidenceEvolution.currentConfidence}%</span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-teal-200">
                <p className="text-sm font-medium text-teal-900 mb-1">Raison</p>
                <p className="text-sm text-teal-800">{summary.confidenceEvolution.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Synchronization Status */}
      {summary.synchronizationStatus && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Statut de synchronisation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-600">Cohérence globale</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${summary.synchronizationStatus.globalCoherence >= 90 ? "bg-green-100 text-green-800" : summary.synchronizationStatus.globalCoherence >= 70 ? "bg-blue-100 text-blue-800" : summary.synchronizationStatus.globalCoherence >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                  {summary.synchronizationStatus.globalCoherence}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-600">Analyses synchronisées</p>
                </div>
                <span className="text-lg font-bold text-purple-900">
                  {summary.synchronizationStatus.synchronizedAnalyses} / {summary.synchronizationStatus.totalAnalyses}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-600">Synchronisé</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${summary.synchronizationStatus.isSynchronized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {summary.synchronizationStatus.isSynchronized ? "Oui" : "Non"}
                </span>
              </div>
              {summary.synchronizationStatus.lastConflictResolved && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <RefreshCw className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-900">Dernier conflit résolu</p>
                  </div>
                  <p className="text-xs text-green-800">{summary.synchronizationStatus.lastConflictResolved}</p>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Raison</p>
                <p className="text-sm text-purple-800">{summary.synchronizationStatus.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Status */}
      {summary.goalStatus && (
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
                <p className="text-sm text-blue-800">{summary.goalStatus.primaryGoal}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">Objectif du moment</p>
                </div>
                <p className="text-sm text-purple-800">{summary.goalStatus.goalOfTheMoment}</p>
              </div>
              {summary.goalStatus.newGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Nouveaux objectifs</p>
                  <div className="space-y-1">
                    {summary.goalStatus.newGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Plus className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {summary.goalStatus.completedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-teal-200">
                  <p className="text-sm font-medium text-teal-900 mb-2">Objectifs terminés</p>
                  <div className="space-y-1">
                    {summary.goalStatus.completedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-teal-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {summary.goalStatus.mergedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Objectifs fusionnés</p>
                  <div className="space-y-1">
                    {summary.goalStatus.mergedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <RefreshCw className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {summary.goalStatus.deletedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Objectifs supprimés</p>
                  <div className="space-y-1">
                    {summary.goalStatus.deletedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Trash2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {summary.goalStatus.postponedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Objectifs reportés</p>
                  <div className="space-y-1">
                    {summary.goalStatus.postponedGoals.map((goal, index) => (
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
                <p className="text-sm text-blue-800">{summary.goalStatus.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Context */}
      {summary.marketContext && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
          <CardHeader className="border-b border-emerald-200">
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Évolutions du Marché
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {summary.marketContext.newOpportunities.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Nouvelles opportunités</p>
                  <div className="space-y-1">
                    {summary.marketContext.newOpportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {summary.marketContext.newTrends.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Nouvelles tendances</p>
                  <div className="space-y-1">
                    {summary.marketContext.newTrends.map((trend, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-800">{trend}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {summary.marketContext.marketEvolution.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">Évolution du marché</p>
                  <div className="space-y-1">
                    {summary.marketContext.marketEvolution.map((evolution, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800">{evolution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {summary.marketContext.importantChanges.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Changements importants</p>
                  <div className="space-y-1">
                    {summary.marketContext.importantChanges.map((change, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{change}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-1">Raison</p>
                <p className="text-sm text-emerald-800">{summary.marketContext.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Since Last Visit */}
      {hasChanges && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Depuis ta dernière visite
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {summary.sinceLastVisit.progression.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Progression
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {summary.sinceLastVisit.progression.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.sinceLastVisit.regression.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Régression
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {summary.sinceLastVisit.regression.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.sinceLastVisit.goalsAchieved.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Objectifs atteints
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {summary.sinceLastVisit.goalsAchieved.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.sinceLastVisit.newPriorities.length > 0 && (
                <div>
                  <h4 className="font-medium text-purple-700 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Nouvelles priorités
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {summary.sinceLastVisit.newPriorities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.sinceLastVisit.newRecommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-indigo-700 mb-2">Nouvelles recommandations</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {summary.sinceLastVisit.newRecommendations.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.sinceLastVisit.newOpportunities.length > 0 && (
                <div>
                  <h4 className="font-medium text-amber-700 mb-2">Nouvelles opportunités</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {summary.sinceLastVisit.newOpportunities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today View */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <CardHeader className="border-b border-blue-200">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Aujourd'hui
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Absolute Priority - Best Investment */}
            {summary.absolutePriority && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-2">Le meilleur investissement pour ta carrière aujourd'hui est...</p>
                <p className="text-lg font-bold text-amber-900 mb-2">{summary.absolutePriority.action}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-amber-600 font-medium">Raison:</span>
                    <span className="text-sm text-amber-800">{summary.absolutePriority.reason}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-amber-600 font-medium">Impact attendu:</span>
                    <span className="text-sm text-amber-800">{summary.absolutePriority.expectedImpact}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-amber-600 font-medium">Urgence:</span>
                    <span className="text-sm text-amber-800">{summary.absolutePriority.urgency}</span>
                  </div>
                </div>
              </div>
            )}
            <div>
              <p className="font-semibold text-lg text-blue-900 mb-1">{summary.today.priority}</p>
              <p className="text-sm text-blue-700">{summary.today.exercise}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-900 mb-1">Objectif</p>
                <p className="text-blue-700">{summary.today.goal}</p>
              </div>
              <div>
                <p className="font-medium text-blue-900 mb-1">Progression</p>
                <p className="text-blue-700">{summary.today.progression}</p>
              </div>
            </div>
            <div>
              <p className="font-medium text-blue-900 mb-1">Prochaine étape</p>
              <p className="text-blue-700">{summary.today.nextStep}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Satisfaction */}
      {hasSatisfaction && (
        <Card className="bg-green-50 border-green-200 shadow-sm">
          <CardHeader className="border-b border-green-200">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {summary.satisfaction.smallWins.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Petites victoires</h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    {summary.satisfaction.smallWins.map((win, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {summary.satisfaction.achievements.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Réalisations</h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    {summary.satisfaction.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="font-medium text-green-900 mb-1">Progression globale</p>
                <p className="text-sm text-green-800">{summary.satisfaction.progression}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Ton parcours
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 mb-1">Où tu étais</p>
              <p className="text-sm text-gray-700">{summary.history.whereYouWere}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Où tu es</p>
              <p className="text-sm text-gray-700">{summary.history.whereYouAre}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Où tu vas</p>
              <p className="text-sm text-gray-700">{summary.history.whereYouAreGoing}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward */}
      {hasReward && (
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-amber-900 mb-1">{summary.reward.goalAchieved}</p>
                <p className="text-sm text-amber-800">{summary.reward.recognition}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

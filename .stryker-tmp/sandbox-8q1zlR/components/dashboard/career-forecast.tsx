// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, TrendingDown, Target, AlertTriangle, Zap, Clock, CheckCircle, ArrowRight, BarChart3, Calendar, Star, Activity, Lightbulb, Shield, AlertCircle, RefreshCw, Plus, Trash2, Globe, Briefcase, XCircle, MessageCircle } from "lucide-react";

export interface CareerForecast {
  today: {
    score: number;
    employability: number;
    mainObjective: string;
    currentTrend: string;
  };
  currentTrajectory: {
    trend: "improving" | "stable" | "declining";
    pace: "fast" | "moderate" | "slow";
    description: string;
  };
  probableFuture: {
    scoreForecast: number;
    employabilityForecast: number;
    objectiveForecast: string;
    nextStepForecast: string;
    timeframe: string;
    description: string;
  };
  why: {
    elements: string[];
    trends: string[];
    goals: string[];
    recommendations: string[];
  };
  whatCanAccelerate: {
    factors: string[];
    actions: string[];
  };
  whatCanSlowDown: {
    factors: string[];
    risks: string[];
  };
  successProbability: {
    probability: number;
    confidence: "high" | "medium" | "low";
    explanation: string;
  };
  predictionConfidence: {
    confidence: "high" | "medium" | "low";
    explanation: string;
    whatCouldInvalidate: string[];
  };
  priorityActions: string[];
  strategyChange?: {
    hasChanged: boolean;
    oldTrajectory: string;
    newTrajectory: string;
    reason: string;
    previousProbability: number;
    currentProbability: number;
  };
  priorityImpact?: {
    priority: string;
    ifAchieved: {
      scoreForecast: number;
      employabilityForecast: number;
      timeframe: string;
      description: string;
    };
    ifIgnored: {
      scoreForecast: number;
      employabilityForecast: number;
      timeframe: string;
      description: string;
    };
  };
  behavioralAdjustment?: {
    behavioralPattern: string;
    completionRate: number;
    adjustedForecast: {
      scoreForecast: number;
      employabilityForecast: number;
      timeframe: string;
      confidence: number;
      reason: string;
    };
  };
  conclusionRevision?: {
    revisedConclusion: string;
    oldConclusion: string;
    reason: string;
    impact: string;
    confidence: number;
  };
  confidenceEvaluation?: {
    forecastConfidence: number;
    confidenceLevel: "very_high" | "high" | "moderate" | "low" | "insufficient";
    reason: string;
    missingData: string[];
    improvementActions: string[];
  };
  synchronizationStatus?: {
    isSynchronized: boolean;
    globalCoherence: number;
    lastSyncTime: string;
    usedAnalyses: string[];
    obsoleteAnalyses?: string[];
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
    growingSectors: string[];
    decliningSectors: string[];
    emergingSkills: string[];
    opportunities: string[];
    risks: string[];
    strategyImpact: string;
    reason: string;
  };
  opportunityContext?: {
    priorityOpportunity: string;
    priorityReason: string;
    compatibleOpportunities: string[];
    opportunitiesToPrepare: string[];
    opportunitiesToAvoid: string[];
    opportunityImpact: string;
    reason: string;
  };
  applicationContext?: {
    priorityApplication: string;
    priorityReason: string;
    applicationsToFollowUp: string[];
    applicationsToPrepare: string[];
    applicationsToAbandon: string[];
    pipelineStatus: string;
    accountabilityMetrics: {
      totalApplications: number;
      followUpsPerformed: number;
      interviewsCompleted: number;
      conversionRate: number;
    };
    applicationImpact: string;
    reason: string;
  };
}

interface CareerForecastProps {
  forecast: CareerForecast;
}

export function CareerForecast({ forecast }: CareerForecastProps) {
  const getTrendIcon = (trend: string) => {
    if (trend === "improving") return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (trend === "declining") return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <BarChart3 className="w-5 h-5 text-blue-600" />;
  };

  const getConfidenceColor = (confidence: string) => {
    if (confidence === "high") return "text-green-600 bg-green-50";
    if (confidence === "medium") return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getConfidenceBadge = (confidence: string) => {
    if (confidence === "high") return "Haute";
    if (confidence === "medium") return "Moyenne";
    return "Faible";
  };

  return (
    <div className="space-y-6">
      {/* Today's State */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <CardHeader className="border-b border-blue-200">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Aujourd'hui
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700 mb-1">Score actuel</p>
              <p className="text-2xl font-bold text-blue-900">{forecast.today.score}/100</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 mb-1">Employabilité</p>
              <p className="text-2xl font-bold text-blue-900">{forecast.today.employability}/100</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-blue-700 mb-1">Objectif principal</p>
              <p className="text-base font-medium text-blue-900">{forecast.today.mainObjective}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-blue-700 mb-1">Tendance actuelle</p>
              <div className="flex items-center gap-2">
                {getTrendIcon(forecast.currentTrajectory.trend)}
                <p className="text-base font-medium text-blue-900">{forecast.currentTrajectory.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Trajectory */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Trajectoire Actuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Tendance</p>
              <div className="flex items-center gap-2">
                {getTrendIcon(forecast.currentTrajectory.trend)}
                <p className="text-sm font-medium text-gray-900 capitalize">{forecast.currentTrajectory.trend}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Rythme</p>
              <p className="text-sm font-medium text-gray-900 capitalize">{forecast.currentTrajectory.pace}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-sm text-gray-900">{forecast.currentTrajectory.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Probable Future */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-sm">
        <CardHeader className="border-b border-purple-200">
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Futur Probable
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-purple-700 mb-1">Score prévu</p>
                <p className="text-2xl font-bold text-purple-900">{forecast.probableFuture.scoreForecast}/100</p>
              </div>
              <div>
                <p className="text-sm text-purple-700 mb-1">Employabilité prévue</p>
                <p className="text-2xl font-bold text-purple-900">{forecast.probableFuture.employabilityForecast}/100</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-purple-700 mb-1">Horizon temporel</p>
              <p className="text-base font-medium text-purple-900">{forecast.probableFuture.timeframe}</p>
            </div>
            <div>
              <p className="text-sm text-purple-700 mb-1">Description</p>
              <p className="text-sm text-purple-900">{forecast.probableFuture.description}</p>
            </div>
            <div>
              <p className="text-sm text-purple-700 mb-1">Objectif prévu</p>
              <p className="text-sm text-purple-900">{forecast.probableFuture.objectiveForecast}</p>
            </div>
            <div>
              <p className="text-sm text-purple-700 mb-1">Prochaine étape prévue</p>
              <p className="text-sm text-purple-900">{forecast.probableFuture.nextStepForecast}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Pourquoi cette prévision ?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {forecast.why.elements.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Éléments analysés</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {forecast.why.elements.map((element, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{element}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {forecast.why.trends.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Tendances observées</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {forecast.why.trends.map((trend, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {forecast.why.goals.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Objectifs en cours</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {forecast.why.goals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {forecast.why.recommendations.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Recommandations</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {forecast.why.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Change */}
      {forecast.strategyChange && forecast.strategyChange.hasChanged && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Changement de stratégie
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-purple-900 font-medium">
                La prévision précédente n'est plus valable car la stratégie a changé.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-xs text-purple-600 mb-1">Ancienne trajectoire</p>
                  <p className="text-sm font-medium text-purple-900">{forecast.strategyChange.oldTrajectory}</p>
                </div>
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-xs text-purple-600 mb-1">Nouvelle trajectoire</p>
                  <p className="text-sm font-bold text-purple-900">{forecast.strategyChange.newTrajectory}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-purple-900 mb-2">Raison du changement</p>
                <p className="text-sm text-purple-800">{forecast.strategyChange.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-xs text-purple-600 mb-1">Probabilité précédente</p>
                  <p className="text-2xl font-bold text-purple-900">{forecast.strategyChange.previousProbability}%</p>
                </div>
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-xs text-purple-600 mb-1">Probabilité actuelle</p>
                  <p className="text-2xl font-bold text-purple-900">{forecast.strategyChange.currentProbability}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Priority Impact */}
      {forecast.priorityImpact && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Impact de la priorité
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-amber-900 mb-2">
                Priorité: {forecast.priorityImpact.priority}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded border border-amber-200">
                  <p className="text-xs text-green-600 mb-2">Si réalisé</p>
                  <p className="text-sm font-medium text-green-900 mb-1">
                    Score: {forecast.priorityImpact.ifAchieved.scoreForecast}/100
                  </p>
                  <p className="text-sm font-medium text-green-900 mb-1">
                    Employabilité: {forecast.priorityImpact.ifAchieved.employabilityForecast}/100
                  </p>
                  <p className="text-xs text-green-800 mb-1">
                    Délai: {forecast.priorityImpact.ifAchieved.timeframe}
                  </p>
                  <p className="text-xs text-green-800">
                    {forecast.priorityImpact.ifAchieved.description}
                  </p>
                </div>
                <div className="p-4 bg-white rounded border border-amber-200">
                  <p className="text-xs text-red-600 mb-2">Si ignoré</p>
                  <p className="text-sm font-medium text-red-900 mb-1">
                    Score: {forecast.priorityImpact.ifIgnored.scoreForecast}/100
                  </p>
                  <p className="text-sm font-medium text-red-900 mb-1">
                    Employabilité: {forecast.priorityImpact.ifIgnored.employabilityForecast}/100
                  </p>
                  <p className="text-xs text-red-800 mb-1">
                    Délai: {forecast.priorityImpact.ifIgnored.timeframe}
                  </p>
                  <p className="text-xs text-red-800">
                    {forecast.priorityImpact.ifIgnored.description}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Behavioral Adjustment */}
      {forecast.behavioralAdjustment && (
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
          <CardHeader className="border-b border-teal-200">
            <CardTitle className="text-teal-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Ajustement comportemental
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-teal-600 mb-1">Pattern comportemental</p>
                  <p className="text-sm font-medium text-teal-900">{forecast.behavioralAdjustment.behavioralPattern}</p>
                </div>
                <div>
                  <p className="text-xs text-teal-600 mb-1">Taux de réalisation</p>
                  <p className="text-sm font-medium text-teal-900">{forecast.behavioralAdjustment.completionRate}%</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-teal-200">
                <p className="text-sm font-medium text-teal-900 mb-2">Prévision ajustée</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-teal-600">Score ajusté</p>
                    <p className="font-medium text-teal-900">{forecast.behavioralAdjustment.adjustedForecast.scoreForecast}/100</p>
                  </div>
                  <div>
                    <p className="text-teal-600">Employabilité ajustée</p>
                    <p className="font-medium text-teal-900">{forecast.behavioralAdjustment.adjustedForecast.employabilityForecast}/100</p>
                  </div>
                  <div>
                    <p className="text-teal-600">Délai ajusté</p>
                    <p className="font-medium text-teal-900">{forecast.behavioralAdjustment.adjustedForecast.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-teal-600">Confiance</p>
                    <p className="font-medium text-teal-900">{forecast.behavioralAdjustment.adjustedForecast.confidence}%</p>
                  </div>
                </div>
                <p className="text-xs text-teal-800 mt-2">{forecast.behavioralAdjustment.adjustedForecast.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conclusion Revision */}
      {forecast.conclusionRevision && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
          <CardHeader className="border-b border-indigo-200">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Révision de conclusion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-900 mb-2">Ancienne conclusion</p>
                <p className="text-sm text-indigo-800">{forecast.conclusionRevision.oldConclusion}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-900 mb-2">Nouvelle conclusion</p>
                <p className="text-sm text-indigo-800">{forecast.conclusionRevision.revisedConclusion}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-900 mb-2">Raison</p>
                <p className="text-sm text-indigo-800">{forecast.conclusionRevision.reason}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-900 mb-2">Impact</p>
                <p className="text-sm text-indigo-800">{forecast.conclusionRevision.impact}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-600">Confiance</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(forecast.conclusionRevision.confidence.toString())}`}>
                  {forecast.conclusionRevision.confidence}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confidence Evaluation */}
      {forecast.confidenceEvaluation && (
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
          <CardHeader className="border-b border-teal-200">
            <CardTitle className="text-teal-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Évaluation de confiance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-teal-200">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-teal-600" />
                  <p className="text-sm text-teal-600">Confiance de la prévision</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${getConfidenceColor(forecast.confidenceEvaluation.forecastConfidence.toString())}`}>
                  {forecast.confidenceEvaluation.forecastConfidence}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-teal-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  <p className="text-sm text-teal-600">Niveau de confiance</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getConfidenceColor(forecast.confidenceEvaluation.forecastConfidence.toString())}`}>
                  {forecast.confidenceEvaluation.confidenceLevel === "very_high" ? "Très élevée" : forecast.confidenceEvaluation.confidenceLevel === "high" ? "Élevée" : forecast.confidenceEvaluation.confidenceLevel === "moderate" ? "Modérée" : forecast.confidenceEvaluation.confidenceLevel === "low" ? "Faible" : "Insuffisante"}
                </span>
              </div>
              <div className="p-4 bg-white rounded-lg border border-teal-200">
                <p className="text-sm font-medium text-teal-900 mb-2">Raison</p>
                <p className="text-sm text-teal-800">{forecast.confidenceEvaluation.reason}</p>
              </div>
              {forecast.confidenceEvaluation.missingData.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-900 mb-2">Données manquantes</p>
                  <ul className="space-y-1">
                    {forecast.confidenceEvaluation.missingData.map((data, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-orange-800">
                        <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span>{data}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {forecast.confidenceEvaluation.improvementActions.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Actions d'amélioration</p>
                  <ul className="space-y-1">
                    {forecast.confidenceEvaluation.improvementActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
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

      {/* Synchronization Status */}
      {forecast.synchronizationStatus && (
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
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${getConfidenceColor(forecast.synchronizationStatus.globalCoherence.toString())}`}>
                  {forecast.synchronizationStatus.globalCoherence}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-600">Synchronisé</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${forecast.synchronizationStatus.isSynchronized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {forecast.synchronizationStatus.isSynchronized ? "Oui" : "Non"}
                </span>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2">Analyses utilisées</p>
                <div className="space-y-1">
                  {forecast.synchronizationStatus.usedAnalyses.map((analysis, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-purple-800">{analysis}</p>
                    </div>
                  ))}
                </div>
              </div>
              {forecast.synchronizationStatus.obsoleteAnalyses && forecast.synchronizationStatus.obsoleteAnalyses.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Analyses obsolètes</p>
                  <div className="space-y-1">
                    {forecast.synchronizationStatus.obsoleteAnalyses.map((analysis, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{analysis}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Status */}
      {forecast.goalStatus && (
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
                <p className="text-sm text-blue-800">{forecast.goalStatus.primaryGoal}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">Objectif du moment</p>
                </div>
                <p className="text-sm text-purple-800">{forecast.goalStatus.goalOfTheMoment}</p>
              </div>
              {forecast.goalStatus.newGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Nouveaux objectifs</p>
                  <div className="space-y-1">
                    {forecast.goalStatus.newGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Plus className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.goalStatus.completedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-teal-200">
                  <p className="text-sm font-medium text-teal-900 mb-2">Objectifs terminés</p>
                  <div className="space-y-1">
                    {forecast.goalStatus.completedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-teal-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.goalStatus.mergedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Objectifs fusionnés</p>
                  <div className="space-y-1">
                    {forecast.goalStatus.mergedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <RefreshCw className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.goalStatus.deletedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Objectifs supprimés</p>
                  <div className="space-y-1">
                    {forecast.goalStatus.deletedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Trash2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.goalStatus.postponedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Objectifs reportés</p>
                  <div className="space-y-1">
                    {forecast.goalStatus.postponedGoals.map((goal, index) => (
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
                <p className="text-sm text-blue-800">{forecast.goalStatus.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Context */}
      {forecast.marketContext && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
          <CardHeader className="border-b border-emerald-200">
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Contexte du Marché
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {forecast.marketContext.growingSectors.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Secteurs en croissance</p>
                  <div className="space-y-1">
                    {forecast.marketContext.growingSectors.map((sector, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{sector}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.marketContext.emergingSkills.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Compétences émergentes</p>
                  <div className="space-y-1">
                    {forecast.marketContext.emergingSkills.map((skill, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-800">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.marketContext.opportunities.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Opportunités détectées</p>
                  <div className="space-y-1">
                    {forecast.marketContext.opportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.marketContext.risks.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Risques</p>
                  <div className="space-y-1">
                    {forecast.marketContext.risks.map((risk, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{risk}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-1">Impact sur la stratégie</p>
                <p className="text-sm text-emerald-800">{forecast.marketContext.strategyImpact}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-1">Raison</p>
                <p className="text-sm text-emerald-800">{forecast.marketContext.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunity Context */}
      {forecast.opportunityContext && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
          <CardHeader className="border-b border-blue-200">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Contexte des Opportunités
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Opportunité prioritaire</p>
                <p className="text-sm text-blue-800 mb-2">{forecast.opportunityContext.priorityOpportunity}</p>
                <p className="text-xs text-blue-600">{forecast.opportunityContext.priorityReason}</p>
              </div>
              {forecast.opportunityContext.compatibleOpportunities.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Opportunités compatibles</p>
                  <div className="space-y-1">
                    {forecast.opportunityContext.compatibleOpportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.opportunityContext.opportunitiesToPrepare.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Opportunités à préparer</p>
                  <div className="space-y-1">
                    {forecast.opportunityContext.opportunitiesToPrepare.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.opportunityContext.opportunitiesToAvoid.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Opportunités à éviter</p>
                  <div className="space-y-1">
                    {forecast.opportunityContext.opportunitiesToAvoid.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Impact sur la prévision</p>
                <p className="text-sm text-blue-800">{forecast.opportunityContext.opportunityImpact}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Raison</p>
                <p className="text-sm text-blue-800">{forecast.opportunityContext.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Context */}
      {forecast.applicationContext && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Contexte des Candidatures
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2">Candidature prioritaire</p>
                <p className="text-sm text-purple-800 mb-2">{forecast.applicationContext.priorityApplication}</p>
                <p className="text-xs text-purple-600">{forecast.applicationContext.priorityReason}</p>
              </div>
              {forecast.applicationContext.applicationsToFollowUp.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-900 mb-2">Relances à effectuer</p>
                  <div className="space-y-1">
                    {forecast.applicationContext.applicationsToFollowUp.map((application, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-orange-800">{application}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.applicationContext.applicationsToPrepare.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Candidatures à préparer</p>
                  <div className="space-y-1">
                    {forecast.applicationContext.applicationsToPrepare.map((application, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{application}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {forecast.applicationContext.applicationsToAbandon.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Candidatures à abandonner</p>
                  <div className="space-y-1">
                    {forecast.applicationContext.applicationsToAbandon.map((application, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{application}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Statut du pipeline</p>
                <p className="text-sm text-purple-800">{forecast.applicationContext.pipelineStatus}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Métriques accountability</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-purple-800">
                  <div><span className="font-medium">Total:</span> {forecast.applicationContext.accountabilityMetrics.totalApplications}</div>
                  <div><span className="font-medium">Relances:</span> {forecast.applicationContext.accountabilityMetrics.followUpsPerformed}</div>
                  <div><span className="font-medium">Entretiens:</span> {forecast.applicationContext.accountabilityMetrics.interviewsCompleted}</div>
                  <div><span className="font-medium">Conversion:</span> {forecast.applicationContext.accountabilityMetrics.conversionRate}%</div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Impact sur la prévision</p>
                <p className="text-sm text-purple-800">{forecast.applicationContext.applicationImpact}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Raison</p>
                <p className="text-sm text-purple-800">{forecast.applicationContext.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* What Can Accelerate */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Ce qui peut accélérer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {forecast.whatCanAccelerate.factors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-green-700 mb-2">Facteurs accélérateurs</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {forecast.whatCanAccelerate.factors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {forecast.whatCanAccelerate.actions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-green-700 mb-2">Actions prioritaires</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {forecast.whatCanAccelerate.actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* What Can Slow Down */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Ce qui peut ralentir
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {forecast.whatCanSlowDown.factors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">Facteurs de ralentissement</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {forecast.whatCanSlowDown.factors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {forecast.whatCanSlowDown.risks.length > 0 && (
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">Risques identifiés</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {forecast.whatCanSlowDown.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success Probability */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Probabilité de réussite
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Probabilité</p>
              <p className="text-2xl font-bold text-gray-900">{forecast.successProbability.probability}%</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Confiance</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(forecast.successProbability.confidence)}`}>
                {getConfidenceBadge(forecast.successProbability.confidence)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Explication</p>
              <p className="text-sm text-gray-900">{forecast.successProbability.explanation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Confidence */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Confiance de la prédiction
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Confiance</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(forecast.predictionConfidence.confidence)}`}>
                {getConfidenceBadge(forecast.predictionConfidence.confidence)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Explication</p>
              <p className="text-sm text-gray-900">{forecast.predictionConfidence.explanation}</p>
            </div>
            {forecast.predictionConfidence.whatCouldInvalidate.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Ce qui pourrait invalider la prévision</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {forecast.predictionConfidence.whatCouldInvalidate.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Priority Actions */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-green-900 mb-2">Actions prioritaires pour influencer la prévision</p>
              <ul className="space-y-1 text-sm text-green-800">
                {forecast.priorityActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

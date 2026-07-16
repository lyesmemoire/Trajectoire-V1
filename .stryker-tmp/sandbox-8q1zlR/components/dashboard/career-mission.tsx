// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/components/design-system";
import { Target, Flag, Clock, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, ArrowRight, Calendar, Shield, Settings, History, MapPin, Star, Award, Compass } from "lucide-react";

interface CareerMissionProps {
  mission: {
    mission: {
      id: string;
      title: string;
      description: string;
      successCriteria: string[];
      targetTimeline: {
        startDate: string;
        endDate: string;
        durationWeeks: number;
      };
      priority: "primary" | "secondary" | "tertiary";
      status: "not_started" | "in_progress" | "paused" | "completed" | "cancelled";
      createdAt: string;
      updatedAt: string;
    };
    phases: Array<{
      id: string;
      name: string;
      title: string;
      description: string;
      status: string;
      progress: number;
      estimatedDuration: string;
    }>;
    currentPhase: {
      phaseId: string;
      phaseName: string;
      progress: number;
      timeElapsed: string;
      timeRemaining: string;
      entryCriteriaMet: boolean;
      exitCriteriaMet: boolean;
      blockingIssues: string[];
    };
    milestones: Array<{
      id: string;
      title: string;
      description: string;
      targetDate: string;
      status: string;
      progress: number;
    }>;
    progression: {
      overallProgress: number;
      phaseProgress: number;
      milestonesAchieved: number;
      milestonesTotal: number;
      timeElapsed: string;
      timeRemaining: string;
      progressVelocity: "ahead_of_schedule" | "on_schedule" | "behind_schedule" | "stalled";
    };
    deviations: {
      detected: boolean;
      type: string;
      severity: string;
      description: string;
      impact: string;
      recommendedActions: string[];
    };
    risks: {
      topRisks: string[];
      mitigationStrategies: string[];
    };
    recalibration: {
      needed: boolean;
      type: string;
      reasoning: string;
      expectedImpact: string;
      confidence: number;
    };
    missionProbability: {
      successProbability: number;
      onTimeProbability: number;
      factors: {
        positive: string[];
        negative: string[];
      };
      confidence: number;
    };
    explainability: {
      whyThisMission: string;
      whyCurrentPhase: string;
      whyThisTimeline: string;
      observationsUsed: string[];
      limitations: string[];
    };
    secondaryMissions: Array<{
      id: string;
      title: string;
      status: string;
      reason: string;
      priority: string;
    }>;
    adjustmentHistory: Array<{
      date: string;
      type: string;
      reason: string;
      changes: string[];
    }>;
    confidence: number;
    evidenceLevel: string;
    dataQuality: number;
  };
}

export function CareerMission({ mission }: CareerMissionProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "primary":
        return "bg-red-100 text-red-700";
      case "secondary":
        return "bg-blue-100 text-blue-700";
      case "tertiary":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "paused":
        return "bg-amber-100 text-amber-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getVelocityColor = (velocity: string) => {
    switch (velocity) {
      case "ahead_of_schedule":
        return "bg-green-100 text-green-700";
      case "on_schedule":
        return "bg-blue-100 text-blue-700";
      case "behind_schedule":
        return "bg-amber-100 text-amber-700";
      case "stalled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getEvidenceColor = (level: string) => {
    switch (level) {
      case "very_strong":
        return "bg-green-100 text-green-700";
      case "strong":
        return "bg-green-50 text-green-600";
      case "moderate":
        return "bg-blue-50 text-blue-600";
      case "weak":
        return "bg-amber-50 text-amber-600";
      case "very_weak":
        return "bg-orange-50 text-orange-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-700";
    if (confidence >= 70) return "bg-blue-100 text-blue-700";
    if (confidence >= 50) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
      <CardHeader className="border-b border-emerald-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-emerald-900 flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Career Mission
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(mission.mission.priority)}>
              {mission.mission.priority}
            </Badge>
            <Badge className={getStatusColor(mission.mission.status)}>
              {mission.mission.status.replace("_", " ")}
            </Badge>
            <Badge className={getEvidenceColor(mission.evidenceLevel)}>
              {mission.evidenceLevel.replace("_", " ")}
            </Badge>
            <Badge className={getConfidenceColor(mission.confidence)}>
              {mission.confidence}% confiance
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Main Mission */}
        <div className="space-y-4">
          <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Mission principale
          </h3>
          
          <div className="p-4 bg-white rounded-lg border border-emerald-200">
            <h4 className="text-lg font-bold text-emerald-900 mb-2">{mission.mission.title}</h4>
            <p className="text-sm text-emerald-700 mb-3">{mission.mission.description}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-xs text-emerald-600">Durée</p>
                  <p className="text-sm font-medium text-emerald-900">{mission.mission.targetTimeline.durationWeeks} semaines</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-xs text-emerald-600">Temps restant</p>
                  <p className="text-sm font-medium text-emerald-900">{mission.progression.timeRemaining}</p>
                </div>
              </div>
            </div>

            {mission.mission.successCriteria.length > 0 && (
              <div>
                <p className="text-xs font-medium text-emerald-900 mb-1">Critères de succès</p>
                <div className="space-y-1">
                  {mission.mission.successCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-700">{criterion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Phase */}
        <div className="space-y-4">
          <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
            <Flag className="w-4 h-4" />
            Phase actuelle
          </h3>
          
          <div className="p-4 bg-white rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-900">{mission.currentPhase.phaseName}</span>
              <span className="text-sm text-emerald-700">{mission.currentPhase.progress}%</span>
            </div>
            <Progress value={mission.currentPhase.progress} className="h-2 mb-3" />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-emerald-600">Temps écoulé</p>
                <p className="text-sm font-medium text-emerald-900">{mission.currentPhase.timeElapsed}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-600">Temps restant</p>
                <p className="text-sm font-medium text-emerald-900">{mission.currentPhase.timeRemaining}</p>
              </div>
            </div>

            {mission.currentPhase.blockingIssues.length > 0 && (
              <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                <p className="text-xs font-medium text-red-900 mb-1">Problèmes bloquants</p>
                <div className="space-y-1">
                  {mission.currentPhase.blockingIssues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-800">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progression */}
        <div className="space-y-4">
          <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Progression
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-emerald-700">Progression globale</span>
                <span className="text-sm font-medium text-emerald-900">{mission.progression.overallProgress}%</span>
              </div>
              <Progress value={mission.progression.overallProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <p className="text-xs text-emerald-600">Jalons atteints</p>
                <p className="text-sm font-medium text-emerald-900">{mission.progression.milestonesAchieved} / {mission.progression.milestonesTotal}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <p className="text-xs text-emerald-600">Vitesse</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getVelocityColor(mission.progression.progressVelocity)}`}>
                  {mission.progression.progressVelocity.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Milestone */}
        {mission.milestones.filter(m => m.status === "not_started" || m.status === "in_progress").length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Prochain jalon
            </h3>
            
            {(() => {
              const nextMilestone = mission.milestones.find(m => m.status === "not_started" || m.status === "in_progress");
              return nextMilestone ? (
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-900">{nextMilestone.title}</span>
                    <span className="text-sm text-emerald-700">{nextMilestone.progress}%</span>
                  </div>
                  <Progress value={nextMilestone.progress} className="h-2 mb-2" />
                  <p className="text-xs text-emerald-600 mb-1">{nextMilestone.description}</p>
                  <p className="text-xs text-emerald-600">Date cible: {new Date(nextMilestone.targetDate).toLocaleDateString('fr-FR')}</p>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Risks */}
        {mission.risks.topRisks.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Principaux risques
            </h3>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="space-y-2">
                {mission.risks.topRisks.map((risk, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deviations */}
        {mission.deviations.detected && (
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Dérive détectée
            </h3>
            
            <div className={`p-4 rounded-lg border ${getSeverityColor(mission.deviations.severity)}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(mission.deviations.severity)}`}>
                  {mission.deviations.severity}
                </span>
                <span className="text-xs font-medium capitalize">{mission.deviations.type.replace("_", " ")}</span>
              </div>
              <p className="text-sm mb-2">{mission.deviations.description}</p>
              <p className="text-xs mb-2">Impact: {mission.deviations.impact}</p>
              {mission.deviations.recommendedActions.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1">Actions recommandées:</p>
                  <div className="space-y-1">
                    {mission.deviations.recommendedActions.map((action, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <p className="text-xs">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recalibration */}
        {mission.recalibration.needed && (
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Recalibration recommandée
            </h3>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium capitalize">{mission.recalibration.type.replace("_", " ")}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(mission.recalibration.confidence)}`}>
                  {mission.recalibration.confidence}% confiance
                </span>
              </div>
              <p className="text-sm mb-2">{mission.recalibration.reasoning}</p>
              <p className="text-xs">Impact attendu: {mission.recalibration.expectedImpact}</p>
            </div>
          </div>
        )}

        {/* Mission Probability */}
        <div className="space-y-4">
          <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Probabilité de réussite
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-600">Succès</p>
              <p className="text-lg font-bold text-emerald-900">{mission.missionProbability.successProbability}%</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-600">À temps</p>
              <p className="text-lg font-bold text-emerald-900">{mission.missionProbability.onTimeProbability}%</p>
            </div>
          </div>

          {mission.missionProbability.factors.positive.length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-medium text-green-900 mb-1">Facteurs positifs</p>
              <div className="space-y-1">
                {mission.missionProbability.factors.positive.map((factor, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <TrendingUp className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800">{factor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mission.missionProbability.factors.negative.length > 0 && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs font-medium text-red-900 mb-1">Facteurs négatifs</p>
              <div className="space-y-1">
                {mission.missionProbability.factors.negative.map((factor, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <TrendingDown className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800">{factor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Secondary Missions */}
        {mission.secondaryMissions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Missions secondaires
            </h3>
            
            <div className="space-y-2">
              {mission.secondaryMissions.map((secondary, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-emerald-900">{secondary.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(secondary.status)}`}>
                      {secondary.status}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600">{secondary.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adjustment History */}
        {mission.adjustmentHistory.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <History className="w-4 h-4" />
              Historique des ajustements
            </h3>
            
            <div className="space-y-2">
              {mission.adjustmentHistory.slice(0, 3).map((adjustment, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-emerald-600">{new Date(adjustment.date).toLocaleDateString('fr-FR')}</span>
                    <span className="text-xs font-medium text-emerald-900">{adjustment.type}</span>
                  </div>
                  <p className="text-xs text-emerald-700 mb-1">{adjustment.reason}</p>
                  <div className="space-y-1">
                    {adjustment.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-600">{change}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explainability */}
        <div className="space-y-4">
          <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Pourquoi cette mission ?
          </h3>
          
          <div className="p-4 bg-white rounded-lg border border-emerald-200">
            <p className="text-sm text-emerald-800 mb-3">{mission.explainability.whyThisMission}</p>
            
            {mission.explainability.whyCurrentPhase && (
              <div className="mb-3">
                <p className="text-xs font-medium text-emerald-900 mb-1">Pourquoi cette phase ?</p>
                <p className="text-xs text-emerald-700">{mission.explainability.whyCurrentPhase}</p>
              </div>
            )}

            {mission.explainability.limitations.length > 0 && (
              <div>
                <p className="text-xs font-medium text-amber-900 mb-1">Limitations</p>
                <div className="space-y-1">
                  {mission.explainability.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">{limitation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

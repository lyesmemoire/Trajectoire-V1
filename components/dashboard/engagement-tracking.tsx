"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar, Target, Activity, Zap } from "lucide-react";

export interface Commitment {
  id: string;
  description: string;
  state: "pending" | "in_progress" | "completed" | "abandoned" | "replaced" | "obsolete" | "delayed";
  createdDate: string;
  expectedCompletion: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export interface CompletedCommitment {
  id: string;
  description: string;
  completedDate: string;
  timeToComplete: string;
  impact: string;
}

export interface PendingCommitment {
  id: string;
  description: string;
  daysPending: number;
  blockingFactor: string;
}

export interface AbandonedCommitment {
  id: string;
  description: string;
  abandonedDate: string;
  reason: string;
}

export interface ObsoleteCommitment {
  id: string;
  description: string;
  reason: string;
}

export interface CoachingAdaptation {
  approach: string;
  goalComplexity: string;
  followUpFrequency: string;
  encouragementLevel: string;
  timelineAdjustment: string;
}

export interface FollowUpAction {
  action: string;
  explanation: string;
  urgency: "high" | "medium" | "low";
}

export interface EngagementTrackingProps {
  currentCommitments: Commitment[];
  completedCommitments: CompletedCommitment[];
  pendingCommitments: PendingCommitment[];
  abandonedCommitments: AbandonedCommitment[];
  obsoleteCommitments: ObsoleteCommitment[];
  completionRate: number;
  behavioralPattern: string;
  coachingAdaptation: CoachingAdaptation;
  followUpActions: FollowUpAction[];
  nextCheckDate: string;
  confidence: number;
}

export function EngagementTracking({ tracking }: { tracking: EngagementTrackingProps }) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "in_progress":
        return "text-blue-600 bg-blue-50";
      case "pending":
        return "text-amber-600 bg-amber-50";
      case "abandoned":
        return "text-red-600 bg-red-50";
      case "replaced":
        return "text-purple-600 bg-purple-50";
      case "obsolete":
        return "text-gray-600 bg-gray-50";
      case "delayed":
        return "text-orange-600 bg-orange-50";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Activity className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "abandoned":
        return <AlertTriangle className="w-4 h-4" />;
      case "replaced":
        return <Target className="w-4 h-4" />;
      case "obsolete":
        return <Clock className="w-4 h-4" />;
      case "delayed":
        return <Zap className="w-4 h-4" />;
    }
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-600 bg-green-50";
    if (rate >= 60) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
      <CardHeader className="border-b border-teal-200">
        <CardTitle className="text-teal-900 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Engagement & Suivi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Completion Rate */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-teal-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <p className="text-sm text-teal-600">Taux de réalisation</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-bold ${getCompletionRateColor(tracking.completionRate)}`}>
              {tracking.completionRate}%
            </span>
          </div>

          {/* Behavioral Pattern */}
          <div className="p-4 bg-white rounded-lg border border-teal-200">
            <p className="text-xs text-teal-600 mb-1">Pattern comportemental</p>
            <p className="text-sm font-medium text-teal-900">{tracking.behavioralPattern}</p>
          </div>

          {/* Current Commitments */}
          {tracking.currentCommitments.length > 0 && (
            <div>
              <p className="text-sm font-medium text-teal-900 mb-2">Engagements actuels</p>
              <div className="space-y-2">
                {tracking.currentCommitments.slice(0, 3).map((commitment) => (
                  <div key={commitment.id} className="p-3 bg-white rounded border border-teal-200">
                    <div className="flex items-start gap-2">
                      {getStateIcon(commitment.state)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-teal-900">{commitment.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStateColor(commitment.state)}`}>
                            {commitment.state}
                          </span>
                          <span className="text-xs text-teal-600">
                            {commitment.priority === "high" ? "Haute" : commitment.priority === "medium" ? "Moyenne" : "Faible"} priorité
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Commitments */}
          {tracking.completedCommitments.length > 0 && (
            <div>
              <p className="text-sm font-medium text-teal-900 mb-2">Engagements terminés</p>
              <div className="space-y-2">
                {tracking.completedCommitments.slice(0, 3).map((commitment) => (
                  <div key={commitment.id} className="p-3 bg-white rounded border border-green-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900">{commitment.description}</p>
                        <p className="text-xs text-green-700 mt-1">{commitment.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Commitments */}
          {tracking.pendingCommitments.length > 0 && (
            <div>
              <p className="text-sm font-medium text-teal-900 mb-2">Engagements en attente</p>
              <div className="space-y-2">
                {tracking.pendingCommitments.slice(0, 3).map((commitment) => (
                  <div key={commitment.id} className="p-3 bg-white rounded border border-amber-200">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900">{commitment.description}</p>
                        <p className="text-xs text-amber-700 mt-1">{commitment.blockingFactor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Abandoned Commitments */}
          {tracking.abandonedCommitments.length > 0 && (
            <div>
              <p className="text-sm font-medium text-teal-900 mb-2">Engagements abandonnés</p>
              <div className="space-y-2">
                {tracking.abandonedCommitments.slice(0, 3).map((commitment) => (
                  <div key={commitment.id} className="p-3 bg-white rounded border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">{commitment.description}</p>
                        <p className="text-xs text-red-700 mt-1">{commitment.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coaching Adaptation */}
          <div className="p-4 bg-white rounded-lg border border-teal-200">
            <p className="text-sm font-medium text-teal-900 mb-2">Adaptation du coaching</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-teal-600 font-medium">Approche:</span>
                <span className="text-sm text-teal-800">{tracking.coachingAdaptation.approach}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-teal-600 font-medium">Complexité:</span>
                <span className="text-sm text-teal-800">{tracking.coachingAdaptation.goalComplexity}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-teal-600 font-medium">Fréquence:</span>
                <span className="text-sm text-teal-800">{tracking.coachingAdaptation.followUpFrequency}</span>
              </div>
            </div>
          </div>

          {/* Follow-up Actions */}
          {tracking.followUpActions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-teal-900 mb-2">Actions de suivi</p>
              <div className="space-y-2">
                {tracking.followUpActions.slice(0, 3).map((action, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-teal-200">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-teal-900">{action.action}</p>
                        <p className="text-xs text-teal-700 mt-1">{action.explanation}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(action.urgency)}`}>
                          {action.urgency === "high" ? "Urgent" : action.urgency === "medium" ? "Moyen" : "Faible"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Check Date */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-teal-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <p className="text-sm text-teal-600">Prochaine vérification</p>
            </div>
            <p className="text-sm font-medium text-teal-900">{tracking.nextCheckDate}</p>
          </div>

          {/* Confidence */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-teal-200">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <p className="text-sm text-teal-600">Confiance</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCompletionRateColor(tracking.confidence)}`}>
              {tracking.confidence}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

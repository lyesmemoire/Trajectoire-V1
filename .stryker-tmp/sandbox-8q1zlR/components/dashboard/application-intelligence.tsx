// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Briefcase, CheckCircle, TrendingUp, Target, MessageCircle, FileText, Zap } from "lucide-react";

interface ApplicationIntelligenceProps {
  applicationIntelligence?: {
    trackedApplications: Array<{
      id: string;
      title: string;
      company: string;
      state: string;
      currentStage: string;
      nextAction: string;
      probability: number;
    }>;
    priorityApplication: {
      id: string;
      title: string;
      company: string;
      recommendedAction: string;
      reason: string;
    };
    applicationsToFollowUp: Array<{
      id: string;
      title: string;
      company: string;
      followUpReason: string;
      suggestedFollowUpDate: string;
    }>;
    applicationsToPrepare: Array<{
      id: string;
      title: string;
      company: string;
      preparationNeeded: string[];
      estimatedPreparationTime: string;
    }>;
    accountability: {
      totalApplications: number;
      followUpsPerformed: number;
      interviewsCompleted: number;
      rejections: number;
      acceptances: number;
      conversionRate: number;
      averageResponseTime: string;
    };
    confidence: {
      overallConfidence: number;
      dataQuality: string;
    };
    recommendations: Array<{
      recommendation: string;
      type: string;
      priority: string;
      reason: string;
    }>;
  };
}

export function ApplicationIntelligence({ applicationIntelligence }: ApplicationIntelligenceProps) {
  if (!applicationIntelligence) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Application Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Aucune donnée de candidature disponible</p>
        </CardContent>
      </Card>
    );
  }

  const { trackedApplications, priorityApplication, applicationsToFollowUp, applicationsToPrepare, accountability, confidence, recommendations } = applicationIntelligence;

  const getStateColor = (state: string) => {
    switch (state) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
      case "withdrawn":
        return "bg-red-100 text-red-700";
      case "interview_scheduled":
      case "interview_completed":
        return "bg-blue-100 text-blue-700";
      case "offer_received":
      case "negotiation":
        return "bg-purple-100 text-purple-700";
      case "application_sent":
      case "application_viewed":
      case "preselection":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 text-green-700";
    if (confidence >= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Application Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Priority Application */}
        {priorityApplication && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Candidature Prioritaire</span>
            </div>
            <p className="text-sm font-medium text-blue-800">{priorityApplication.title}</p>
            <p className="text-xs text-blue-700 mb-1">{priorityApplication.company}</p>
            <p className="text-xs text-blue-700 mb-1">
              <span className="font-medium">Action recommandée:</span> {priorityApplication.recommendedAction}
            </p>
            <p className="text-xs text-blue-600">{priorityApplication.reason}</p>
          </div>
        )}

        {/* Applications to Follow Up */}
        {applicationsToFollowUp.length > 0 && (
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Relances à effectuer ({applicationsToFollowUp.length})</span>
            </div>
            <div className="space-y-2">
              {applicationsToFollowUp.slice(0, 3).map((app) => (
                <div key={app.id} className="text-xs text-orange-800">
                  <p className="font-medium">{app.title} - {app.company}</p>
                  <p>{app.followUpReason}</p>
                  <p className="text-orange-600">Suggéré: {app.suggestedFollowUpDate}</p>
                </div>
              ))}
              {applicationsToFollowUp.length > 3 && (
                <p className="text-xs text-orange-600">+{applicationsToFollowUp.length - 3} autres relances</p>
              )}
            </div>
          </div>
        )}

        {/* Applications to Prepare */}
        {applicationsToPrepare.length > 0 && (
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">À préparer ({applicationsToPrepare.length})</span>
            </div>
            <div className="space-y-2">
              {applicationsToPrepare.slice(0, 3).map((app) => (
                <div key={app.id} className="text-xs text-purple-800">
                  <p className="font-medium">{app.title} - {app.company}</p>
                  <p>Temps estimé: {app.estimatedPreparationTime}</p>
                  <p className="text-purple-600">{app.preparationNeeded.slice(0, 2).join(", ")}</p>
                </div>
              ))}
              {applicationsToPrepare.length > 3 && (
                <p className="text-xs text-purple-600">+{applicationsToPrepare.length - 3} autres préparations</p>
              )}
            </div>
          </div>
        )}

        {/* Pipeline Overview */}
        {trackedApplications.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Pipeline ({trackedApplications.length})</span>
            </div>
            <div className="space-y-2">
              {trackedApplications.slice(0, 4).map((app) => (
                <div key={app.id} className="flex items-center justify-between text-xs">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{app.title}</p>
                    <p className="text-gray-600">{app.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStateColor(app.state)}`}>
                      {app.currentStage}
                    </span>
                    <span className="text-gray-500">{app.probability}%</span>
                  </div>
                </div>
              ))}
              {trackedApplications.length > 4 && (
                <p className="text-xs text-gray-500">+{trackedApplications.length - 4} autres candidatures</p>
              )}
            </div>
          </div>
        )}

        {/* Accountability Metrics */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Suivi Accountability</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-green-800">
            <div>
              <span className="font-medium">Total:</span> {accountability.totalApplications}
            </div>
            <div>
              <span className="font-medium">Relances:</span> {accountability.followUpsPerformed}
            </div>
            <div>
              <span className="font-medium">Entretiens:</span> {accountability.interviewsCompleted}
            </div>
            <div>
              <span className="font-medium">Conversion:</span> {accountability.conversionRate}%
            </div>
            <div>
              <span className="font-medium">Acceptations:</span> {accountability.acceptances}
            </div>
            <div>
              <span className="font-medium">Refus:</span> {accountability.rejections}
            </div>
          </div>
          <p className="text-xs text-green-700 mt-1">
            <span className="font-medium">Temps moyen de réponse:</span> {accountability.averageResponseTime}
          </p>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Recommandations</span>
            </div>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="text-xs text-yellow-800">
                  <p className="font-medium">{rec.recommendation}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                    <span className="text-yellow-600">{rec.reason}</span>
                  </div>
                </div>
              ))}
              {recommendations.length > 3 && (
                <p className="text-xs text-yellow-600">+{recommendations.length - 3} autres recommandations</p>
              )}
            </div>
          </div>
        )}

        {/* Confidence Level */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-700">Confiance:</span>
            <span className={`px-2 py-1 rounded text-xs ${getConfidenceColor(confidence.overallConfidence)}`}>
              {confidence.overallConfidence}%
            </span>
          </div>
          <span className="text-xs text-gray-500">Qualité: {confidence.dataQuality}</span>
        </div>
      </CardContent>
    </Card>
  );
}

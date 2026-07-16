// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle, AlertTriangle, Clock, Activity, Shield, Zap, BarChart3, RefreshCw } from "lucide-react";

export interface IntelligenceSynchronizedProps {
  globalCoherence: number;
  synchronizedAnalyses: number;
  totalAnalyses: number;
  lastSyncTime: string;
  lastConflictResolved?: string;
  globalConfidence: number;
  analysesWaitingConfirmation: number;
  detectedIncoherencies?: {
    type: string;
    description: string;
    severity: "high" | "medium" | "low";
    involvedAnalyses: string[];
    impact: string;
  }[];
  resolvedConflicts?: {
    type: string;
    description: string;
    resolution: string;
    reason: string;
    selectedAnalysis: string;
    replacedAnalysis: string;
  }[];
  synchronizationActions?: {
    action: string;
    targetAnalysis: string;
    sourceAnalysis: string;
    reason: string;
  }[];
  coherenceReason: string;
  recommendationsForSync: string[];
}

export function IntelligenceSynchronized({ profile }: { profile: IntelligenceSynchronizedProps }) {
  const getCoherenceColor = (coherence: number) => {
    if (coherence >= 90) return "text-green-600 bg-green-50";
    if (coherence >= 70) return "text-blue-600 bg-blue-50";
    if (coherence >= 50) return "text-amber-600 bg-amber-50";
    if (coherence >= 30) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "low":
        return "bg-green-100 text-green-800";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "à l'instant";
    if (diffMins < 60) return `il y a ${diffMins} min`;
    if (diffHours < 24) return `il y a ${diffHours} h`;
    return `il y a ${diffDays} j`;
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
      <CardHeader className="border-b border-indigo-200">
        <CardTitle className="text-indigo-900 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Intelligence Synchronisée
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Global Coherence */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-indigo-600">Cohérence globale</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-bold ${getCoherenceColor(profile.globalCoherence)}`}>
              {profile.globalCoherence}%
            </span>
          </div>

          {/* Synchronized Analyses */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-indigo-600">Analyses synchronisées</p>
            </div>
            <span className="text-lg font-bold text-indigo-900">
              {profile.synchronizedAnalyses} / {profile.totalAnalyses}
            </span>
          </div>

          {/* Last Sync Time */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-indigo-600">Dernière synchronisation</p>
            </div>
            <span className="text-sm font-medium text-indigo-900">
              {formatTimeAgo(profile.lastSyncTime)}
            </span>
          </div>

          {/* Last Conflict Resolved */}
          {profile.lastConflictResolved && (
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="w-4 h-4 text-green-600" />
                <p className="text-sm font-medium text-green-900">Dernier conflit résolu</p>
              </div>
              <p className="text-xs text-green-800">{profile.lastConflictResolved}</p>
            </div>
          )}

          {/* Global Confidence */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-indigo-600">Confiance globale</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-bold ${getCoherenceColor(profile.globalConfidence)}`}>
              {profile.globalConfidence}%
            </span>
          </div>

          {/* Analyses Waiting Confirmation */}
          {profile.analysesWaitingConfirmation > 0 && (
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-600">Analyses en attente de confirmation</p>
              </div>
              <span className="text-lg font-bold text-amber-900">
                {profile.analysesWaitingConfirmation}
              </span>
            </div>
          )}

          {/* Detected Incoherencies */}
          {profile.detectedIncoherencies && profile.detectedIncoherencies.length > 0 && (
            <div>
              <p className="text-sm font-medium text-indigo-900 mb-2">Incohérences détectées</p>
              <div className="space-y-2">
                {profile.detectedIncoherencies.map((incoherence, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-red-900">{incoherence.type}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incoherence.severity)}`}>
                        {incoherence.severity === "high" ? "Haute" : incoherence.severity === "medium" ? "Moyenne" : "Faible"}
                      </span>
                    </div>
                    <p className="text-xs text-red-800 mb-1">{incoherence.description}</p>
                    <p className="text-xs text-red-700">Analyses impliquées: {incoherence.involvedAnalyses.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolved Conflicts */}
          {profile.resolvedConflicts && profile.resolvedConflicts.length > 0 && (
            <div>
              <p className="text-sm font-medium text-indigo-900 mb-2">Conflits résolus</p>
              <div className="space-y-2">
                {profile.resolvedConflicts.map((conflict, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-1">{conflict.type}</p>
                    <p className="text-xs text-green-800 mb-1">{conflict.description}</p>
                    <p className="text-xs text-green-700">{conflict.resolution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synchronization Actions */}
          {profile.synchronizationActions && profile.synchronizationActions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-indigo-900 mb-2">Actions de synchronisation</p>
              <div className="space-y-2">
                {profile.synchronizationActions.map((action, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-1">{action.action}</p>
                    <p className="text-xs text-blue-800">
                      {action.targetAnalysis} ← {action.sourceAnalysis}
                    </p>
                    <p className="text-xs text-blue-700">{action.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coherence Reason */}
          <div className="p-4 bg-white rounded-lg border border-indigo-200">
            <p className="text-sm font-medium text-indigo-900 mb-1">Raison de la cohérence</p>
            <p className="text-sm text-indigo-800">{profile.coherenceReason}</p>
          </div>

          {/* Recommendations for Sync */}
          {profile.recommendationsForSync.length > 0 && (
            <div>
              <p className="text-sm font-medium text-indigo-900 mb-2">Recommandations pour la synchronisation</p>
              <div className="space-y-2">
                {profile.recommendationsForSync.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-white rounded border border-indigo-200">
                    <Zap className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-indigo-800">{recommendation}</p>
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

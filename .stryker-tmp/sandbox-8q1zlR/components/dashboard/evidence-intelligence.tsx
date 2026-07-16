// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/design-system";
import { Shield, CheckCircle, AlertTriangle, TrendingUp, Database, Search, Target, Award, AlertCircle, BarChart3, PieChart } from "lucide-react";

interface EvidenceIntelligenceProps {
  evidence: {
    evidenceSummary: {
      totalEvidence: number;
      strongEvidence: number;
      moderateEvidence: number;
      weakEvidence: number;
      insufficientEvidence: number;
      recentEvidence: number;
      obsoleteEvidence: number;
      criticalEvidence: number;
      candidateSpecificEvidence: number;
      generalEvidence: number;
    };
    evidenceByCategory: {
      directObservations: { count: number; quality: string; freshness: string; stability: string };
      realResults: { count: number; quality: string; freshness: string; stability: string };
      simulations: { count: number; quality: string; freshness: string; stability: string };
      observedBehaviors: { count: number; quality: string; freshness: string; stability: string };
      applications: { count: number; quality: string; freshness: string; stability: string };
      interviews: { count: number; quality: string; freshness: string; stability: string };
      atsAnalyses: { count: number; quality: string; freshness: string; stability: string };
      userInteractions: { count: number; quality: string; freshness: string; stability: string };
      marketTrends: { count: number; quality: string; freshness: string; stability: string };
      achievedGoals: { count: number; quality: string; freshness: string; stability: string };
      honoredCommitments: { count: number; quality: string; freshness: string; stability: string };
      validatedScenarios: { count: number; quality: string; freshness: string; stability: string };
      hypotheses: { count: number; quality: string; freshness: string; stability: string };
      inferences: { count: number; quality: string; freshness: string; stability: string };
    };
    evidenceQualityDistribution: {
      veryStrong: number;
      strong: number;
      moderate: number;
      weak: number;
      insufficient: number;
    };
    evidenceFreshnessDistribution: {
      recent: number;
      stillValid: number;
      aging: number;
      obsolete: number;
    };
    evidenceStabilityDistribution: {
      confirmed: number;
      strengthened: number;
      weakened: number;
      contradicted: number;
      replaced: number;
    };
    detectedIssues: {
      missingEvidence: Array<{ conclusion: string; requiredEvidence: string[]; impact: string; severity: string }>;
      contradictoryEvidence: Array<{ evidence1: string; evidence2: string; conflict: string; resolution: string; severity: string }>;
      insufficientEvidence: Array<{ conclusion: string; currentEvidence: string[]; neededEvidence: string[]; severity: string }>;
      obsoleteEvidence: Array<{ evidence: string; age: string; replacementNeeded: string; severity: string }>;
      recentlyConfirmed: Array<{ evidence: string; confirmationDate: string; impact: string }>;
      becameCritical: Array<{ evidence: string; reason: string; impact: string }>;
    };
    evidenceEvolution: {
      newEvidence: Array<{ id: string; description: string; category: string; dateAdded: string; impact: string }>;
      strengthenedEvidence: Array<{ id: string; description: string; previousQuality: string; currentQuality: string; reason: string }>;
      weakenedEvidence: Array<{ id: string; description: string; previousQuality: string; currentQuality: string; reason: string }>;
      conclusionsChanged: Array<{ conclusion: string; previousState: string; currentState: string; triggeringEvidence: string; impact: string }>;
    };
    confidenceMapping: {
      overallConfidence: number;
      confidenceByEvidence: Array<{ conclusion: string; supportingEvidence: string[]; evidenceQuality: string; calculatedConfidence: number; confidenceExplanation: string }>;
      confidenceGaps: Array<{ conclusion: string; currentConfidence: number; targetConfidence: number; missingEvidence: string[]; recommendedActions: string[] }>;
    };
    candidateSpecificEvidence: {
      totalCandidateSpecific: number;
      totalGeneral: number;
      specificityRatio: number;
      candidateSpecificByCategory: { directObservations: number; realResults: number; observedBehaviors: number; applications: number; interviews: number; userInteractions: number; achievedGoals: number; honoredCommitments: number };
      generalEvidenceByCategory: { marketTrends: number; simulations: number; atsAnalyses: number; inferences: number; hypotheses: number };
    };
    missionEvidence: {
      currentMissionEvidence: Array<{ milestone: string; supportingEvidence: string[]; evidenceQuality: string; progressionStatus: string; confidence: number }>;
      missionProbabilityEvidence: { successProbability: number; supportingEvidence: string[]; evidenceQuality: string; confidence: number };
    };
    evidenceRecommendations: {
      evidenceToCollect: Array<{ evidence: string; priority: string; reason: string; impact: string }>;
      evidenceToValidate: Array<{ evidence: string; currentStatus: string; validationMethod: string; priority: string }>;
      evidenceToRefresh: Array<{ evidence: string; age: string; refreshMethod: string; priority: string }>;
      evidenceToReplace: Array<{ evidence: string; replacement: string; reason: string; priority: string }>;
    };
    globalQuality: {
      overallEvidenceQuality: string;
      overallFreshness: string;
      overallStability: string;
      overallConfidence: number;
      evidenceCoverage: number;
      evidenceConsistency: number;
    };
    confidence: number;
    evidenceLevel: string;
    dataQuality: number;
  };
}

export function EvidenceIntelligence({ evidence }: EvidenceIntelligenceProps) {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "very_strong":
        return "bg-green-100 text-green-700";
      case "strong":
        return "bg-green-50 text-green-600";
      case "moderate":
        return "bg-blue-50 text-blue-600";
      case "weak":
        return "bg-amber-50 text-amber-600";
      case "insufficient":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case "recent":
        return "bg-green-100 text-green-700";
      case "still_valid":
        return "bg-blue-100 text-blue-700";
      case "aging":
        return "bg-amber-100 text-amber-700";
      case "obsolete":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getStabilityColor = (stability: string) => {
    switch (stability) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "strengthened":
        return "bg-green-50 text-green-600";
      case "weakened":
        return "bg-amber-50 text-amber-600";
      case "contradicted":
        return "bg-red-50 text-red-600";
      case "replaced":
        return "bg-gray-50 text-gray-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "low":
        return "bg-blue-100 text-blue-700";
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
    <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-51" />
            Evidence Intelligence
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getQualityColor(evidence.globalQuality.overallEvidenceQuality)}>
              {evidence.globalQuality.overallEvidenceQuality.replace("_", " ")}
            </Badge>
            <Badge className={getConfidenceColor(evidence.globalQuality.overallConfidence)}>
              {evidence.globalQuality.overallConfidence}% confiance
            </Badge>
            <Badge className={getQualityColor(evidence.evidenceLevel)}>
              {evidence.evidenceLevel.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Evidence Summary */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Résumé des preuves
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Total</p>
              <p className="text-lg font-bold text-slate-900">{evidence.evidenceSummary.totalEvidence}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Fortes</p>
              <p className="text-lg font-bold text-green-600">{evidence.evidenceSummary.strongEvidence}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Faibles</p>
              <p className="text-lg font-bold text-red-600">{evidence.evidenceSummary.weakEvidence}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Récentes</p>
              <p className="text-lg font-bold text-blue-600">{evidence.evidenceSummary.recentEvidence}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Obsolètes</p>
              <p className="text-lg font-bold text-amber-600">{evidence.evidenceSummary.obsoleteEvidence}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Critiques</p>
              <p className="text-lg font-bold text-purple-600">{evidence.evidenceSummary.criticalEvidence}</p>
            </div>
          </div>
        </div>

        {/* Evidence Quality Distribution */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Distribution qualité
          </h3>
          
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-700">Très forte</span>
                <span className="text-xs font-medium text-slate-900">{evidence.evidenceQualityDistribution.veryStrong}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(evidence.evidenceQualityDistribution.veryStrong / evidence.evidenceSummary.totalEvidence) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-700">Forte</span>
                <span className="text-xs font-medium text-slate-900">{evidence.evidenceQualityDistribution.strong}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(evidence.evidenceQualityDistribution.strong / evidence.evidenceSummary.totalEvidence) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-700">Moyenne</span>
                <span className="text-xs font-medium text-slate-900">{evidence.evidenceQualityDistribution.moderate}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(evidence.evidenceQualityDistribution.moderate / evidence.evidenceSummary.totalEvidence) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-700">Faible</span>
                <span className="text-xs font-medium text-slate-900">{evidence.evidenceQualityDistribution.weak}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(evidence.evidenceQualityDistribution.weak / evidence.evidenceSummary.totalEvidence) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-700">Insuffisante</span>
                <span className="text-xs font-medium text-slate-900">{evidence.evidenceQualityDistribution.insufficient}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(evidence.evidenceQualityDistribution.insufficient / evidence.evidenceSummary.totalEvidence) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence by Category */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Preuves par catégorie
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Observations directes</p>
              <p className="text-sm font-medium text-slate-900">{evidence.evidenceByCategory.directObservations.count}</p>
              <div className="flex gap-1 mt-1">
                <span className={`text-xs px-1 rounded ${getQualityColor(evidence.evidenceByCategory.directObservations.quality)}`}>{evidence.evidenceByCategory.directObservations.quality.replace("_", " ")}</span>
                <span className={`text-xs px-1 rounded ${getFreshnessColor(evidence.evidenceByCategory.directObservations.freshness)}`}>{evidence.evidenceByCategory.directObservations.freshness.replace("_", " ")}</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Résultats réels</p>
              <p className="text-sm font-medium text-slate-900">{evidence.evidenceByCategory.realResults.count}</p>
              <div className="flex gap-1 mt-1">
                <span className={`text-xs px-1 rounded ${getQualityColor(evidence.evidenceByCategory.realResults.quality)}`}>{evidence.evidenceByCategory.realResults.quality.replace("_", " ")}</span>
                <span className={`text-xs px-1 rounded ${getFreshnessColor(evidence.evidenceByCategory.realResults.freshness)}`}>{evidence.evidenceByCategory.realResults.freshness.replace("_", " ")}</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Simulations</p>
              <p className="text-sm font-medium text-slate-900">{evidence.evidenceByCategory.simulations.count}</p>
              <div className="flex gap-1 mt-1">
                <span className={`text-xs px-1 rounded ${getQualityColor(evidence.evidenceByCategory.simulations.quality)}`}>{evidence.evidenceByCategory.simulations.quality.replace("_", " ")}</span>
                <span className={`text-xs px-1 rounded ${getFreshnessColor(evidence.evidenceByCategory.simulations.freshness)}`}>{evidence.evidenceByCategory.simulations.freshness.replace("_", " ")}</span>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Comportements observés</p>
              <p className="text-sm font-medium text-slate-900">{evidence.evidenceByCategory.observedBehaviors.count}</p>
              <div className="flex gap-1 mt-1">
                <span className={`text-xs px-1 rounded ${getQualityColor(evidence.evidenceByCategory.observedBehaviors.quality)}`}>{evidence.evidenceByCategory.observedBehaviors.quality.replace("_", " ")}</span>
                <span className={`text-xs px-1 rounded ${getFreshnessColor(evidence.evidenceByCategory.observedBehaviors.freshness)}`}>{evidence.evidenceByCategory.observedBehaviors.freshness.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detected Issues */}
        {evidence.detectedIssues.missingEvidence.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Problèmes détectés
            </h3>
            
            <div className="space-y-2">
              {evidence.detectedIssues.missingEvidence.slice(0, 3).map((issue, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                  <p className="text-xs font-medium mb-1">{issue.conclusion}</p>
                  <p className="text-xs mb-1">Impact: {issue.impact}</p>
                  <p className="text-xs">Preuves manquantes: {issue.requiredEvidence.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Evolution */}
        {evidence.evidenceEvolution.newEvidence.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Évolution des preuves
            </h3>
            
            <div className="space-y-2">
              {evidence.evidenceEvolution.newEvidence.slice(0, 3).map((evidence, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-900 mb-1">{evidence.description}</p>
                  <p className="text-xs text-green-700">Impact: {evidence.impact}</p>
                  <p className="text-xs text-green-600">Ajoutée: {new Date(evidence.dateAdded).toLocaleDateString('fr-FR')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Mapping */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Confiance par preuve
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Confiance globale</p>
              <p className="text-lg font-bold text-slate-900">{evidence.confidenceMapping.overallConfidence}%</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Couverture preuves</p>
              <p className="text-lg font-bold text-slate-900">{evidence.globalQuality.evidenceCoverage}%</p>
            </div>
          </div>

          {evidence.confidenceMapping.confidenceGaps.length > 0 && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs font-medium text-amber-900 mb-2">Écarts de confiance</p>
              <div className="space-y-1">
                {evidence.confidenceMapping.confidenceGaps.slice(0, 2).map((gap, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">{gap.conclusion}: {gap.currentConfidence}% → {gap.targetConfidence}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Candidate-Specific Evidence */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Preuves spécifiques au candidat
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Spécifiques</p>
              <p className="text-lg font-bold text-purple-600">{evidence.candidateSpecificEvidence.totalCandidateSpecific}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Générales</p>
              <p className="text-lg font-bold text-blue-600">{evidence.candidateSpecificEvidence.totalGeneral}</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-700">Ratio spécificité</span>
              <span className="text-xs font-medium text-slate-900">{evidence.candidateSpecificEvidence.specificityRatio.toFixed(2)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${evidence.candidateSpecificEvidence.specificityRatio * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Evidence Recommendations */}
        {evidence.evidenceRecommendations.evidenceToCollect.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Recommandations de preuves
            </h3>
            
            <div className="space-y-2">
              {evidence.evidenceRecommendations.evidenceToCollect.slice(0, 3).map((recommendation, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-blue-900">{recommendation.evidence}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">{recommendation.reason}</p>
                  <p className="text-xs text-blue-600">Impact: {recommendation.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Quality */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Qualité globale
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Qualité preuves</p>
              <span className={`text-xs px-2 py-1 rounded ${getQualityColor(evidence.globalQuality.overallEvidenceQuality)}`}>
                {evidence.globalQuality.overallEvidenceQuality.replace("_", " ")}
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Fraîcheur</p>
              <span className={`text-xs px-2 py-1 rounded ${getFreshnessColor(evidence.globalQuality.overallFreshness)}`}>
                {evidence.globalQuality.overallFreshness.replace("_", " ")}
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Stabilité</p>
              <span className={`text-xs px-2 py-1 rounded ${getStabilityColor(evidence.globalQuality.overallStability)}`}>
                {evidence.globalQuality.overallStability.replace("_", " ")}
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">Cohérence</p>
              <p className="text-lg font-bold text-slate-900">{evidence.globalQuality.evidenceConsistency}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

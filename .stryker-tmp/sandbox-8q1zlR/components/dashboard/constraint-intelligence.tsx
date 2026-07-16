// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/components/design-system";
import { Lock, Unlock, AlertTriangle, Clock, Shield, RefreshCw, Target, AlertCircle, BarChart3, MapPin, DollarSign, Users, Briefcase, Heart, Globe, Settings, ArrowUp } from "lucide-react";

interface ConstraintIntelligenceProps {
  constraint: {
    constraintSummary: {
      totalConstraints: number;
      activeConstraints: number;
      criticalConstraints: number;
      temporaryConstraints: number;
      permanentConstraints: number;
      strongConstraints: number;
      weakConstraints: number;
      explicitConstraints: number;
      inferredConstraints: number;
      liftableConstraints: number;
      nonNegotiableConstraints: number;
      toConfirmConstraints: number;
    };
    constraintsByCategory: Array<{
      category: "time" | "financial" | "geographic" | "family" | "professional" | "health" | "language";
      constraints: Array<{
        id: string;
        name: string;
        description: string;
        type: "permanent" | "temporary";
        strength: "strong" | "weak";
        origin: "observed" | "declared" | "inferred" | "to_confirm";
        liftable: boolean;
        negotiable: boolean;
        active: boolean;
        confidence: number;
        value: string | number;
        unit: string;
        since: string;
        lastUpdated: string;
      }>;
      count: number;
      criticalCount: number;
    }>;
    constraintImpact: {
      impossibleRecommendations: string[];
      unrealisticMissions: string[];
      disappearingOpportunities: string[];
      optimalStrategies: string[];
      discardedScenarios: string[];
      adaptedGoals: string[];
      modifiedForecasts: string[];
      filteredOpportunities: string[];
    };
    detectedChanges: {
      newConstraints: Array<{ constraint: string; category: string; origin: string; impact: string; detectedAt: string }>;
      liftedConstraints: Array<{ constraint: string; category: string; reason: string; impact: string; liftedAt: string }>;
      strengthenedConstraints: Array<{ constraint: string; category: string; previousStrength: string; newStrength: string; reason: string; impact: string }>;
      weakenedConstraints: Array<{ constraint: string; category: string; previousStrength: string; newStrength: string; reason: string; impact: string }>;
      contradictoryConstraints: Array<{ constraint1: string; constraint2: string; conflict: string; resolution: string }>;
      forgottenConstraints: Array<{ constraint: string; category: string; whyForgotten: string; impact: string }>;
      becameCritical: Array<{ constraint: string; category: string; whyCritical: string; impact: string }>;
      newFreedoms: Array<{ constraint: string; category: string; whyLifted: string; newPossibilities: string[] }>;
    };
    adaptations: {
      forecastAdaptations: Array<{ forecast: string; constraint: string; adaptation: string; newProbability: number; previousProbability: number }>;
      decisionAdaptations: Array<{ decision: string; constraint: string; adaptation: string; newDecision: string }>;
      missionAdaptations: Array<{ mission: string; constraint: string; adaptation: string; phaseAdjustments: string[]; milestoneAdjustments: string[] }>;
      opportunityAdaptations: Array<{ opportunity: string; constraint: string; action: "filtered" | "prioritized" | "modified"; reason: string }>;
      applicationAdaptations: Array<{ application: string; constraint: string; action: "prioritized" | "deprioritized" | "removed"; reason: string }>;
      scenarioAdaptations: Array<{ scenario: string; constraint: string; action: "discarded" | "modified" | "prioritized"; reason: string }>;
      goalAdaptations: Array<{ goal: string; constraint: string; adaptation: string; timelineAdjustment: string; ambitionAdjustment: string }>;
      personalizationAdaptations: Array<{ aspect: string; constraint: string; adaptation: string }>;
      outcomeAdaptations: Array<{ outcome: string; constraint: string; adaptation: string; roiAdjustment: string }>;
    };
    constraintRecommendations: {
      toLift: Array<{ constraint: string; category: string; howToLift: string; impact: string; priority: "high" | "medium" | "low" }>;
      toRelax: Array<{ constraint: string; category: string; howToRelax: string; impact: string; priority: "high" | "medium" | "low" }>;
      toWorkAround: Array<{ constraint: string; category: string; strategy: string; priority: "high" | "medium" | "low" }>;
      toConfirm: Array<{ constraint: string; category: string; whyToConfirm: string; method: string; priority: "high" | "medium" | "low" }>;
      toMonitor: Array<{ constraint: string; category: string; whyToMonitor: string; indicator: string }>;
    };
    explainability: {
      whyTheseConstraints: string;
      whyThisStrength: string;
      whyThisOrigin: string;
      whyThisImpact: string;
      whyTheseAdaptations: string;
      observationsUsed: string[];
      assumptions: string[];
      limitations: string[];
    };
    constraintEvolution: {
      history: Array<{ date: string; event: "new" | "lifted" | "strengthened" | "weakened" | "confirmed" | "contradicted"; constraint: string; category: string; previousState: string; newState: string; reason: string }>;
      trends: Array<{ constraint: string; trend: "strengthening" | "weakening" | "stable" | "fluctuating"; evidence: string }>;
    };
    globalQuality: {
      overallConstraintClarity: "very_clear" | "clear" | "moderate" | "unclear" | "very_unclear";
      overallConstraintStability: "very_stable" | "stable" | "moderate" | "unstable" | "very_unstable";
      overallConstraintCompleteness: "very_complete" | "complete" | "moderate" | "incomplete" | "very_incomplete";
      overallConstraintConfidence: number;
      constraintCoverage: number;
      constraintConsistency: number;
    };
    confidenceLevel: {
      level: "very_high" | "high" | "moderate" | "low" | "insufficient";
      confidence: number;
      reason: string;
      uncertainDomains: string[];
    };
    dataQuality: {
      completeness: number;
      freshness: number;
      consistency: number;
      reliability: number;
    };
  };
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "time":
      return <Clock className="w-4 h-4" />;
    case "financial":
      return <DollarSign className="w-4 h-4" />;
    case "geographic":
      return <MapPin className="w-4 h-4" />;
    case "family":
      return <Users className="w-4 h-4" />;
    case "professional":
      return <Briefcase className="w-4 h-4" />;
    case "health":
      return <Heart className="w-4 h-4" />;
    case "language":
      return <Globe className="w-4 h-4" />;
    default:
      return <Settings className="w-4 h-4" />;
  }
};

const getStrengthColor = (strength: string) => {
  switch (strength) {
    case "strong":
      return "bg-red-100 text-red-800 border-red-200";
    case "weak":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getOriginColor = (origin: string) => {
  switch (origin) {
    case "declared":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "observed":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "inferred":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "to_confirm":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function ConstraintIntelligence({ constraint }: ConstraintIntelligenceProps) {
  return (
    <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 shadow-sm">
      <CardHeader className="border-b border-rose-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-rose-900 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Constraint Intelligence
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStrengthColor(constraint.globalQuality.overallConstraintClarity)}>
              {constraint.globalQuality.overallConstraintClarity.replace("_", " ")}
            </Badge>
            <Badge className="bg-rose-100 text-rose-800 border-rose-200">
              {constraint.confidenceLevel.level.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Constraint Summary */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <p className="text-xs text-rose-600">Total</p>
            <p className="text-lg font-bold text-rose-900">{constraint.constraintSummary.totalConstraints}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <p className="text-xs text-rose-600">Actives</p>
            <p className="text-lg font-bold text-rose-900">{constraint.constraintSummary.activeConstraints}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <p className="text-xs text-rose-600">Critiques</p>
            <p className="text-lg font-bold text-red-600">{constraint.constraintSummary.criticalConstraints}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <p className="text-xs text-rose-600">Confiance</p>
            <p className="text-lg font-bold text-rose-900">{constraint.globalQuality.overallConstraintConfidence}%</p>
          </div>
        </div>

        {/* Constraint Types */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <p className="text-xs text-rose-600">Permanentes</p>
            <p className="text-sm font-medium text-rose-900">{constraint.constraintSummary.permanentConstraints}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <p className="text-xs text-rose-600">Temporaires</p>
            <p className="text-sm font-medium text-rose-900">{constraint.constraintSummary.temporaryConstraints}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-rose-200">
            <p className="text-xs text-rose-600">À confirmer</p>
            <p className="text-sm font-medium text-orange-600">{constraint.constraintSummary.toConfirmConstraints}</p>
          </div>
        </div>

        {/* Constraints by Category */}
        <div className="space-y-3">
          <h3 className="font-semibold text-rose-900 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Contraintes par catégorie
          </h3>
          <div className="space-y-2">
            {constraint.constraintsByCategory.map((category) => (
              <div key={category.category} className="p-4 bg-white rounded-lg border border-rose-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category.category)}
                    <span className="font-medium text-rose-900 capitalize">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-rose-100 text-rose-800 border-rose-200">
                      {category.count}
                    </Badge>
                    {category.criticalCount > 0 && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        {category.criticalCount} critiques
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {category.constraints.slice(0, 3).map((c) => (
                    <div key={c.id} className="flex items-start gap-2 text-sm">
                      <Badge className={getStrengthColor(c.strength)}>
                        {c.strength}
                      </Badge>
                      <Badge className={getOriginColor(c.origin)}>
                        {c.origin.replace("_", " ")}
                      </Badge>
                      <p className="text-rose-800">{c.name}: {c.value} {c.unit}</p>
                    </div>
                  ))}
                  {category.constraints.length > 3 && (
                    <p className="text-xs text-rose-600">+ {category.constraints.length - 3} autres</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constraint Impact */}
        <div className="space-y-3">
          <h3 className="font-semibold text-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Impact des contraintes
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {constraint.constraintImpact.impossibleRecommendations.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-xs text-red-600 mb-2">Recommandations impossibles</p>
                <div className="space-y-1">
                  {constraint.constraintImpact.impossibleRecommendations.slice(0, 3).map((rec, index) => (
                    <p key={index} className="text-xs text-red-800">{rec}</p>
                  ))}
                </div>
              </div>
            )}
            {constraint.constraintImpact.disappearingOpportunities.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-600 mb-2">Opportunités écartées</p>
                <div className="space-y-1">
                  {constraint.constraintImpact.disappearingOpportunities.slice(0, 3).map((opp, index) => (
                    <p key={index} className="text-xs text-amber-800">{opp}</p>
                  ))}
                </div>
              </div>
            )}
            {constraint.constraintImpact.optimalStrategies.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-600 mb-2">Stratégies optimales</p>
                <div className="space-y-1">
                  {constraint.constraintImpact.optimalStrategies.slice(0, 3).map((strat, index) => (
                    <p key={index} className="text-xs text-green-800">{strat}</p>
                  ))}
                </div>
              </div>
            )}
            {constraint.constraintImpact.filteredOpportunities.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-2">Opportunités filtrées</p>
                <div className="space-y-1">
                  {constraint.constraintImpact.filteredOpportunities.slice(0, 3).map((opp, index) => (
                    <p key={index} className="text-xs text-blue-800">{opp}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detected Changes */}
        <div className="space-y-3">
          <h3 className="font-semibold text-rose-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Changements détectés
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {constraint.detectedChanges.newConstraints.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-600 mb-2">Nouvelles contraintes</p>
                <div className="space-y-1">
                  {constraint.detectedChanges.newConstraints.slice(0, 3).map((c, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ArrowUp className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-green-800">{c.constraint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {constraint.detectedChanges.liftedConstraints.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-2">Contraintes levées</p>
                <div className="space-y-1">
                  {constraint.detectedChanges.liftedConstraints.slice(0, 3).map((c, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Unlock className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800">{c.constraint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {constraint.detectedChanges.becameCritical.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-xs text-red-600 mb-2">Devenues critiques</p>
                <div className="space-y-1">
                  {constraint.detectedChanges.becameCritical.slice(0, 3).map((c, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-800">{c.constraint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {constraint.detectedChanges.newFreedoms.length > 0 && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-600 mb-2">Nouvelles libertés</p>
                <div className="space-y-1">
                  {constraint.detectedChanges.newFreedoms.slice(0, 3).map((c, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Unlock className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-purple-800">{c.constraint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Constraint Recommendations */}
        <div className="space-y-3">
          <h3 className="font-semibold text-rose-900 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Recommandations
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {constraint.constraintRecommendations.toLift.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-600 mb-2">À lever</p>
                <div className="space-y-1">
                  {constraint.constraintRecommendations.toLift.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <p className="text-xs text-green-800">{rec.constraint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {constraint.constraintRecommendations.toWorkAround.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-2">À contourner</p>
                <div className="space-y-1">
                  {constraint.constraintRecommendations.toWorkAround.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <p className="text-xs text-blue-800">{rec.constraint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {constraint.constraintRecommendations.toConfirm.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-600 mb-2">À confirmer</p>
                <div className="space-y-1">
                  {constraint.constraintRecommendations.toConfirm.slice(0, 3).map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <p className="text-xs text-amber-800">{rec.constraint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Quality */}
        <div className="space-y-3">
          <h3 className="font-semibold text-rose-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Qualité globale
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Clarté</p>
              <p className="text-sm font-medium text-rose-900 capitalize">{constraint.globalQuality.overallConstraintClarity.replace("_", " ")}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Stabilité</p>
              <p className="text-sm font-medium text-rose-900 capitalize">{constraint.globalQuality.overallConstraintStability.replace("_", " ")}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Complétude</p>
              <p className="text-sm font-medium text-rose-900 capitalize">{constraint.globalQuality.overallConstraintCompleteness.replace("_", " ")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-rose-700">Couverture</span>
                <span className="text-xs font-medium text-rose-900">{constraint.globalQuality.constraintCoverage}%</span>
              </div>
              <Progress value={constraint.globalQuality.constraintCoverage} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-rose-700">Consistance</span>
                <span className="text-xs font-medium text-rose-900">{constraint.globalQuality.constraintConsistency}%</span>
              </div>
              <Progress value={constraint.globalQuality.constraintConsistency} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/components/design-system";
import { Clock, Zap, DollarSign, Users, MapPin, Heart, Brain, Target, TrendingUp, AlertTriangle, ArrowUp, ArrowDown, Settings, Award, Shield, Info, Minus, Battery, GraduationCap, Network } from "lucide-react";

interface ResourceIntelligenceProps {
  resource: {
    resourceSummary: {
      totalResources: number;
      availableResources: number;
      criticalResources: number;
      underutilizedResources: number;
      overutilizedResources: number;
      increasingResources: number;
      decreasingResources: number;
      stableResources: number;
      highImpactResources: number;
      lowImpactResources: number;
    };
    resourcesByCategory: Array<{
      category: "time" | "energy" | "financial" | "skills" | "network" | "mobility" | "personal" | "health" | "psychological";
      resources: Array<{
        id: string;
        name: string;
        description: string;
        availability: number;
        unit: string;
        evolution: "increasing" | "decreasing" | "stable";
        criticality: "critical" | "important" | "moderate" | "low";
        rarity: "scarce" | "limited" | "abundant";
        currentUtilization: number;
        underutilized: boolean;
        overutilized: boolean;
        potential: number;
        careerImpact: "high" | "medium" | "low";
        confidence: number;
        since: string;
        lastUpdated: string;
      }>;
      count: number;
      criticalCount: number;
      underutilizedCount: number;
      overutilizedCount: number;
    }>;
    resourceOptimization: {
      bestTimeInvestment: {
        investment: string;
        expectedImpact: string;
        resourceEfficiency: number;
        timeRequired: string;
        priority: "high" | "medium" | "low";
      };
      bestBudgetInvestment: {
        investment: string;
        expectedImpact: string;
        resourceEfficiency: number;
        budgetRequired: string;
        priority: "high" | "medium" | "low";
      };
      bestEnergyInvestment: {
        investment: string;
        expectedImpact: string;
        resourceEfficiency: number;
        energyRequired: string;
        priority: "high" | "medium" | "low";
      };
      bestTrainingInvestment: {
        investment: string;
        expectedImpact: string;
        resourceEfficiency: number;
        timeRequired: string;
        budgetRequired: string;
        priority: "high" | "medium" | "low";
      };
      bestNetworkInvestment: {
        investment: string;
        expectedImpact: string;
        resourceEfficiency: number;
        timeRequired: string;
        priority: "high" | "medium" | "low";
      };
    };
    resourceRecommendations: {
      toUse: Array<{ resource: string; category: string; howToUse: string; expectedImpact: string; priority: "high" | "medium" | "low" }>;
      toPreserve: Array<{ resource: string; category: string; whyPreserve: string; preservationStrategy: string; priority: "high" | "medium" | "low" }>;
      toDevelop: Array<{ resource: string; category: string; howToDevelop: string; developmentTime: string; expectedImpact: string; priority: "high" | "medium" | "low" }>;
      toSave: Array<{ resource: string; category: string; whySave: string; savingStrategy: string; priority: "high" | "medium" | "low" }>;
      toDelegate: Array<{ resource: string; category: string; whatToDelegate: string; delegationStrategy: string; priority: "high" | "medium" | "low" }>;
      toAbandon: Array<{ resource: string; category: string; whyAbandon: string; abandonmentStrategy: string; priority: "high" | "medium" | "low" }>;
    };
    detectedChanges: {
      resourceIncreased: Array<{ resource: string; category: string; previousAvailability: number; newAvailability: number; reason: string; impact: string; detectedAt: string }>;
      resourceDecreased: Array<{ resource: string; category: string; previousAvailability: number; newAvailability: number; reason: string; impact: string; detectedAt: string }>;
      newResource: Array<{ resource: string; category: string; availability: number; origin: string; impact: string; detectedAt: string }>;
      resourceLost: Array<{ resource: string; category: string; reason: string; impact: string; lostAt: string }>;
      resourceCritical: Array<{ resource: string; category: string; whyCritical: string; impact: string; detectedAt: string }>;
      resourceOptimized: Array<{ resource: string; category: string; optimization: string; efficiencyGain: number; detectedAt: string }>;
      resourceOverloaded: Array<{ resource: string; category: string; overloadLevel: number; impact: string; detectedAt: string }>;
      resourceAvailable: Array<{ resource: string; category: string; availability: number; newPossibilities: string[]; detectedAt: string }>;
      resourceExhausted: Array<{ resource: string; category: string; reason: string; impact: string; exhaustedAt: string }>;
      resourceInvested: Array<{ resource: string; category: string; investment: string; expectedReturn: string; investedAt: string }>;
      resourceSaved: Array<{ resource: string; category: string; savingStrategy: string; amountSaved: number; savedAt: string }>;
      resourceReallocated: Array<{ resource: string; category: string; from: string; to: string; reason: string; reallocatedAt: string }>;
    };
    resourceEvaluation: {
      blockingResources: Array<{ resource: string; category: string; whatBlocks: string[]; blockingSeverity: "high" | "medium" | "low"; unblockingStrategy: string }>;
      criticalResources: Array<{ resource: string; category: string; whyCritical: string; criticalityLevel: "very_high" | "high" | "moderate" | "low"; preservationPriority: "high" | "medium" | "low" }>;
      unusedResources: Array<{ resource: string; category: string; whyUnused: string; utilizationPotential: number; activationStrategy: string }>;
      wastedResources: Array<{ resource: string; category: string; howWasted: string; wasteAmount: number; reductionStrategy: string }>;
      excessResources: Array<{ resource: string; category: string; excessAmount: number; reallocationOpportunities: string[] }>;
      newCapacities: Array<{ capacity: string; category: string; emergenceReason: string; utilizationOpportunities: string[] }>;
      newWeaknesses: Array<{ weakness: string; category: string; emergenceReason: string; mitigationStrategy: string }>;
    };
    resourceEvolution: {
      history: Array<{ date: string; event: "increased" | "decreased" | "new" | "lost" | "critical" | "optimized" | "overloaded" | "available" | "exhausted" | "invested" | "saved" | "reallocated"; resource: string; category: string; previousState: string; newState: string; reason: string }>;
      trends: Array<{ resource: string; trend: "increasing" | "decreasing" | "stable" | "fluctuating"; evidence: string; projection: string }>;
    };
    explainability: {
      whyTheseResources: string;
      whyThisAvailability: string;
      whyThisCriticality: string;
      whyThisUtilization: string;
      whyTheseOptimizations: string;
      whyTheseRecommendations: string;
      observationsUsed: string[];
      assumptions: string[];
      limitations: string[];
    };
    globalQuality: {
      overallResourceClarity: "very_clear" | "clear" | "moderate" | "unclear" | "very_unclear";
      overallResourceStability: "very_stable" | "stable" | "moderate" | "unstable" | "very_unstable";
      overallResourceCompleteness: "very_complete" | "complete" | "moderate" | "incomplete" | "very_incomplete";
      overallResourceConfidence: number;
      resourceCoverage: number;
      resourceConsistency: number;
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
    case "energy":
      return <Zap className="w-4 h-4" />;
    case "financial":
      return <DollarSign className="w-4 h-4" />;
    case "skills":
      return <GraduationCap className="w-4 h-4" />;
    case "network":
      return <Network className="w-4 h-4" />;
    case "mobility":
      return <MapPin className="w-4 h-4" />;
    case "personal":
      return <Users className="w-4 h-4" />;
    case "health":
      return <Heart className="w-4 h-4" />;
    case "psychological":
      return <Brain className="w-4 h-4" />;
    default:
      return <Settings className="w-4 h-4" />;
  }
};

const getCriticalityColor = (criticality: string) => {
  switch (criticality) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "important":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "moderate":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getEvolutionIcon = (evolution: string) => {
  switch (evolution) {
    case "increasing":
      return <ArrowUp className="w-3 h-3 text-green-600" />;
    case "decreasing":
      return <ArrowDown className="w-3 h-3 text-red-600" />;
    case "stable":
      return <Minus className="w-3 h-3 text-gray-600" />;
    default:
      return null;
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "scarce":
      return "bg-red-100 text-red-800 border-red-200";
    case "limited":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "abundant":
      return "bg-green-100 text-green-800 border-green-200";
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

export function ResourceIntelligence({ resource }: ResourceIntelligenceProps) {
  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
      <CardHeader className="border-b border-emerald-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-emerald-900 flex items-center gap-2">
            <Battery className="w-5 h-5" />
            Resource Intelligence
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getCriticalityColor(resource.globalQuality.overallResourceClarity)}>
              {resource.globalQuality.overallResourceClarity.replace("_", " ")}
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
              {resource.confidenceLevel.level.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Resource Summary */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">Total</p>
            <p className="text-lg font-bold text-emerald-900">{resource.resourceSummary.totalResources}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">Disponibles</p>
            <p className="text-lg font-bold text-emerald-900">{resource.resourceSummary.availableResources}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">Critiques</p>
            <p className="text-lg font-bold text-red-600">{resource.resourceSummary.criticalResources}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">Confiance</p>
            <p className="text-lg font-bold text-emerald-900">{resource.globalQuality.overallResourceConfidence}%</p>
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">Sous-utilisées</p>
            <p className="text-sm font-medium text-amber-600">{resource.resourceSummary.underutilizedResources}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">Sur-utilisées</p>
            <p className="text-sm font-medium text-red-600">{resource.resourceSummary.overutilizedResources}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">En augmentation</p>
            <p className="text-sm font-medium text-green-600">{resource.resourceSummary.increasingResources}</p>
          </div>
        </div>

        {/* Resources by Category */}
        <div className="space-y-3">
          <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Ressources par catégorie
          </h3>
          <div className="space-y-2">
            {resource.resourcesByCategory.map((category) => (
              <div key={category.category} className="p-4 bg-white rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category.category)}
                    <span className="font-medium text-emerald-900 capitalize">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      {category.count}
                    </Badge>
                    {category.criticalCount > 0 && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        {category.criticalCount} critiques
                      </Badge>
                    )}
                    {category.underutilizedCount > 0 && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        {category.underutilizedCount} sous-utilisées
                      </Badge>
                    )}
                    {category.overutilizedCount > 0 && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        {category.overutilizedCount} sur-utilisées
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {category.resources.slice(0, 3).map((r) => (
                    <div key={r.id} className="flex items-start gap-2 text-sm">
                      {getEvolutionIcon(r.evolution)}
                      <Badge className={getCriticalityColor(r.criticality)}>
                        {r.criticality}
                      </Badge>
                      <Badge className={getRarityColor(r.rarity)}>
                        {r.rarity}
                      </Badge>
                      <p className="text-emerald-800">{r.name}: {r.availability} {r.unit}</p>
                      <Progress value={r.currentUtilization} className="w-20 h-2" />
                    </div>
                  ))}
                  {category.resources.length > 3 && (
                    <p className="text-xs text-emerald-600">+ {category.resources.length - 3} autres</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Optimization */}
        <div className="space-y-3">
          <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Optimisations recommandées
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-600 mb-1">Meilleur investissement temps</p>
              <p className="text-sm font-medium text-emerald-900">{resource.resourceOptimization.bestTimeInvestment.investment}</p>
              <p className="text-xs text-emerald-600 mt-1">Efficacité: {resource.resourceOptimization.bestTimeInvestment.resourceEfficiency}%</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-600 mb-1">Meilleur investissement budget</p>
              <p className="text-sm font-medium text-emerald-900">{resource.resourceOptimization.bestBudgetInvestment.investment}</p>
              <p className="text-xs text-emerald-600 mt-1">Efficacité: {resource.resourceOptimization.bestBudgetInvestment.resourceEfficiency}%</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-600 mb-1">Meilleur investissement énergie</p>
              <p className="text-sm font-medium text-emerald-900">{resource.resourceOptimization.bestEnergyInvestment.investment}</p>
              <p className="text-xs text-emerald-600 mt-1">Efficacité: {resource.resourceOptimization.bestEnergyInvestment.resourceEfficiency}%</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-600 mb-1">Meilleur investissement formation</p>
              <p className="text-sm font-medium text-emerald-900">{resource.resourceOptimization.bestTrainingInvestment.investment}</p>
              <p className="text-xs text-emerald-600 mt-1">Efficacité: {resource.resourceOptimization.bestTrainingInvestment.resourceEfficiency}%</p>
            </div>
          </div>
        </div>

        {/* Resource Recommendations */}
        <div className="space-y-3">
          <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Recommandations
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {resource.resourceRecommendations.toUse.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-600 mb-2">À utiliser</p>
                <div className="space-y-1">
                  {resource.resourceRecommendations.toUse.slice(0, 2).map((rec, index) => (
                    <p key={index} className="text-xs text-green-800">{rec.resource}: {rec.howToUse}</p>
                  ))}
                </div>
              </div>
            )}
            {resource.resourceRecommendations.toPreserve.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 mb-2">À préserver</p>
                <div className="space-y-1">
                  {resource.resourceRecommendations.toPreserve.slice(0, 2).map((rec, index) => (
                    <p key={index} className="text-xs text-blue-800">{rec.resource}: {rec.whyPreserve}</p>
                  ))}
                </div>
              </div>
            )}
            {resource.resourceRecommendations.toDevelop.length > 0 && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-600 mb-2">À développer</p>
                <div className="space-y-1">
                  {resource.resourceRecommendations.toDevelop.slice(0, 2).map((rec, index) => (
                    <p key={index} className="text-xs text-purple-800">{rec.resource}: {rec.howToDevelop}</p>
                  ))}
                </div>
              </div>
            )}
            {resource.resourceRecommendations.toSave.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-600 mb-2">À économiser</p>
                <div className="space-y-1">
                  {resource.resourceRecommendations.toSave.slice(0, 2).map((rec, index) => (
                    <p key={index} className="text-xs text-amber-800">{rec.resource}: {rec.whySave}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detected Changes */}
        {resource.detectedChanges.resourceIncreased.length > 0 || resource.detectedChanges.resourceDecreased.length > 0 || resource.detectedChanges.newResource.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Changements détectés
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {resource.detectedChanges.resourceIncreased.length > 0 && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 mb-2">Ressources augmentées</p>
                  <div className="space-y-1">
                    {resource.detectedChanges.resourceIncreased.slice(0, 2).map((change, index) => (
                      <p key={index} className="text-xs text-green-800">{change.resource}: {change.previousAvailability} → {change.newAvailability}</p>
                    ))}
                  </div>
                </div>
              )}
              {resource.detectedChanges.resourceDecreased.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs text-red-600 mb-2">Ressources diminuées</p>
                  <div className="space-y-1">
                    {resource.detectedChanges.resourceDecreased.slice(0, 2).map((change, index) => (
                      <p key={index} className="text-xs text-red-800">{change.resource}: {change.previousAvailability} → {change.newAvailability}</p>
                    ))}
                  </div>
                </div>
              )}
              {resource.detectedChanges.newResource.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 mb-2">Nouvelles ressources</p>
                  <div className="space-y-1">
                    {resource.detectedChanges.newResource.slice(0, 2).map((change, index) => (
                      <p key={index} className="text-xs text-blue-800">{change.resource}: {change.availability}</p>
                    ))}
                  </div>
                </div>
              )}
              {resource.detectedChanges.resourceCritical.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs text-red-600 mb-2">Ressources critiques</p>
                  <div className="space-y-1">
                    {resource.detectedChanges.resourceCritical.slice(0, 2).map((change, index) => (
                      <p key={index} className="text-xs text-red-800">{change.resource}: {change.whyCritical}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Blocking Resources */}
        {resource.resourceEvaluation.blockingResources.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Ressources bloquantes
            </h3>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="space-y-2">
                {resource.resourceEvaluation.blockingResources.slice(0, 3).map((blocking, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-red-800">{blocking.resource}</p>
                    <p className="text-xs text-red-600">Bloque: {blocking.whatBlocks.join(", ")}</p>
                    <p className="text-xs text-red-600">Stratégie: {blocking.unblockingStrategy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Explainability */}
        <div className="space-y-3">
          <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Explications
          </h3>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-sm text-emerald-800 mb-2">{resource.explainability.whyTheseResources}</p>
            <p className="text-sm text-emerald-800 mb-2">{resource.explainability.whyThisAvailability}</p>
            <p className="text-sm text-emerald-800 mb-2">{resource.explainability.whyTheseOptimizations}</p>
          </div>
        </div>

        {/* Data Quality */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">Complétude</p>
            <Progress value={resource.dataQuality.completeness} className="w-full h-2" />
            <p className="text-xs text-emerald-600 mt-1">{resource.dataQuality.completeness}%</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">Fraîcheur</p>
            <Progress value={resource.dataQuality.freshness} className="w-full h-2" />
            <p className="text-xs text-emerald-600 mt-1">{resource.dataQuality.freshness}%</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">Consistance</p>
            <Progress value={resource.dataQuality.consistency} className="w-full h-2" />
            <p className="text-xs text-emerald-600 mt-1">{resource.dataQuality.consistency}%</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-600">Fiabilité</p>
            <Progress value={resource.dataQuality.reliability} className="w-full h-2" />
            <p className="text-xs text-emerald-600 mt-1">{resource.dataQuality.reliability}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

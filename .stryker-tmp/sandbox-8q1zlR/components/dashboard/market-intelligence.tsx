// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle, Lightbulb, BarChart3, Globe, Briefcase, Zap, Shield, Clock } from "lucide-react";

export interface MarketIntelligence {
  marketTrends: {
    growingSectors: Array<{
      sector: string;
      growthRate: number;
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
    decliningSectors: Array<{
      sector: string;
      declineRate: number;
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
    recruitingJobs: Array<{
      job: string;
      demandLevel: "high" | "medium" | "low";
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
    slowdownJobs: Array<{
      job: string;
      slowdownLevel: "high" | "medium" | "low";
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
  };
  emergingSkills: Array<{
    skill: string;
    demandLevel: "critical" | "high" | "medium" | "low";
    emergingSpeed: "fast" | "moderate" | "slow";
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  obsoleteSkills: Array<{
    skill: string;
    obsolescenceSpeed: "fast" | "moderate" | "slow";
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  candidateMarketGap: {
    missingSkills: Array<{
      skill: string;
      importance: "critical" | "high" | "medium" | "low";
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
    outdatedSkills: Array<{
      skill: string;
      replacement: string;
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
    highlyValuedSkills: Array<{
      skill: string;
      candidateHas: boolean;
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
    differentiatingPoints: Array<{
      point: string;
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
    competitiveAdvantages: Array<{
      advantage: string;
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
    areasNeedingImprovement: Array<{
      area: string;
      priority: "critical" | "high" | "medium" | "low";
      reason: string;
      confidence: "high" | "medium" | "low";
    }>;
  };
  opportunities: Array<{
    opportunity: string;
    type: "new_role" | "specialization" | "evolution" | "mobility" | "emerging";
    urgency: "high" | "medium" | "low";
    feasibility: "high" | "medium" | "low";
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  risks: Array<{
    risk: string;
    type: "skill_obsolescence" | "sector_slowdown" | "goal_difficulty" | "competition" | "technology_replacement" | "saturation";
    severity: "critical" | "high" | "medium" | "low";
    probability: "high" | "medium" | "low";
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  strategyImpact: {
    currentStrategyRelevant: boolean;
    strategyEvolutionNeeded: boolean;
    recommendedChanges: Array<{
      change: string;
      reason: string;
      priority: "critical" | "high" | "medium" | "low";
      confidence: "high" | "medium" | "low";
    }>;
    opportunitiesToSeize: Array<{
      opportunity: string;
      reason: string;
      priority: "critical" | "high" | "medium" | "low";
      confidence: "high" | "medium" | "low";
    }>;
    risksToMitigate: Array<{
      risk: string;
      mitigation: string;
      priority: "critical" | "high" | "medium" | "low";
      confidence: "high" | "medium" | "low";
    }>;
  };
  marketConfidence: {
    overallConfidence: "very_high" | "high" | "moderate" | "low" | "insufficient";
    dataQuality: "excellent" | "good" | "moderate" | "poor";
    missingData: Array<{
      data: string;
      importance: "critical" | "high" | "medium" | "low";
    }>;
    reason: string;
  };
  recommendations: Array<{
    recommendation: string;
    type: "skill" | "strategy" | "goal" | "opportunity" | "risk_mitigation";
    priority: "critical" | "high" | "medium" | "low";
    marketInfluence: string;
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
}

interface MarketIntelligenceProps {
  marketIntelligence: MarketIntelligence;
}

export function MarketIntelligence({ marketIntelligence }: MarketIntelligenceProps) {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
      case "very_high":
        return "text-green-600 bg-green-50";
      case "medium":
      case "moderate":
        return "text-amber-600 bg-amber-50";
      case "low":
      case "insufficient":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "critical":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Trends */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
        <CardHeader className="border-b border-emerald-200">
          <CardTitle className="text-emerald-900 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Tendances du Marché
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {marketIntelligence.marketTrends.growingSectors.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900 mb-2">Secteurs en croissance</p>
                <div className="space-y-2">
                  {marketIntelligence.marketTrends.growingSectors.map((sector, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-green-800">{sector.sector}</p>
                        <p className="text-xs text-green-700">+{sector.growthRate}% - {sector.reason}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(sector.confidence)}`}>
                          Confiance: {sector.confidence}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {marketIntelligence.marketTrends.decliningSectors.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-900 mb-2">Secteurs en difficulté</p>
                <div className="space-y-2">
                  {marketIntelligence.marketTrends.decliningSectors.map((sector, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-800">{sector.sector}</p>
                        <p className="text-xs text-red-700">-{sector.declineRate}% - {sector.reason}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(sector.confidence)}`}>
                          Confiance: {sector.confidence}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {marketIntelligence.marketTrends.recruitingJobs.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Métiers qui recrutent</p>
                <div className="space-y-2">
                  {marketIntelligence.marketTrends.recruitingJobs.map((job, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-800">{job.job}</p>
                        <p className="text-xs text-blue-700">{job.reason}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDemandColor(job.demandLevel)}`}>
                          Demande: {job.demandLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emerging Skills */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
        <CardHeader className="border-b border-purple-200">
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Compétences Émergentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {marketIntelligence.emergingSkills.map((skill, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-purple-900">{skill.skill}</p>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDemandColor(skill.demandLevel)}`}>
                      {skill.demandLevel}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(skill.confidence)}`}>
                      {skill.confidence}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-purple-700">{skill.reason}</p>
                <p className="text-xs text-purple-600 mt-1">Émergence: {skill.emergingSpeed}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Candidate / Market Gap */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
        <CardHeader className="border-b border-blue-200">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Écart Candidat / Marché
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {marketIntelligence.candidateMarketGap.missingSkills.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-900 mb-2">Compétences manquantes</p>
                <div className="space-y-2">
                  {marketIntelligence.candidateMarketGap.missingSkills.map((skill, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-800">{skill.skill}</p>
                        <p className="text-xs text-red-700">{skill.reason}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(skill.importance)}`}>
                          {skill.importance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {marketIntelligence.candidateMarketGap.highlyValuedSkills.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900 mb-2">Compétences très recherchées</p>
                <div className="space-y-2">
                  {marketIntelligence.candidateMarketGap.highlyValuedSkills.map((skill, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Award className={`w-4 h-4 ${skill.candidateHas ? "text-green-600" : "text-amber-600"} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <p className="text-sm text-green-800">{skill.skill}</p>
                        <p className="text-xs text-green-700">{skill.reason}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${skill.candidateHas ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                          {skill.candidateHas ? "Vous avez" : "À développer"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {marketIntelligence.candidateMarketGap.competitiveAdvantages.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Avantages compétitifs</p>
                <div className="space-y-2">
                  {marketIntelligence.candidateMarketGap.competitiveAdvantages.map((advantage, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-800">{advantage.advantage}</p>
                        <p className="text-xs text-blue-700">{advantage.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm">
        <CardHeader className="border-b border-amber-200">
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Opportunités Détectées
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {marketIntelligence.opportunities.map((opportunity, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-amber-900">{opportunity.opportunity}</p>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(opportunity.urgency)}`}>
                      Urgence: {opportunity.urgency}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(opportunity.confidence)}`}>
                      {opportunity.confidence}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-amber-700">{opportunity.reason}</p>
                <p className="text-xs text-amber-600 mt-1">Faisabilité: {opportunity.feasibility} | Type: {opportunity.type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risks */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-sm">
        <CardHeader className="border-b border-red-200">
          <CardTitle className="text-red-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Risques
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {marketIntelligence.risks.map((risk, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-red-900">{risk.risk}</p>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(risk.severity)}`}>
                      Sévérité: {risk.severity}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(risk.confidence)}`}>
                      {risk.confidence}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-red-700">{risk.reason}</p>
                <p className="text-xs text-red-600 mt-1">Probabilité: {risk.probability} | Type: {risk.type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Impact */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
        <CardHeader className="border-b border-indigo-200">
          <CardTitle className="text-indigo-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Impact sur la Stratégie
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <p className="text-sm font-medium text-indigo-900 mb-1">Stratégie actuelle pertinente</p>
              <p className={`text-sm ${marketIntelligence.strategyImpact.currentStrategyRelevant ? "text-green-700" : "text-amber-700"}`}>
                {marketIntelligence.strategyImpact.currentStrategyRelevant ? "Oui" : "Non"}
              </p>
            </div>
            {marketIntelligence.strategyImpact.strategyEvolutionNeeded && (
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-2">Changements recommandés</p>
                <div className="space-y-2">
                  {marketIntelligence.strategyImpact.recommendedChanges.map((change, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-amber-800">{change.change}</p>
                        <p className="text-xs text-amber-700">{change.reason}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(change.priority)}`}>
                          {change.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {marketIntelligence.strategyImpact.opportunitiesToSeize.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900 mb-2">Opportunités à saisir</p>
                <div className="space-y-2">
                  {marketIntelligence.strategyImpact.opportunitiesToSeize.map((opportunity, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-green-800">{opportunity.opportunity}</p>
                        <p className="text-xs text-green-700">{opportunity.reason}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(opportunity.priority)}`}>
                          {opportunity.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Market Confidence */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Confiance dans les Données
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-900 mb-1">Confiance globale</p>
              <span className={`text-sm px-3 py-1 rounded-full ${getConfidenceColor(marketIntelligence.marketConfidence.overallConfidence)}`}>
                {marketIntelligence.marketConfidence.overallConfidence}
              </span>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-900 mb-1">Qualité des données</p>
              <span className={`text-sm px-3 py-1 rounded-full ${getConfidenceColor(marketIntelligence.marketConfidence.dataQuality)}`}>
                {marketIntelligence.marketConfidence.dataQuality}
              </span>
            </div>
            {marketIntelligence.marketConfidence.missingData.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-2">Données manquantes</p>
                <div className="space-y-1">
                  {marketIntelligence.marketConfidence.missingData.map((data, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <p className="text-sm text-amber-800">{data.data}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(data.importance)}`}>
                        {data.importance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-900 mb-1">Raison</p>
              <p className="text-sm text-slate-700">{marketIntelligence.marketConfidence.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 shadow-sm">
        <CardHeader className="border-b border-violet-200">
          <CardTitle className="text-violet-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {marketIntelligence.recommendations.map((recommendation, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-violet-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-violet-900">{recommendation.recommendation}</p>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(recommendation.confidence)}`}>
                      {recommendation.confidence}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-violet-700">{recommendation.reason}</p>
                <p className="text-xs text-violet-600 mt-1">Influence marché: {recommendation.marketInfluence} | Type: {recommendation.type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

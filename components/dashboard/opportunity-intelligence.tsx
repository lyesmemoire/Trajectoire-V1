import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { AnimatedOpportunityList } from "./animated-opportunity-list";
import { AlertTriangle, Clock, CheckCircle, Lightbulb, XCircle, ArrowRight, Star, Shield, Zap, Target, BarChart3 } from "lucide-react";
export interface OpportunityIntelligenceData {
  analyzedOpportunities: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    relevance: number;
    difficulty: number;
    compatibility: number;
    preparationLevel: number;
    successProbability: number;
    urgency: string;
    strategicValue: number;
    longTermImpact: string;
    dependencies: string[];
    risks: string[];
    requiredEffort: string;
    estimatedTime: string;
    requiredSkills: string[];
    missingSkills: string[];
    preparationNeeded: string[];
    preparationPlan: {
      steps: Array<{
        action: string;
        timeline: string;
        priority: string;
      }>;
      estimatedPreparationTime: string;
    };
    marketContext: {
      alignedWithTrends: boolean;
      sectorGrowth: string;
      competitionLevel: string;
      marketReasoning: string;
    };
    reason: string;
    whyRecommended: string;
    whyNotRecommended: string;
    confidence: number;
    dataQuality: string;
    missingData: string[];
    limitations: string[];
  }>;
  priorityOpportunity: {
    id: string;
    title: string;
    reason: string;
    whyPriority: string;
    whyOthersWait: string;
    recommendedAction: string;
  };
  compatibleOpportunities: Array<{
    id: string;
    title: string;
    reason: string;
    ranking: number;
  }>;
  opportunitiesToPrepare: Array<{
    id: string;
    title: string;
    preparationNeeded: string[];
    estimatedPreparationTime: string;
    reason: string;
  }>;
  opportunitiesToAvoid: Array<{
    id: string;
    title: string;
    reason: string;
    risks: string[];
  }>;
  recentlyDetected: Array<{
    id: string;
    title: string;
    detectionReason: string;
    detectionDate: string;
  }>;
  strategyImpact: {
    strategyChangeNeeded: boolean;
    recommendedStrategyChange: string;
    reason: string;
  };
  goalImpact: {
    goalsNeedReorganization: boolean;
    recommendedGoalChanges: string[];
    reason: string;
  };
  accountabilityTracking: {
    opportunitiesViewed: number;
    opportunitiesPrepared: number;
    opportunitiesIgnored: number;
    opportunitiesRefused: number;
    opportunitiesAccepted: number;
    opportunitiesAbandoned: number;
    opportunitiesExpired: number;
    opportunitiesCompleted: number;
  };
  confidence: {
    overallConfidence: string;
    dataQuality: string;
    missingData: Array<{
      data: string;
      importance: string;
    }>;
    reason: string;
  };
  recommendations: Array<{
    recommendation: string;
    type: string;
    priority: string;
    opportunityInfluence: string;
    reason: string;
    confidence: string;
  }>;
}

interface OpportunityIntelligenceProps {
  data: OpportunityIntelligenceData;
}

export function OpportunityIntelligence({ data }: OpportunityIntelligenceProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "very_relevant":
        return "bg-green-100 text-green-800 border-green-200";
      case "relevant":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "interesting_later":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "to_monitor":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "not_very_relevant":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "not_suitable":
        return "bg-red-100 text-red-800 border-red-200";
      case "to_prepare":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "to_avoid":
        return "bg-red-100 text-red-800 border-red-200";
      case "to_reconsider":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "obsolete":
        return "bg-gray-200 text-gray-600 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "very_relevant":
        return "Très pertinente";
      case "relevant":
        return "Pertinente";
      case "interesting_later":
        return "Intéressante plus tard";
      case "to_monitor":
        return "À surveiller";
      case "not_very_relevant":
        return "Peu pertinente";
      case "not_suitable":
        return "Non adaptée";
      case "to_prepare":
        return "À préparer";
      case "to_avoid":
        return "À éviter";
      case "to_reconsider":
        return "À reconsidérer";
      case "obsolete":
        return "Obsolète";
      default:
        return status;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "prepare_now":
        return "Préparer maintenant";
      case "apply_now":
        return "Postuler maintenant";
      case "wait":
        return "Attendre";
      case "ignore":
        return "Ignorer";
      case "prepare_then_apply":
        return "Préparer puis postuler";
      default:
        return action;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "very_high":
        return "text-green-600";
      case "high":
        return "text-blue-600";
      case "moderate":
        return "text-amber-600";
      case "low":
        return "text-orange-600";
      case "insufficient":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Priority Opportunity */}
      {data.priorityOpportunity && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
          <CardHeader className="border-b border-blue-200">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Opportunité Prioritaire
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-lg font-semibold text-blue-900 mb-2">{data.priorityOpportunity.title}</p>
                <p className="text-sm text-blue-800 mb-3">{data.priorityOpportunity.reason}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor("very_relevant")}`}>
                    {getStatusLabel("very_relevant")}
                  </span>
                  <span className="text-sm text-blue-600">
                    Action: {getActionLabel(data.priorityOpportunity.recommendedAction)}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Pourquoi prioritaire</p>
                <p className="text-sm text-blue-800">{data.priorityOpportunity.whyPriority}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">Pourquoi les autres attendent</p>
                <p className="text-sm text-blue-800">{data.priorityOpportunity.whyOthersWait}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compatible Opportunities */}
      {data.compatibleOpportunities.length > 0 && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Opportunités Compatibles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatedOpportunityList>
              {data.compatibleOpportunities.map((opportunity, index) => (
                <div
                  key={opportunity.id}
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-green-900 mb-1">{opportunity.title}</p>
                      <p className="text-sm text-green-800">{opportunity.reason}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-white rounded text-xs font-medium text-green-700">
                        #{opportunity.ranking}
                      </span>
                      <ArrowRight className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              ))}
            </AnimatedOpportunityList>
          </CardContent>
        </Card>
      )}

      {/* Opportunities to Prepare */}
      {data.opportunitiesToPrepare.length > 0 && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Opportunités à Préparer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatedOpportunityList>
              {data.opportunitiesToPrepare.map((opportunity, index) => (
                <div
                  key={opportunity.id}
                  className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-cyan-900 mb-1">{opportunity.title}</p>
                        <p className="text-sm text-cyan-800">{opportunity.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-cyan-700">Temps estimé</p>
                        <p className="text-sm text-cyan-800">{opportunity.estimatedPreparationTime}</p>
                      </div>
                    </div>
                    {opportunity.preparationNeeded.length > 0 && (
                      <div className="pt-3 border-t border-cyan-200">
                        <p className="text-xs font-medium text-cyan-900 mb-2">Préparation nécessaire</p>
                        <div className="space-y-1">
                          {opportunity.preparationNeeded.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Zap className="w-3 h-3 text-cyan-600 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-cyan-800">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </AnimatedOpportunityList>
          </CardContent>
        </Card>
      )}

      {/* Opportunities to Avoid */}
      {data.opportunitiesToAvoid.length > 0 && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Opportunités à Éviter
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatedOpportunityList>
              {data.opportunitiesToAvoid.map((opportunity, index) => (
                <div
                  key={opportunity.id}
                  className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200"
                >
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-red-900 mb-1">{opportunity.title}</p>
                      <p className="text-sm text-red-800">{opportunity.reason}</p>
                    </div>
                    {opportunity.risks.length > 0 && (
                      <div className="pt-3 border-t border-red-200">
                        <p className="text-xs font-medium text-red-900 mb-2">Risques</p>
                        <div className="space-y-1">
                          {opportunity.risks.map((risk, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-red-800">{risk}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </AnimatedOpportunityList>
          </CardContent>
        </Card>
      )}

      {/* Recently Detected */}
      {data.recentlyDetected.length > 0 && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Récemment Détectées
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatedOpportunityList>
              {data.recentlyDetected.map((opportunity, index) => (
                <div
                  key={opportunity.id}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-purple-900 mb-1">{opportunity.title}</p>
                      <p className="text-sm text-purple-800">{opportunity.detectionReason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-purple-600">{opportunity.detectionDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </AnimatedOpportunityList>
          </CardContent>
        </Card>
      )}

      {/* Strategy Impact */}
      {data.strategyImpact.strategyChangeNeeded && (
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Impact sur la Stratégie
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-2">Changement de stratégie recommandé</p>
                <p className="text-sm text-amber-800">{data.strategyImpact.recommendedStrategyChange}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-1">Raison</p>
                <p className="text-sm text-amber-800">{data.strategyImpact.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Impact */}
      {data.goalImpact.goalsNeedReorganization && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
          <CardHeader className="border-b border-indigo-200">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Impact sur les Objectifs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-900 mb-2">Changements d'objectifs recommandés</p>
                <div className="space-y-1">
                  {data.goalImpact.recommendedGoalChanges.map((change, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-indigo-800">{change}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-900 mb-1">Raison</p>
                <p className="text-sm text-indigo-800">{data.goalImpact.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accountability Tracking */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Suivi des Opportunités
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-900">{data.accountabilityTracking.opportunitiesViewed}</p>
              <p className="text-sm text-blue-700">Vues</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-900">{data.accountabilityTracking.opportunitiesPrepared}</p>
              <p className="text-sm text-green-700">Préparées</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-2xl font-bold text-amber-900">{data.accountabilityTracking.opportunitiesIgnored}</p>
              <p className="text-sm text-amber-700">Ignorées</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-2xl font-bold text-purple-900">{data.accountabilityTracking.opportunitiesAccepted}</p>
              <p className="text-sm text-purple-700">Acceptées</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-900">{data.accountabilityTracking.opportunitiesRefused}</p>
              <p className="text-sm text-red-700">Refusées</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{data.accountabilityTracking.opportunitiesAbandoned}</p>
              <p className="text-sm text-gray-700">Abandonnées</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-2xl font-bold text-orange-900">{data.accountabilityTracking.opportunitiesExpired}</p>
              <p className="text-sm text-orange-700">Expirées</p>
            </div>
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <p className="text-2xl font-bold text-teal-900">{data.accountabilityTracking.opportunitiesCompleted}</p>
              <p className="text-sm text-teal-700">Terminées</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Niveau de Confiance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Confiance globale</p>
                <p className={`text-lg font-semibold ${getConfidenceColor(data.confidence.overallConfidence)}`}>
                  {data.confidence.overallConfidence.replace("_", " ").toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Qualité des données</p>
                <p className="text-lg font-semibold text-gray-700">
                  {data.confidence.dataQuality.toUpperCase()}
                </p>
              </div>
            </div>
            {data.confidence.missingData.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-2">Données manquantes</p>
                <div className="space-y-1">
                  {data.confidence.missingData.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        <span className="font-medium">{item.data}</span>
                        <span className="ml-2 text-amber-600">({item.importance})</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-1">Raison</p>
              <p className="text-sm text-gray-800">{data.confidence.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Target, Calendar, TrendingUp, AlertTriangle, Clock, CheckCircle, Lightbulb, RefreshCw, Shield, AlertCircle, Zap, Plus, Trash2, Globe, Briefcase, XCircle, MessageCircle } from "lucide-react";

export interface ProgressionPlan {
  singlePriority: {
    action: string;
    why: string;
    whyNow: string;
    expectedImpact: string;
    riskIfIgnored: string;
    estimatedTime: string;
  };
  shortTerm: {
    today: string[];
    thisWeek: string[];
    thisMonth: string[];
  };
  longTerm: {
    mainObjective: string;
    progression: string;
    blockages: string[];
    nextStep: string;
  };
  dynamicPriorities: {
    recommendations: string[];
    goals: string[];
    simulations: string[];
    skills: string[];
  };
  changeHistory: {
    lastChange: string;
    reason: string;
    previousPriority: string;
  };
  absolutePriority?: {
    action: string;
    reason: string;
    urgency: "immediate" | "this_week" | "this_month" | "flexible";
    difficulty: "easy" | "moderate" | "hard";
    estimatedTime: string;
  };
  commitmentTracking?: {
    completedActions: string[];
    pendingActions: string[];
    abandonedActions: string[];
    obsoleteActions: string[];
    completionRate: number;
  };
  conclusionRevision?: {
    removedActions: string[];
    retainedActions: string[];
    newPriorityActions: string[];
    reason: string;
    confidence: number;
  };
  uncertaintyReduction?: {
    uncertainDomains: string[];
    missingData: string[];
    improvementActions: {
      action: string;
      expectedImpact: string;
      priority: "high" | "medium" | "low";
    }[];
  };
  synchronizationStatus?: {
    isSynchronized: boolean;
    globalCoherence: number;
    removedActions: string[];
    reason: string;
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
    preparationPlan: string[];
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

interface ProgressionPlanProps {
  plan: ProgressionPlan;
}

export function ProgressionPlan({ plan }: ProgressionPlanProps) {
  // If absolute priority is provided, reorder the plan
  const reorderedPlan = plan.absolutePriority
    ? {
        ...plan,
        singlePriority: {
          action: plan.absolutePriority.action,
          why: plan.absolutePriority.reason,
          whyNow: plan.absolutePriority.urgency === "immediate" ? "Urgent" : plan.absolutePriority.urgency === "this_week" ? "Cette semaine" : plan.absolutePriority.urgency === "this_month" ? "Ce mois" : "Flexible",
          expectedImpact: `Difficulté: ${plan.absolutePriority.difficulty === "easy" ? "Facile" : plan.absolutePriority.difficulty === "moderate" ? "Modéré" : "Difficile"}`,
          riskIfIgnored: `Temps estimé: ${plan.absolutePriority.estimatedTime}`,
          estimatedTime: plan.absolutePriority.estimatedTime,
        },
        shortTerm: {
          today: [plan.absolutePriority.action, ...(plan.shortTerm?.today || []).filter(a => a !== plan.absolutePriority!.action)],
          thisWeek: plan.shortTerm?.thisWeek || [],
          thisMonth: plan.shortTerm?.thisMonth || [],
        },
      }
    : plan;

  // If commitment tracking is provided, filter and mark actions
  const filteredPlan = plan.commitmentTracking
    ? {
        ...reorderedPlan,
        shortTerm: {
          today: reorderedPlan.shortTerm.today.filter(action => 
            !plan.commitmentTracking!.completedActions.includes(action) &&
            !plan.commitmentTracking!.obsoleteActions.includes(action)
          ),
          thisWeek: reorderedPlan.shortTerm.thisWeek.filter(action => 
            !plan.commitmentTracking!.completedActions.includes(action) &&
            !plan.commitmentTracking!.obsoleteActions.includes(action)
          ),
          thisMonth: reorderedPlan.shortTerm.thisMonth.filter(action => 
            !plan.commitmentTracking!.completedActions.includes(action) &&
            !plan.commitmentTracking!.obsoleteActions.includes(action)
          ),
        },
      }
    : reorderedPlan;

  const displayPlan = filteredPlan;

  return (
    <div className="space-y-6">
      {/* Single Priority - Most Important */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <CardHeader className="border-b border-blue-200">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Priorité Unique
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-blue-900 mb-2">
                {displayPlan.singlePriority.action}
              </h3>
              <p className="text-sm text-blue-700">
                Si tu ne fais qu'une seule chose aujourd'hui, fais celle-ci.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-900 mb-1">Pourquoi ?</p>
                <p className="text-blue-700">{displayPlan.singlePriority.why}</p>
              </div>
              <div>
                <p className="font-medium text-blue-900 mb-1">Pourquoi maintenant ?</p>
                <p className="text-blue-700">{displayPlan.singlePriority.whyNow}</p>
              </div>
              <div>
                <p className="font-medium text-blue-900 mb-1">Impact attendu</p>
                <p className="text-blue-700">{displayPlan.singlePriority.expectedImpact}</p>
              </div>
              <div>
                <p className="font-medium text-blue-900 mb-1">Risque si ignoré</p>
                <p className="text-blue-700">{displayPlan.singlePriority.riskIfIgnored}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Clock className="w-4 h-4" />
              <span>Temps estimé: {displayPlan.singlePriority.estimatedTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusion Revision */}
      {plan.conclusionRevision && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
          <CardHeader className="border-b border-indigo-200">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Révision de conclusion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-indigo-600 font-medium">Actions retirées:</span>
                <span className="text-sm text-indigo-800">{plan.conclusionRevision.removedActions.join(", ") || "Aucune"}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-indigo-600 font-medium">Actions conservées:</span>
                <span className="text-sm text-indigo-800">{plan.conclusionRevision.retainedActions.join(", ") || "Aucune"}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-indigo-600 font-medium">Nouvelles priorités:</span>
                <span className="text-sm text-indigo-800">{plan.conclusionRevision.newPriorityActions.join(", ") || "Aucune"}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-indigo-600 font-medium">Raison:</span>
                <span className="text-sm text-indigo-800">{plan.conclusionRevision.reason}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uncertainty Reduction */}
      {plan.uncertaintyReduction && (
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
          <CardHeader className="border-b border-teal-200">
            <CardTitle className="text-teal-900 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Réduction de l'incertitude
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {plan.uncertaintyReduction.uncertainDomains.length > 0 && (
                <div>
                  <p className="text-xs text-teal-600 font-medium mb-1">Domaines incertains:</p>
                  <p className="text-sm text-teal-800">{plan.uncertaintyReduction.uncertainDomains.join(", ")}</p>
                </div>
              )}
              {plan.uncertaintyReduction.missingData.length > 0 && (
                <div>
                  <p className="text-xs text-teal-600 font-medium mb-1">Données manquantes:</p>
                  <p className="text-sm text-teal-800">{plan.uncertaintyReduction.missingData.join(", ")}</p>
                </div>
              )}
              {plan.uncertaintyReduction.improvementActions.length > 0 && (
                <div>
                  <p className="text-xs text-teal-600 font-medium mb-2">Actions d'amélioration:</p>
                  <div className="space-y-2">
                    {plan.uncertaintyReduction.improvementActions.map((action, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-teal-200">
                        <div className="flex items-start gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${action.priority === "high" ? "bg-red-100 text-red-800" : action.priority === "medium" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                            {action.priority === "high" ? "Haute" : action.priority === "medium" ? "Moyenne" : "Faible"}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-teal-900">{action.action}</p>
                            <p className="text-xs text-teal-800">{action.expectedImpact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Synchronization Status */}
      {plan.synchronizationStatus && (
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
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${plan.synchronizationStatus.globalCoherence >= 90 ? "bg-green-100 text-green-800" : plan.synchronizationStatus.globalCoherence >= 70 ? "bg-blue-100 text-blue-800" : plan.synchronizationStatus.globalCoherence >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                  {plan.synchronizationStatus.globalCoherence}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-600">Synchronisé</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${plan.synchronizationStatus.isSynchronized ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {plan.synchronizationStatus.isSynchronized ? "Oui" : "Non"}
                </span>
              </div>
              {plan.synchronizationStatus.removedActions.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Actions supprimées automatiquement</p>
                  <div className="space-y-1">
                    {plan.synchronizationStatus.removedActions.map((action, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Raison</p>
                <p className="text-sm text-purple-800">{plan.synchronizationStatus.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Status */}
      {plan.goalStatus && (
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
                <p className="text-sm text-blue-800">{plan.goalStatus.primaryGoal}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">Objectif du moment</p>
                </div>
                <p className="text-sm text-purple-800">{plan.goalStatus.goalOfTheMoment}</p>
              </div>
              {plan.goalStatus.newGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Nouveaux objectifs</p>
                  <div className="space-y-1">
                    {plan.goalStatus.newGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Plus className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.goalStatus.completedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-teal-200">
                  <p className="text-sm font-medium text-teal-900 mb-2">Objectifs terminés</p>
                  <div className="space-y-1">
                    {plan.goalStatus.completedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-teal-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.goalStatus.mergedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Objectifs fusionnés</p>
                  <div className="space-y-1">
                    {plan.goalStatus.mergedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <RefreshCw className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.goalStatus.deletedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Objectifs supprimés</p>
                  <div className="space-y-1">
                    {plan.goalStatus.deletedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Trash2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.goalStatus.postponedGoals.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Objectifs reportés</p>
                  <div className="space-y-1">
                    {plan.goalStatus.postponedGoals.map((goal, index) => (
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
                <p className="text-sm text-blue-800">{plan.goalStatus.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Context */}
      {plan.marketContext && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
          <CardHeader className="border-b border-emerald-200">
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Contexte du Marché
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {plan.marketContext.growingSectors.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Secteurs en croissance</p>
                  <div className="space-y-1">
                    {plan.marketContext.growingSectors.map((sector, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{sector}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.marketContext.emergingSkills.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Compétences émergentes</p>
                  <div className="space-y-1">
                    {plan.marketContext.emergingSkills.map((skill, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-purple-800">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.marketContext.opportunities.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Opportunités détectées</p>
                  <div className="space-y-1">
                    {plan.marketContext.opportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.marketContext.risks.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Risques</p>
                  <div className="space-y-1">
                    {plan.marketContext.risks.map((risk, index) => (
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
                <p className="text-sm text-emerald-800">{plan.marketContext.strategyImpact}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-1">Raison</p>
                <p className="text-sm text-emerald-800">{plan.marketContext.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunity Context */}
      {plan.opportunityContext && (
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
                <p className="text-sm text-blue-800 mb-2">{plan.opportunityContext.priorityOpportunity}</p>
                <p className="text-xs text-blue-600">{plan.opportunityContext.priorityReason}</p>
              </div>
              {plan.opportunityContext.compatibleOpportunities.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Opportunités compatibles</p>
                  <div className="space-y-1">
                    {plan.opportunityContext.compatibleOpportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.opportunityContext.opportunitiesToPrepare.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Opportunités à préparer</p>
                  <div className="space-y-1">
                    {plan.opportunityContext.opportunitiesToPrepare.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.opportunityContext.opportunitiesToAvoid.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Opportunités à éviter</p>
                  <div className="space-y-1">
                    {plan.opportunityContext.opportunitiesToAvoid.map((opportunity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.opportunityContext.preparationPlan.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">Plan de préparation intégré</p>
                  <div className="space-y-1">
                    {plan.opportunityContext.preparationPlan.map((action, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Raison</p>
                <p className="text-sm text-blue-800">{plan.opportunityContext.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Context */}
      {plan.applicationContext && (
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
                <p className="text-sm text-purple-800 mb-2">{plan.applicationContext.priorityApplication}</p>
                <p className="text-xs text-purple-600">{plan.applicationContext.priorityReason}</p>
              </div>
              {plan.applicationContext.applicationsToFollowUp.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-900 mb-2">Relances à effectuer</p>
                  <div className="space-y-1">
                    {plan.applicationContext.applicationsToFollowUp.map((application, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-orange-800">{application}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.applicationContext.applicationsToPrepare.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Candidatures à préparer</p>
                  <div className="space-y-1">
                    {plan.applicationContext.applicationsToPrepare.map((application, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{application}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.applicationContext.applicationsToAbandon.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Candidatures à abandonner</p>
                  <div className="space-y-1">
                    {plan.applicationContext.applicationsToAbandon.map((application, index) => (
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
                <p className="text-sm text-purple-800">{plan.applicationContext.pipelineStatus}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Métriques accountability</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-purple-800">
                  <div><span className="font-medium">Total:</span> {plan.applicationContext.accountabilityMetrics.totalApplications}</div>
                  <div><span className="font-medium">Relances:</span> {plan.applicationContext.accountabilityMetrics.followUpsPerformed}</div>
                  <div><span className="font-medium">Entretiens:</span> {plan.applicationContext.accountabilityMetrics.interviewsCompleted}</div>
                  <div><span className="font-medium">Conversion:</span> {plan.applicationContext.accountabilityMetrics.conversionRate}%</div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Impact sur le plan</p>
                <p className="text-sm text-purple-800">{plan.applicationContext.applicationImpact}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Raison</p>
                <p className="text-sm text-purple-800">{plan.applicationContext.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Short-term Vision */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Vision Court Terme
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Aujourd'hui
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {displayPlan.shortTerm.today.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Cette semaine
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {displayPlan.shortTerm.thisWeek.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                Ce mois
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {displayPlan.shortTerm.thisMonth.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Long-term Vision */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Vision Long Terme
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 mb-1">Objectif principal</p>
              <p className="text-sm text-gray-700">{plan.longTerm.mainObjective}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Progression</p>
              <p className="text-sm text-gray-700">{plan.longTerm.progression}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Blocages</p>
              <ul className="space-y-1 text-sm text-gray-700">
                {plan.longTerm.blockages.map((blockage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{blockage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Prochaine étape</p>
              <p className="text-sm text-gray-700">{plan.longTerm.nextStep}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change History */}
      {plan.changeHistory.lastChange && (
        <Card className="bg-gray-50 border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">Dernier changement: {plan.changeHistory.lastChange}</p>
              <p className="text-gray-600">{plan.changeHistory.reason}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

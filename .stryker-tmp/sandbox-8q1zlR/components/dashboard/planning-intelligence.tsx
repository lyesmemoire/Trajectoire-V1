// @ts-nocheck
"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/design-system";
import { MapPin, AlertTriangle, CheckCircle, ArrowRight, Shield, Zap, ChevronRight, ChevronDown, GitBranch, Route, CheckSquare, Lightbulb, Target as TargetIcon, Flag as FlagIcon, Calendar as CalendarIcon, Clock as ClockIcon, AlertTriangle as AlertTriangleIcon, CheckCircle as CheckCircleIcon, Info, Lock, Activity as ActivityIcon, GitBranch as GitBranchIcon } from "lucide-react";

interface PlanningIntelligenceProps {
  planning: {
    currentPosition: {
      role: string;
      responsibilities: string[];
      skills: string[];
      experience: string;
      constraints: string[];
      resources: string[];
      marketPosition: string;
    };
    targetPosition: {
      role: string;
      requiredSkills: string[];
      requiredExperience: string;
      requiredCertifications: string[];
      requiredPortfolio: string[];
      requiredNetwork: string[];
      requiredVisibility: string[];
    };
    gapAnalysis: {
      gaps: Array<{
        category: "skills" | "experience" | "certifications" | "portfolio" | "network" | "visibility" | "evidence" | "applications";
        currentState: string;
        requiredState: string;
        gapSize: "large" | "medium" | "small";
        priority: "critical" | "high" | "medium" | "low";
        closingStrategy: string;
      }>;
    };
    planningRoadmap: {
      today: {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
      thisWeek: {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
      thisMonth: {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
      "90Days": {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
      "6Months": {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
      "12Months": {
        actions: string[];
        expectedOutcomes: string[];
        successCriteria: string[];
        dependencies: string[];
        timeAllocation: string;
      };
    };
    milestones: Array<{
      objective: string;
      justification: string;
      dependencies: string[];
      validationCriteria: string[];
      estimatedCompletion: string;
      successIndicators: string[];
    }>;
    priorities: Array<{
      action: string;
      priority: "critical" | "high" | "medium" | "low";
      justification: string;
      dependencies: string[];
      deadline: string;
    }>;
    dependencies: Array<{
      sourceAction: string;
      dependentAction: string;
      dependencyType: "prerequisite" | "parallel" | "sequential" | "blocking" | "resource";
      resolutionStrategy: string;
      estimatedImpact: string;
    }>;
    riskAnalysis: {
      risks: Array<{
        description: string;
        probability: "high" | "medium" | "low";
        impact: "high" | "medium" | "low";
        mitigationStrategy: string;
        contingencyPlan: string;
        monitoringIndicators: string[];
      }>;
    };
    alternativePlans: {
      planA: {
        advantages: string[];
        limitations: string[];
        confidence: number;
        activationConditions: string[];
        expectedOutcomes: string[];
      };
      planB: {
        advantages: string[];
        limitations: string[];
        confidence: number;
        activationConditions: string[];
        expectedOutcomes: string[];
      };
      planC: {
        advantages: string[];
        limitations: string[];
        confidence: number;
        activationConditions: string[];
        expectedOutcomes: string[];
      };
    };
    checkpoints: {
      "7Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
      "30Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
      "60Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
      "90Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
      "180Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
      "365Days": {
        expectedObjectives: string[];
        keyIndicators: string[];
        successConditions: string[];
        correctiveActions: string[];
        adjustmentTriggers: string[];
      };
    };
    adaptationRules: Array<{
      triggerEvent: string;
      revisionRequired: string;
      adjustmentProcess: string;
      impactAssessment: string;
    }>;
    planningConfidence: {
      overallConfidence: number;
      confidenceByStep: Array<{ step: string; confidence: number }>;
      confidenceByMilestone: Array<{ milestone: string; confidence: number }>;
      confidenceByTimeframe: Array<{ timeframe: string; confidence: number }>;
      factors: string[];
    };
    planningExplainability: {
      enginesConsulted: string[];
      evidenceUsed: string[];
      constraintsConsidered: string[];
      risksAssociated: string[];
      alternativesConsidered: string[];
      rationale: string;
    };
  };
}

export function PlanningIntelligence({ planning }: PlanningIntelligenceProps) {
  const [expandedSection, setExpandedSection] = React.useState<string | null>("roadmap");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getGapSizeColor = (gapSize: string) => {
    switch (gapSize) {
      case "large":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "small":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Planning Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <CardHeader className="border-b border-blue-200">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Route className="w-5 h-5" />
            Plan de Carrière Structuré
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 mb-1">Confiance du plan</p>
              <p className={`text-2xl font-bold ${getConfidenceColor(planning.planningConfidence.overallConfidence)}`}>
                {planning.planningConfidence.overallConfidence}%
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 mb-1">Écarts identifiés</p>
              <p className="text-2xl font-bold text-blue-900">
                {planning.gapAnalysis.gaps.length}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 mb-1">Jalons</p>
              <p className="text-2xl font-bold text-blue-900">
                {planning.milestones.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current and Target Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Position Actuelle
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Rôle</p>
                <p className="text-lg font-semibold text-gray-900">{planning.currentPosition.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Expérience</p>
                <p className="text-sm text-gray-900">{planning.currentPosition.experience}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Compétences</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {planning.currentPosition.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                      {skill}
                    </Badge>
                  ))}
                  {planning.currentPosition.skills.length > 5 && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      +{planning.currentPosition.skills.length - 5}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Position marché</p>
                <p className="text-sm text-gray-900">{planning.currentPosition.marketPosition}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <TargetIcon className="w-5 h-5" />
              Position Cible
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Rôle</p>
                <p className="text-lg font-semibold text-gray-900">{planning.targetPosition.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Expérience requise</p>
                <p className="text-sm text-gray-900">{planning.targetPosition.requiredExperience}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Compétences requises</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {planning.targetPosition.requiredSkills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                      {skill}
                    </Badge>
                  ))}
                  {planning.targetPosition.requiredSkills.length > 5 && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      +{planning.targetPosition.requiredSkills.length - 5}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Certifications</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {planning.targetPosition.requiredCertifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gap Analysis */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 cursor-pointer" onClick={() => toggleSection("gaps")}>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Analyse des Écarts
            </div>
            {expandedSection === "gaps" ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {expandedSection === "gaps" && (
          <CardContent className="p-6">
            <div className="space-y-3">
              {planning.gapAnalysis.gaps.map((gap, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getGapSizeColor(gap.gapSize)}>
                        {gap.gapSize}
                      </Badge>
                      <Badge className={getPriorityColor(gap.priority)}>
                        {gap.priority}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900 capitalize">{gap.category}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">État actuel</p>
                      <p className="text-sm text-gray-900">{gap.currentState}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">État requis</p>
                      <p className="text-sm text-gray-900">{gap.requiredState}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Stratégie de fermeture</p>
                      <p className="text-sm text-gray-900">{gap.closingStrategy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Planning Roadmap */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 cursor-pointer" onClick={() => toggleSection("roadmap")}>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5" />
              Feuille de Route
            </div>
            {expandedSection === "roadmap" ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {expandedSection === "roadmap" && (
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-900">Aujourd'hui</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-blue-600">Actions</p>
                    <ul className="text-sm text-blue-900 list-disc list-inside">
                      {planning.planningRoadmap.today.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Allocation de temps</p>
                    <p className="text-sm text-blue-900">{planning.planningRoadmap.today.timeAllocation}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-900">Cette semaine</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-green-600">Actions</p>
                    <ul className="text-sm text-green-900 list-disc list-inside">
                      {planning.planningRoadmap.thisWeek.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Allocation de temps</p>
                    <p className="text-sm text-green-900">{planning.planningRoadmap.thisWeek.timeAllocation}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-semibold text-purple-900">Ce mois</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-purple-600">Actions</p>
                    <ul className="text-sm text-purple-900 list-disc list-inside">
                      {planning.planningRoadmap.thisMonth.actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Allocation de temps</p>
                    <p className="text-sm text-purple-900">{planning.planningRoadmap.thisMonth.timeAllocation}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="w-4 h-4 text-orange-600" />
                  <p className="text-sm font-semibold text-orange-900">90 jours</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-orange-600">Actions</p>
                    <ul className="text-sm text-orange-900 list-disc list-inside">
                      {planning.planningRoadmap["90Days"].actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600">Allocation de temps</p>
                    <p className="text-sm text-orange-900">{planning.planningRoadmap["90Days"].timeAllocation}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="w-4 h-4 text-teal-600" />
                  <p className="text-sm font-semibold text-teal-900">6 mois</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-teal-600">Actions</p>
                    <ul className="text-sm text-teal-900 list-disc list-inside">
                      {planning.planningRoadmap["6Months"].actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-teal-600">Allocation de temps</p>
                    <p className="text-sm text-teal-900">{planning.planningRoadmap["6Months"].timeAllocation}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="w-4 h-4 text-indigo-600" />
                  <p className="text-sm font-semibold text-indigo-900">12 mois</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-indigo-600">Actions</p>
                    <ul className="text-sm text-indigo-900 list-disc list-inside">
                      {planning.planningRoadmap["12Months"].actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600">Allocation de temps</p>
                    <p className="text-sm text-indigo-900">{planning.planningRoadmap["12Months"].timeAllocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Milestones */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 cursor-pointer" onClick={() => toggleSection("milestones")}>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlagIcon className="w-5 h-5" />
              Jalons
            </div>
            {expandedSection === "milestones" ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {expandedSection === "milestones" && (
          <CardContent className="p-6">
            <div className="space-y-4">
              {planning.milestones.map((milestone, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-semibold text-gray-900">{milestone.objective}</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {milestone.estimatedCompletion}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Justification</p>
                      <p className="text-sm text-gray-900">{milestone.justification}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Critères de validation</p>
                      <ul className="text-sm text-gray-900 list-disc list-inside">
                        {milestone.validationCriteria.map((criterion, idx) => (
                          <li key={idx}>{criterion}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Indicateurs de succès</p>
                      <ul className="text-sm text-gray-900 list-disc list-inside">
                        {milestone.successIndicators.map((indicator, idx) => (
                          <li key={idx}>{indicator}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Priorities */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 cursor-pointer" onClick={() => toggleSection("priorities")}>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Priorités
            </div>
            {expandedSection === "priorities" ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {expandedSection === "priorities" && (
          <CardContent className="p-6">
            <div className="space-y-3">
              {planning.priorities.map((priority, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(priority.priority)}>
                        {priority.priority}
                      </Badge>
                      <p className="text-sm font-medium text-gray-900">{priority.action}</p>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {priority.deadline}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Justification</p>
                      <p className="text-sm text-gray-900">{priority.justification}</p>
                    </div>
                    {priority.dependencies.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600">Dépendances</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {priority.dependencies.map((dep, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Dependencies */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 cursor-pointer" onClick={() => toggleSection("dependencies")}>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranchIcon className="w-5 h-5" />
              Dépendances
            </div>
            {expandedSection === "dependencies" ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {expandedSection === "dependencies" && (
          <CardContent className="p-6">
            <div className="space-y-3">
              {planning.dependencies.map((dependency, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="w-4 h-4 text-gray-600" />
                    <p className="text-sm font-medium text-gray-900">{dependency.sourceAction}</p>
                    <ArrowRight className="w-4 h-4 text-gray-600" />
                    <p className="text-sm font-medium text-gray-900">{dependency.dependentAction}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {dependency.dependencyType}
                      </Badge>
                      <p className="text-xs text-gray-600">{dependency.resolutionStrategy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Impact estimé</p>
                      <p className="text-sm text-gray-900">{dependency.estimatedImpact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Risk Analysis */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 cursor-pointer" onClick={() => toggleSection("risks")}>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Analyse des Risques
            </div>
            {expandedSection === "risks" ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {expandedSection === "risks" && (
          <CardContent className="p-6">
            <div className="space-y-3">
              {planning.riskAnalysis.risks.map((risk, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangleIcon className="w-4 h-4 text-orange-600" />
                      <p className="text-sm font-medium text-gray-900">{risk.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getProbabilityColor(risk.probability)}>
                        {risk.probability}
                      </Badge>
                      <Badge className={getImpactColor(risk.impact)}>
                        {risk.impact}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Stratégie d'atténuation</p>
                      <p className="text-sm text-gray-900">{risk.mitigationStrategy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Plan de contingence</p>
                      <p className="text-sm text-gray-900">{risk.contingencyPlan}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Indicateurs de surveillance</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {risk.monitoringIndicators.map((indicator, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Alternative Plans */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 cursor-pointer" onClick={() => toggleSection("alternatives")}>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Plans Alternatifs
            </div>
            {expandedSection === "alternatives" ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {expandedSection === "alternatives" && (
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-green-900">Plan A (Principal)</p>
                  <Badge className="bg-green-100 text-green-700">
                    {planning.alternativePlans.planA.confidence}% confiance
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-green-600">Avantages</p>
                    <ul className="text-sm text-green-900 list-disc list-inside">
                      {planning.alternativePlans.planA.advantages.map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Limitations</p>
                    <ul className="text-sm text-green-900 list-disc list-inside">
                      {planning.alternativePlans.planA.limitations.map((lim, idx) => (
                        <li key={idx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-blue-900">Plan B (Secondaire)</p>
                  <Badge className="bg-blue-100 text-blue-700">
                    {planning.alternativePlans.planB.confidence}% confiance
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-blue-600">Avantages</p>
                    <ul className="text-sm text-blue-900 list-disc list-inside">
                      {planning.alternativePlans.planB.advantages.map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Limitations</p>
                    <ul className="text-sm text-blue-900 list-disc list-inside">
                      {planning.alternativePlans.planB.limitations.map((lim, idx) => (
                        <li key={idx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-purple-900">Plan C (Secours)</p>
                  <Badge className="bg-purple-100 text-purple-700">
                    {planning.alternativePlans.planC.confidence}% confiance
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-purple-600">Avantages</p>
                    <ul className="text-sm text-purple-900 list-disc list-inside">
                      {planning.alternativePlans.planC.advantages.map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Limitations</p>
                    <ul className="text-sm text-purple-900 list-disc list-inside">
                      {planning.alternativePlans.planC.limitations.map((lim, idx) => (
                        <li key={idx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Checkpoints */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 cursor-pointer" onClick={() => toggleSection("checkpoints")}>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Points de Contrôle
            </div>
            {expandedSection === "checkpoints" ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {expandedSection === "checkpoints" && (
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-900">7 jours</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-blue-600">Objectifs attendus</p>
                    <ul className="text-sm text-blue-900 list-disc list-inside">
                      {planning.checkpoints["7Days"].expectedObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Indicateurs clés</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {planning.checkpoints["7Days"].keyIndicators.map((ind, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-900">30 jours</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-green-600">Objectifs attendus</p>
                    <ul className="text-sm text-green-900 list-disc list-inside">
                      {planning.checkpoints["30Days"].expectedObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Indicateurs clés</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {planning.checkpoints["30Days"].keyIndicators.map((ind, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-orange-600" />
                  <p className="text-sm font-semibold text-orange-900">60 jours</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-orange-600">Objectifs attendus</p>
                    <ul className="text-sm text-orange-900 list-disc list-inside">
                      {planning.checkpoints["60Days"].expectedObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600">Indicateurs clés</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {planning.checkpoints["60Days"].keyIndicators.map((ind, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-semibold text-purple-900">90 jours</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-purple-600">Objectifs attendus</p>
                    <ul className="text-sm text-purple-900 list-disc list-inside">
                      {planning.checkpoints["90Days"].expectedObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600">Indicateurs clés</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {planning.checkpoints["90Days"].keyIndicators.map((ind, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-teal-600" />
                  <p className="text-sm font-semibold text-teal-900">180 jours</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-teal-600">Objectifs attendus</p>
                    <ul className="text-sm text-teal-900 list-disc list-inside">
                      {planning.checkpoints["180Days"].expectedObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-teal-600">Indicateurs clés</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {planning.checkpoints["180Days"].keyIndicators.map((ind, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-indigo-600" />
                  <p className="text-sm font-semibold text-indigo-900">365 jours</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-indigo-600">Objectifs attendus</p>
                    <ul className="text-sm text-indigo-900 list-disc list-inside">
                      {planning.checkpoints["365Days"].expectedObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600">Indicateurs clés</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {planning.checkpoints["365Days"].keyIndicators.map((ind, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-indigo-100 text-indigo-700 text-xs">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Planning Explainability */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 cursor-pointer" onClick={() => toggleSection("explainability")}>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Explicabilité du Plan
            </div>
            {expandedSection === "explainability" ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {expandedSection === "explainability" && (
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4" />
                  Moteurs consultés
                </p>
                <div className="flex flex-wrap gap-2">
                  {planning.planningExplainability.enginesConsulted.map((engine, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                      {engine}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4" />
                  Preuves utilisées
                </p>
                <div className="flex flex-wrap gap-2">
                  {planning.planningExplainability.evidenceUsed.map((evidence, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                      {evidence}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-orange-900 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraintes prises en compte
                </p>
                <div className="flex flex-wrap gap-2">
                  {planning.planningExplainability.constraintsConsidered.map((constraint, index) => (
                    <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                      {constraint}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                  <AlertTriangleIcon className="w-4 h-4" />
                  Risques associés
                </p>
                <div className="flex flex-wrap gap-2">
                  {planning.planningExplainability.risksAssociated.map((risk, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-700">
                      {risk}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Alternatives considérées
                </p>
                <div className="flex flex-wrap gap-2">
                  {planning.planningExplainability.alternativesConsidered.map((alternative, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {alternative}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Rationale
                </p>
                <p className="text-sm text-gray-900">{planning.planningExplainability.rationale}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

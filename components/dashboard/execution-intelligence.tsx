"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/components/design-system";
import { Play, Target, AlertTriangle, CheckCircle, Clock, ChevronRight, ChevronDown, Star, BarChart3, Settings, FileText, Activity, RefreshCw, Lightbulb, Award, Timer, Info, Shield, TrendingUp, MapPin, Route, Flag, ArrowUp, Unlock, AlertOctagon, GitBranch, Fingerprint, Lock, Scale } from "lucide-react";

interface ExecutionIntelligenceProps {
  execution: {
    nextBestAction: {
      action: string;
      actionType: string;
      actionDetails: string;
    };
    justification: {
      whyNow: string;
      whyNotOthers: string;
      expectedImpact: string;
      riskReduced: string;
      objectiveAdvanced: string;
    };
    priorityScore: {
      score: number;
      justification: string;
      urgency: "low" | "medium" | "high" | "critical";
      importance: "low" | "medium" | "high" | "critical";
    };
    executionConfidence: {
      level: "low" | "medium" | "high" | "very_high";
      justification: string;
      uncertaintyFactors: string[];
    };
    blockingFactors: {
      dependencies: string[];
      constraints: string[];
      immediateRisks: string[];
      missingInformation: string[];
    };
    expectedOutcome: {
      whatCandidateGets: string;
      whatItUnblocks: string;
      estimatedGain: string;
      timeToImpact: string;
    };
    opportunityWindow: {
      window: "critical_now" | "important" | "planifiable_later";
      justification: string;
      deadline?: string;
      consequenceIfDelayed: string;
    };
    executionExplainability: {
      intelligencesConsulted: string[];
      evidenceUsed: string[];
      candidateGraphConsulted: string;
      constraintsConsidered: string[];
      limitations: string[];
    };
    executionMetadata: {
      timestamp: string;
      planStep?: string;
      milestone?: string;
      alternativeActions: string[];
      rejectionReasons: string[];
    };
  };
  onRefresh?: () => void;
}

export function ExecutionIntelligence({ execution, onRefresh }: ExecutionIntelligenceProps) {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(["nextAction", "justification"]));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getPriorityColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "very_high": return "bg-green-500";
      case "high": return "bg-blue-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getWindowColor = (window: string) => {
    switch (window) {
      case "critical_now": return "bg-red-500";
      case "important": return "bg-orange-500";
      case "planifiable_later": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Play className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Next Best Action</h2>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Next Best Action Card */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Prochaine Action Recommandée</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(execution.priorityScore.urgency)}>
                {execution.priorityScore.urgency.toUpperCase()}
              </Badge>
              <Badge className={getWindowColor(execution.opportunityWindow.window)}>
                {execution.opportunityWindow.window.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Action */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Play className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{execution.nextBestAction.action}</h3>
                <p className="text-sm text-gray-600 mt-1">{execution.nextBestAction.actionDetails}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">{execution.nextBestAction.actionType}</Badge>
                  {execution.executionMetadata.planStep && (
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      <Route className="w-3 h-3 mr-1" />
                      {execution.executionMetadata.planStep}
                    </Badge>
                  )}
                  {execution.executionMetadata.milestone && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <Flag className="w-3 h-3 mr-1" />
                      {execution.executionMetadata.milestone}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Priority Score */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">Score de Priorité</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">{execution.priorityScore.score}/100</span>
              </div>
              <Progress value={execution.priorityScore.score} className="h-2" />
              <p className="text-xs text-gray-600 mt-2">{execution.priorityScore.justification}</p>
            </div>

            {/* Confidence */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Niveau de Confiance</span>
                </div>
                <Badge className={getConfidenceColor(execution.executionConfidence.level)}>
                  {execution.executionConfidence.level.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-2">{execution.executionConfidence.justification}</p>
            </div>

            {/* Opportunity Window */}
            {execution.opportunityWindow.deadline && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Date Limite</span>
                </div>
                <p className="text-sm text-orange-800 mt-1">{execution.opportunityWindow.deadline}</p>
                <p className="text-xs text-orange-700 mt-2">{execution.opportunityWindow.consequenceIfDelayed}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Justification Card */}
      <Card>
        <CardHeader>
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("justification")}
          >
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <span>Justification</span>
            </CardTitle>
            {expandedSections.has("justification") ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has("justification") && (
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Pourquoi maintenant ?</h4>
                  <p className="text-sm text-gray-600 mt-1">{execution.justification.whyNow}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Pourquoi avant les autres ?</h4>
                  <p className="text-sm text-gray-600 mt-1">{execution.justification.whyNotOthers}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Impact attendu</h4>
                  <p className="text-sm text-gray-600 mt-1">{execution.justification.expectedImpact}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Risque réduit</h4>
                  <p className="text-sm text-gray-600 mt-1">{execution.justification.riskReduced}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Target className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Objectif rapproché</h4>
                  <p className="text-sm text-gray-600 mt-1">{execution.justification.objectiveAdvanced}</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Expected Outcome Card */}
      <Card>
        <CardHeader>
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("outcome")}
          >
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Outcome Attendu</span>
            </CardTitle>
            {expandedSections.has("outcome") ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has("outcome") && (
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Ce que vous obtenez</h4>
                  <p className="text-sm text-gray-600 mt-1">{execution.expectedOutcome.whatCandidateGets}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Unlock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Ce que cela débloque</h4>
                  <p className="text-sm text-gray-600 mt-1">{execution.expectedOutcome.whatItUnblocks}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Gain estimé</h4>
                  <p className="text-sm text-gray-600 mt-1">{execution.expectedOutcome.estimatedGain}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Timer className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Temps pour voir l'impact</h4>
                  <p className="text-sm text-gray-600 mt-1">{execution.expectedOutcome.timeToImpact}</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Blocking Factors Card */}
      {(execution.blockingFactors.dependencies.length > 0 || 
        execution.blockingFactors.constraints.length > 0 || 
        execution.blockingFactors.immediateRisks.length > 0 || 
        execution.blockingFactors.missingInformation.length > 0) && (
        <Card>
          <CardHeader>
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("blocking")}
            >
              <CardTitle className="flex items-center space-x-2">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                <span>Facteurs de Blocage</span>
              </CardTitle>
              {expandedSections.has("blocking") ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </CardHeader>
          {expandedSections.has("blocking") && (
            <CardContent className="pt-6">
              <div className="space-y-4">
                {execution.blockingFactors.dependencies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <GitBranch className="w-4 h-4 text-blue-600 mr-2" />
                      Dépendances
                    </h4>
                    <ul className="space-y-1">
                      {execution.blockingFactors.dependencies.map((dep, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{dep}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {execution.blockingFactors.constraints.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <Lock className="w-4 h-4 text-red-600 mr-2" />
                      Contraintes
                    </h4>
                    <ul className="space-y-1">
                      {execution.blockingFactors.constraints.map((constraint, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {execution.blockingFactors.immediateRisks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                      Risques immédiats
                    </h4>
                    <ul className="space-y-1">
                      {execution.blockingFactors.immediateRisks.map((risk, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {execution.blockingFactors.missingInformation.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <Info className="w-4 h-4 text-gray-600 mr-2" />
                      Informations manquantes
                    </h4>
                    <ul className="space-y-1">
                      {execution.blockingFactors.missingInformation.map((info, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{info}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Explainability Card */}
      <Card>
        <CardHeader>
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("explainability")}
          >
            <CardTitle className="flex items-center space-x-2">
              <Fingerprint className="w-5 h-5 text-purple-600" />
              <span>Explicabilité</span>
            </CardTitle>
            {expandedSections.has("explainability") ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has("explainability") && (
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <Activity className="w-4 h-4 text-blue-600 mr-2" />
                  Intelligences consultées
                </h4>
                <div className="flex flex-wrap gap-2">
                  {execution.executionExplainability.intelligencesConsulted.map((intel, idx) => (
                    <Badge key={idx} variant="outline">{intel}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <FileText className="w-4 h-4 text-green-600 mr-2" />
                  Preuves utilisées
                </h4>
                <ul className="space-y-1">
                  {execution.executionExplainability.evidenceUsed.map((evidence, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{evidence}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 text-purple-600 mr-2" />
                  CandidateGraph consulté
                </h4>
                <p className="text-sm text-gray-600">{execution.executionExplainability.candidateGraphConsulted}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <Scale className="w-4 h-4 text-orange-600 mr-2" />
                  Contraintes prises en compte
                </h4>
                <ul className="space-y-1">
                  {execution.executionExplainability.constraintsConsidered.map((constraint, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <AlertOctagon className="w-4 h-4 text-red-600 mr-2" />
                  Limites
                </h4>
                <ul className="space-y-1">
                  {execution.executionExplainability.limitations.map((limit, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{limit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("metadata")}
          >
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Métadonnées</span>
            </CardTitle>
            {expandedSections.has("metadata") ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has("metadata") && (
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Horodatage de la décision</span>
                <span className="text-sm font-medium text-gray-900">{formatTimestamp(execution.executionMetadata.timestamp)}</span>
              </div>

              {execution.executionMetadata.alternativeActions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Actions alternatives considérées</h4>
                  <ul className="space-y-1">
                    {execution.executionMetadata.alternativeActions.map((action, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {execution.executionMetadata.rejectionReasons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Raisons du rejet des alternatives</h4>
                  <ul className="space-y-1">
                    {execution.executionMetadata.rejectionReasons.map((reason, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

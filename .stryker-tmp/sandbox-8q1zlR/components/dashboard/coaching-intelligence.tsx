// @ts-nocheck
"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/design-system";
import { Heart, Target, AlertTriangle, CheckCircle, Clock, ChevronRight, ChevronDown, Activity, RefreshCw, Timer, Info, Shield, TrendingUp, MapPin, Route, BookOpen, Zap, Brain, MessageSquare } from "lucide-react";

interface CoachingIntelligenceProps {
  coaching: {
    coachingGuidance: {
      howToStart: string;
      steps: Array<{
        stepNumber: number;
        description: string;
        estimatedTime: string;
        completionCriteria: string;
      }>;
      commonPitfalls: string[];
      howToOvercomeObstacles: string;
    };
    motivationStrategy: {
      tone: "encouraging" | "realistic" | "challenging";
      approach: string;
      confidenceLevel: "high" | "medium" | "low";
      adaptationReason: string;
    };
    microObjectives: Array<{
      objective: string;
      estimatedTime: string;
      completionCriteria: string;
      priority: "high" | "medium" | "low";
    }>;
    learningTips: Array<{
      tip: string;
      technique: string;
      resource: string;
    }>;
    encouragement: {
      message: string;
      basedOn: string[];
      potentialHighlight: string;
    };
    riskPrevention: {
      commonErrors: string[];
      likelyBlockages: string[];
      badPriorities: string[];
      motivationRisks: string[];
      preventionStrategies: string[];
    };
    adaptiveCoaching: {
      constraintsConsidered: string[];
      confidenceAdjustment: string;
      resourceOptimization: string;
      progressionAdaptation: string;
    };
    coachingExplainability: {
      whyThisCoaching: string;
      intelligencesConsulted: string[];
      evidenceUsed: string[];
      candidateGraphConsulted: string;
      limitations: string[];
    };
    coachingMetadata: {
      timestamp: string;
      nextBestActionId: string;
      adaptationLevel: "high" | "medium" | "low";
      personalizationScore: number;
    };
  };
  onRefresh?: () => void;
}

export function CoachingIntelligence({ coaching, onRefresh }: CoachingIntelligenceProps) {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(["guidance", "motivation"]));

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

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "encouraging": return "bg-green-500";
      case "realistic": return "bg-blue-500";
      case "challenging": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "high": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getAdaptationColor = (level: string) => {
    switch (level) {
      case "high": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          Coaching Intelligence
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {coaching.coachingMetadata.adaptationLevel}
          </Badge>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Rafraîchir"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coaching Guidance */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("guidance")}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Coaching Guidance</span>
            </div>
            {expandedSections.has("guidance") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has("guidance") && (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Par où commencer:</strong> {coaching.coachingGuidance.howToStart}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Route className="w-4 h-4" />
                  Étapes à suivre
                </h4>
                <div className="space-y-2">
                  {coaching.coachingGuidance.steps.map((step) => (
                    <div key={step.stepNumber} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">
                          {step.stepNumber}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium">{step.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {step.estimatedTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {step.completionCriteria}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Pièges à éviter
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {coaching.coachingGuidance.commonPitfalls.map((pitfall, index) => (
                    <li key={index}>{pitfall}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Comment surmonter les obstacles:</strong> {coaching.coachingGuidance.howToOvercomeObstacles}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Motivation Strategy */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("motivation")}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">Motivation Strategy</span>
            </div>
            {expandedSections.has("motivation") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has("motivation") && (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={getToneColor(coaching.motivationStrategy.tone)}>
                  {coaching.motivationStrategy.tone}
                </Badge>
                <Badge className={getConfidenceColor(coaching.motivationStrategy.confidenceLevel)}>
                  Confiance: {coaching.motivationStrategy.confidenceLevel}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Approche:</strong> {coaching.motivationStrategy.approach}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Adaptation:</strong> {coaching.motivationStrategy.adaptationReason}
              </p>
            </div>
          )}
        </div>

        {/* Micro Objectives */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("microObjectives")}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Micro Objectives</span>
              <Badge variant="outline">{coaching.microObjectives.length}</Badge>
            </div>
            {expandedSections.has("microObjectives") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has("microObjectives") && (
            <div className="p-4 space-y-2">
              {coaching.microObjectives.map((objective, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Badge className={getPriorityColor(objective.priority)}>
                      {objective.priority}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium">{objective.objective}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {objective.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {objective.completionCriteria}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Tips */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("learningTips")}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-500" />
              <span className="font-medium">Learning Tips</span>
              <Badge variant="outline">{coaching.learningTips.length}</Badge>
            </div>
            {expandedSections.has("learningTips") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has("learningTips") && (
            <div className="p-4 space-y-2">
              {coaching.learningTips.map((tip, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{tip.tip}</p>
                  <div className="mt-1 text-sm text-gray-600">
                    <p><strong>Technique:</strong> {tip.technique}</p>
                    <p><strong>Ressource:</strong> {tip.resource}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Encouragement */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("encouragement")}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-pink-500" />
              <span className="font-medium">Encouragement</span>
            </div>
            {expandedSections.has("encouragement") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has("encouragement") && (
            <div className="p-4 space-y-3">
              <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                <p className="font-medium text-pink-900">{coaching.encouragement.message}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Basé sur:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {coaching.encouragement.basedOn.map((evidence, index) => (
                    <li key={index}>{evidence}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Potentiel démontré:</strong> {coaching.encouragement.potentialHighlight}
              </p>
            </div>
          )}
        </div>

        {/* Risk Prevention */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("riskPrevention")}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              <span className="font-medium">Risk Prevention</span>
            </div>
            {expandedSections.has("riskPrevention") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has("riskPrevention") && (
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Erreurs fréquentes
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {coaching.riskPrevention.commonErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Blocages probables</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {coaching.riskPrevention.likelyBlockages.map((blockage, index) => (
                    <li key={index}>{blockage}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Mauvaises priorités</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {coaching.riskPrevention.badPriorities.map((priority, index) => (
                    <li key={index}>{priority}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Risques de motivation</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {coaching.riskPrevention.motivationRisks.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Stratégies de prévention
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {coaching.riskPrevention.preventionStrategies.map((strategy, index) => (
                    <li key={index}>{strategy}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Adaptive Coaching */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("adaptiveCoaching")}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">Adaptive Coaching</span>
              <Badge className={getAdaptationColor(coaching.coachingMetadata.adaptationLevel)}>
                {coaching.coachingMetadata.adaptationLevel}
              </Badge>
            </div>
            {expandedSections.has("adaptiveCoaching") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has("adaptiveCoaching") && (
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Contraintes considérées:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {coaching.adaptiveCoaching.constraintsConsidered.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Ajustement de confiance:</strong> {coaching.adaptiveCoaching.confidenceAdjustment}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Optimisation des ressources:</strong> {coaching.adaptiveCoaching.resourceOptimization}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Adaptation selon progression:</strong> {coaching.adaptiveCoaching.progressionAdaptation}
              </p>
            </div>
          )}
        </div>

        {/* Coaching Explainability */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("explainability")}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Explainability</span>
            </div>
            {expandedSections.has("explainability") ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has("explainability") && (
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600">
                <strong>Pourquoi ce coaching:</strong> {coaching.coachingExplainability.whyThisCoaching}
              </p>
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Intelligences consultées:</strong>
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {coaching.coachingExplainability.intelligencesConsulted.map((intelligence, index) => (
                    <Badge key={index} variant="outline">{intelligence}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Preuves utilisées:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {coaching.coachingExplainability.evidenceUsed.map((evidence, index) => (
                    <li key={index}>{evidence}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                <strong>CandidateGraph consulté:</strong> {coaching.coachingExplainability.candidateGraphConsulted}
              </p>
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Limites:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {coaching.coachingExplainability.limitations.map((limitation, index) => (
                    <li key={index}>{limitation}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Coaching Metadata */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(coaching.coachingMetadata.timestamp).toLocaleString('fr-FR')}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Score de personnalisation: {coaching.coachingMetadata.personalizationScore}%
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              ID: {coaching.coachingMetadata.nextBestActionId}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

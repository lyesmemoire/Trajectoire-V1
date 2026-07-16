// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/components/design-system";
import { User, Brain, TrendingUp, Target, Zap, Clock, MessageSquare, CheckCircle, AlertTriangle, Lightbulb, Settings, Heart, BookOpen, Gauge, ArrowUp, ArrowDown, Minus } from "lucide-react";

interface PersonalizationIntelligenceProps {
  personalization: {
    learningProfile: {
      autonomy: {
        level: "high" | "medium" | "low";
        confidence: number;
        evidence: string[];
        observations: string[];
      };
      guidancePreference: {
        explanationLength: "short" | "medium" | "long";
        detailLevel: "minimal" | "moderate" | "comprehensive";
        examplePreference: "none" | "few" | "many";
        confidence: number;
        evidence: string[];
        observations: string[];
      };
      motivationSensitivity: {
        encouragement: "low" | "medium" | "high";
        reminder: "low" | "medium" | "high";
        challenge: "low" | "medium" | "high";
        feedback: "low" | "medium" | "high";
        confidence: number;
        evidence: string[];
        observations: string[];
      };
      learningCharacteristics: {
        learningSpeed: "very_slow" | "slow" | "moderate" | "fast" | "very_fast";
        executionSpeed: "very_slow" | "slow" | "moderate" | "fast" | "very_fast";
        complexityTolerance: "low" | "medium" | "high";
        planningCapability: "low" | "medium" | "high";
        habitStability: "low" | "medium" | "high";
        confidence: number;
        evidence: string[];
        observations: string[];
      };
      reactionPatterns: {
        failureReaction: "discouraged" | "resilient" | "motivated";
        successReaction: "celebrates" | "moves_on" | "builds_on";
        overloadThreshold: string;
        understimulationThreshold: string;
        confidence: number;
        evidence: string[];
        observations: string[];
      };
    };
    currentCoachingStyle: {
      responseLength: "short" | "medium" | "long";
      detailLevel: "minimal" | "moderate" | "comprehensive";
      vocabulary: "simple" | "standard" | "technical";
      exampleUsage: "none" | "few" | "many";
      reminderFrequency: "none" | "low" | "medium" | "high";
      goalDifficulty: "very_easy" | "easy" | "moderate" | "challenging" | "very_challenging";
      goalCount: "single" | "2-3" | "4-5";
      autonomyLevel: "high" | "medium" | "low";
      recommendationLoad: "1" | "2-3" | "4-5" | "6+";
      encouragementLevel: "minimal" | "moderate" | "high";
      progressionSpeed: "very_slow" | "slow" | "moderate" | "fast" | "very_fast";
      confidence: number;
      reasoning: string;
    };
    coachingEffectiveness: {
      overallEffectiveness: number;
      followThroughRate: number;
      implementationQuality: number;
      outcomeQuality: number;
      engagementLevel: number;
      satisfactionIndicators: string[];
      concernIndicators: string[];
      confidence: number;
      evidence: string[];
    };
    detectedPatterns: {
      effectiveFormats: string[];
      ineffectiveFormats: string[];
      motivationTriggers: string[];
      demotivators: string[];
      optimalDifficulty: string;
      optimalPace: string;
      optimalSupport: string;
      confidence: number;
      evidence: string[];
    };
    adaptationRecommendations: {
      shouldAdapt: boolean;
      adaptationType: "none" | "simplify" | "complexify" | "encourage" | "challenge" | "support" | "autonomize";
      reasoning: string;
      expectedImpact: string;
      confidence: number;
    };
    explainability: {
      whyThisCoachingStyle: string;
      whyTheseAdaptations: string;
      observationsUsed: string[];
      learnings: string[];
      confidence: number;
      limitations: string[];
    };
    confidence: number;
    evidenceLevel: "none" | "very_weak" | "weak" | "moderate" | "strong" | "very_strong";
    dataQuality: number;
  };
}

export function PersonalizationIntelligence({ personalization }: PersonalizationIntelligenceProps) {
  const getEvidenceColor = (level: string) => {
    switch (level) {
      case "very_strong":
        return "bg-green-100 text-green-700";
      case "strong":
        return "bg-green-50 text-green-600";
      case "moderate":
        return "bg-blue-50 text-blue-600";
      case "weak":
        return "bg-amber-50 text-amber-600";
      case "very_weak":
        return "bg-orange-50 text-orange-600";
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

  const getAutonomyIcon = (level: string) => {
    switch (level) {
      case "high":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "medium":
        return <Minus className="w-4 h-4 text-blue-600" />;
      case "low":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case "very_fast":
      case "fast":
        return <Zap className="w-4 h-4 text-green-600" />;
      case "moderate":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "slow":
      case "very_slow":
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getAdaptationIcon = (type: string) => {
    switch (type) {
      case "simplify":
        return <ArrowDown className="w-4 h-4 text-blue-600" />;
      case "complexify":
        return <ArrowUp className="w-4 h-4 text-purple-600" />;
      case "encourage":
        return <Heart className="w-4 h-4 text-pink-600" />;
      case "challenge":
        return <Target className="w-4 h-4 text-red-600" />;
      case "support":
        return <Settings className="w-4 h-4 text-green-600" />;
      case "autonomize":
        return <User className="w-4 h-4 text-indigo-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 shadow-sm">
      <CardHeader className="border-b border-rose-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-rose-900 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Personalization Intelligence
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getEvidenceColor(personalization.evidenceLevel)}>
              {personalization.evidenceLevel.replace("_", " ")}
            </Badge>
            <Badge className={getConfidenceColor(personalization.confidence)}>
              {personalization.confidence}% confiance
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Learning Profile */}
        <div className="space-y-4">
          <h3 className="font-semibold text-rose-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Profil d'apprentissage
          </h3>
          
          {/* Autonomy */}
          <div className="p-4 bg-white rounded-lg border border-rose-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-rose-900">Autonomie</span>
              <div className="flex items-center gap-2">
                {getAutonomyIcon(personalization.learningProfile.autonomy.level)}
                <span className="text-sm text-rose-700 capitalize">{personalization.learningProfile.autonomy.level}</span>
              </div>
            </div>
            <Progress value={personalization.learningProfile.autonomy.confidence} className="h-2" />
            <p className="text-xs text-rose-600 mt-1">{personalization.learningProfile.autonomy.confidence}% confiance</p>
          </div>

          {/* Learning Characteristics */}
          <div className="p-4 bg-white rounded-lg border border-rose-200">
            <p className="text-sm font-medium text-rose-900 mb-3">Caractéristiques d'apprentissage</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                {getSpeedIcon(personalization.learningProfile.learningCharacteristics.learningSpeed)}
                <div>
                  <p className="text-xs text-rose-600">Vitesse d'apprentissage</p>
                  <p className="text-sm font-medium text-rose-900 capitalize">{personalization.learningProfile.learningCharacteristics.learningSpeed.replace("_", " ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getSpeedIcon(personalization.learningProfile.learningCharacteristics.executionSpeed)}
                <div>
                  <p className="text-xs text-rose-600">Vitesse d'exécution</p>
                  <p className="text-sm font-medium text-rose-900 capitalize">{personalization.learningProfile.learningCharacteristics.executionSpeed.replace("_", " ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs text-rose-600">Tolérance complexité</p>
                  <p className="text-sm font-medium text-rose-900 capitalize">{personalization.learningProfile.learningCharacteristics.complexityTolerance}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-xs text-rose-600">Capacité planification</p>
                  <p className="text-sm font-medium text-rose-900 capitalize">{personalization.learningProfile.learningCharacteristics.planningCapability}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reaction Patterns */}
          <div className="p-4 bg-white rounded-lg border border-rose-200">
            <p className="text-sm font-medium text-rose-900 mb-3">Réactions</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-rose-600">Réaction aux échecs</p>
                <p className="text-sm font-medium text-rose-900 capitalize">{personalization.learningProfile.reactionPatterns.failureReaction}</p>
              </div>
              <div>
                <p className="text-xs text-rose-600">Réaction aux succès</p>
                <p className="text-sm font-medium text-rose-900 capitalize">{personalization.learningProfile.reactionPatterns.successReaction}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Coaching Style */}
        <div className="space-y-4">
          <h3 className="font-semibold text-rose-900 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Style de coaching actuel
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Longueur réponse</p>
              <p className="text-sm font-medium text-rose-900 capitalize">{personalization.currentCoachingStyle.responseLength}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Niveau détail</p>
              <p className="text-sm font-medium text-rose-900 capitalize">{personalization.currentCoachingStyle.detailLevel}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Difficulté objectifs</p>
              <p className="text-sm font-medium text-rose-900 capitalize">{personalization.currentCoachingStyle.goalDifficulty.replace("_", " ")}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Charge recommandations</p>
              <p className="text-sm font-medium text-rose-900">{personalization.currentCoachingStyle.recommendationLoad}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Niveau autonomie</p>
              <p className="text-sm font-medium text-rose-900 capitalize">{personalization.currentCoachingStyle.autonomyLevel}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Vitesse progression</p>
              <p className="text-sm font-medium text-rose-900 capitalize">{personalization.currentCoachingStyle.progressionSpeed.replace("_", " ")}</p>
            </div>
          </div>
        </div>

        {/* Coaching Effectiveness */}
        <div className="space-y-4">
          <h3 className="font-semibold text-rose-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Efficacité du coaching
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-rose-700">Efficacité globale</span>
                <span className="text-sm font-medium text-rose-900">{personalization.coachingEffectiveness.overallEffectiveness}%</span>
              </div>
              <Progress value={personalization.coachingEffectiveness.overallEffectiveness} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-rose-700">Taux de suivi</span>
                <span className="text-sm font-medium text-rose-900">{personalization.coachingEffectiveness.followThroughRate}%</span>
              </div>
              <Progress value={personalization.coachingEffectiveness.followThroughRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-rose-700">Qualité mise en œuvre</span>
                <span className="text-sm font-medium text-rose-900">{personalization.coachingEffectiveness.implementationQuality}%</span>
              </div>
              <Progress value={personalization.coachingEffectiveness.implementationQuality} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-rose-700">Niveau d'engagement</span>
                <span className="text-sm font-medium text-rose-900">{personalization.coachingEffectiveness.engagementLevel}%</span>
              </div>
              <Progress value={personalization.coachingEffectiveness.engagementLevel} className="h-2" />
            </div>
          </div>

          {personalization.coachingEffectiveness.satisfactionIndicators.length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-medium text-green-900 mb-2">Indicateurs positifs</p>
              <div className="space-y-1">
                {personalization.coachingEffectiveness.satisfactionIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800">{indicator}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {personalization.coachingEffectiveness.concernIndicators.length > 0 && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs font-medium text-amber-900 mb-2">Indicateurs de préoccupation</p>
              <div className="space-y-1">
                {personalization.coachingEffectiveness.concernIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">{indicator}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detected Patterns */}
        <div className="space-y-4">
          <h3 className="font-semibold text-rose-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Patterns détectés
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Difficulté optimale</p>
              <p className="text-sm font-medium text-rose-900">{personalization.detectedPatterns.optimalDifficulty}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Rythme optimal</p>
              <p className="text-sm font-medium text-rose-900">{personalization.detectedPatterns.optimalPace}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <p className="text-xs text-rose-600">Support optimal</p>
              <p className="text-sm font-medium text-rose-900">{personalization.detectedPatterns.optimalSupport}</p>
            </div>
          </div>

          {personalization.detectedPatterns.effectiveFormats.length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-medium text-green-900 mb-2">Formats efficaces</p>
              <div className="space-y-1">
                {personalization.detectedPatterns.effectiveFormats.map((format, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800">{format}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {personalization.detectedPatterns.ineffectiveFormats.length > 0 && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs font-medium text-red-900 mb-2">Formats inefficaces</p>
              <div className="space-y-1">
                {personalization.detectedPatterns.ineffectiveFormats.map((format, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800">{format}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Adaptation Recommendations */}
        {personalization.adaptationRecommendations.shouldAdapt && (
          <div className="space-y-4">
            <h3 className="font-semibold text-rose-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Adaptation recommandée
            </h3>
            
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                {getAdaptationIcon(personalization.adaptationRecommendations.adaptationType)}
                <span className="text-sm font-medium text-blue-900 capitalize">
                  {personalization.adaptationRecommendations.adaptationType}
                </span>
              </div>
              <p className="text-sm text-blue-800 mb-2">{personalization.adaptationRecommendations.reasoning}</p>
              <p className="text-xs text-blue-700">{personalization.adaptationRecommendations.expectedImpact}</p>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(personalization.adaptationRecommendations.confidence)}`}>
                  {personalization.adaptationRecommendations.confidence}% confiance
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Explainability */}
        <div className="space-y-4">
          <h3 className="font-semibold text-rose-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Pourquoi ce style de coaching ?
          </h3>
          
          <div className="p-4 bg-white rounded-lg border border-rose-200">
            <p className="text-sm text-rose-800 mb-3">{personalization.explainability.whyThisCoachingStyle}</p>
            
            {personalization.explainability.observationsUsed.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-rose-900 mb-1">Observations utilisées</p>
                <div className="space-y-1">
                  {personalization.explainability.observationsUsed.slice(0, 3).map((obs, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-rose-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-rose-700">{obs}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {personalization.explainability.learnings.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-rose-900 mb-1">Apprentissages</p>
                <div className="space-y-1">
                  {personalization.explainability.learnings.slice(0, 3).map((learning, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="w-3 h-3 text-rose-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-rose-700">{learning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {personalization.explainability.limitations.length > 0 && (
              <div>
                <p className="text-xs font-medium text-amber-900 mb-1">Limitations</p>
                <div className="space-y-1">
                  {personalization.explainability.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">{limitation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

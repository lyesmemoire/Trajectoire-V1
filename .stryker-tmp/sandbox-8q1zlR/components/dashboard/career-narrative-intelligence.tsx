// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/components/design-system";
import { BookOpen, Award, Target, User, Briefcase, Sparkles, ArrowRight, CheckCircle, AlertTriangle, Info, Star, Lightbulb, BarChart3, MessageSquare, Users, Shield, Brain, Trophy, Fingerprint, Activity, GitBranch } from "lucide-react";

interface CareerNarrativeIntelligenceProps {
  narrative: {
    careerStory: {
      summary: string;
      thread: string;
      keyTurningPoints: Array<{
        point: string;
        significance: string;
        evidence: string[];
        confidence: number;
      }>;
      currentDirection: string;
      confidence: number;
    };
    careerThemes: Array<{
      theme: string;
      description: string;
      evidence: string[];
      confidence: number;
    }>;
    evolutionNarrative: {
      professionalEvolution: string;
      progression: string;
      skillDevelopment: string;
      growthTrajectory: string;
      confidence: number;
    };
    transitionAnalysis: Array<{
      transition: string;
      reason: string;
      learned: string;
      skillsTransferred: string[];
      positiveFraming: string;
      evidence: string[];
      confidence: number;
    }>;
    strengthNarrative: {
      recurringStrengths: Array<{
        strength: string;
        appearance: string;
        evidence: string[];
        confidence: number;
      }>;
      valueDelivery: string;
      uniqueValue: string;
      confidence: number;
    };
    motivationNarrative: {
      evolution: string;
      currentDrivers: string;
      goalConnection: string;
      aspirations: string;
      confidence: number;
    };
    careerIdentity: {
      dominantIdentity: string;
      selfDefinition: string;
      coreNarrative: string;
      uniqueStory: string;
      authenticVoice: string;
      confidence: number;
    };
    consistencyAnalysis: {
      overallCoherence: string;
      coherenceBreaks: Array<{
        break: string;
        impact: string;
        suggestion: string;
        confidence: number;
      }>;
      gaps: Array<{
        gap: string;
        needs: string;
        confidence: number;
      }>;
      confidence: number;
    };
    missingNarrative: Array<{
      element: string;
      why: string;
      suggestion: string;
      confidence: number;
    }>;
    contextAdaptedNarratives: {
      cv: {
        summary: string;
        keyPoints: string[];
        achievements: string[];
        confidence: number;
      };
      linkedin: {
        summary: string;
        keyPoints: string[];
        story: string;
        confidence: number;
      };
      interview: {
        story: string;
        keyAnecdotes: string[];
        transitionExplanations: string[];
        confidence: number;
      };
      networking: {
        elevatorPitch: string;
        conversationStarters: string[];
        memorablePoints: string[];
        confidence: number;
      };
      coverLetter: {
        narrative: string;
        connection: string;
        valueProposition: string;
        confidence: number;
      };
      starResponses: {
        situations: string[];
        achievements: string[];
        challenges: string[];
        confidence: number;
      };
    };
    confidence: {
      overall: number;
      byElement: {
        careerStory: number;
        careerThemes: number;
        evolutionNarrative: number;
        transitionAnalysis: number;
        strengthNarrative: number;
        motivationNarrative: number;
        careerIdentity: number;
        consistencyAnalysis: number;
        missingNarrative: number;
      };
      informationGaps: string[];
    };
    narrativeFingerprint: {
      hash: string;
      dataSources: string[];
      lastModified: string;
      stability: string;
    };
    consistencyScore: {
      overall: number;
      contradictionsDetected: number;
      transitionsUnexplained: number;
      periodsUndocumented: number;
      skillsIncoherent: number;
      goalsIncompatible: number;
      experiencesContradictory: number;
      narrationIncomplete: number;
      explanation: string;
    };
    narrativeEvolution: {
      identityEvolution: {
        previousIdentity: string;
        currentIdentity: string;
        changeExplanation: string;
        confidence: number;
      };
      strengthsEvolution: {
        previousStrengths: string[];
        currentStrengths: string[];
        evolutionExplanation: string;
        confidence: number;
      };
      motivationsEvolution: {
        previousMotivations: string[];
        currentMotivations: string[];
        evolutionExplanation: string;
        confidence: number;
      };
      goalsEvolution: {
        previousGoals: string[];
        currentGoals: string[];
        evolutionExplanation: string;
        confidence: number;
      };
      coherenceEvolution: {
        previousCoherence: number;
        currentCoherence: number;
        evolutionExplanation: string;
        confidence: number;
      };
      confidenceEvolution: {
        previousConfidence: number;
        currentConfidence: number;
        evolutionExplanation: string;
        confidence: number;
      };
    };
    narrativeEvidence: {
      careerIdentityEvidence: {
        experiences: string[];
        skills: string[];
        certifications: string[];
        conversations: string[];
        achievements: string[];
        goals: string[];
        applications: string[];
        recommendations: string[];
      };
      careerStoryEvidence: {
        experiences: string[];
        transitions: string[];
        achievements: string[];
        gaps: string[];
      };
      strengthsEvidence: {
        experiences: string[];
        achievements: string[];
        skills: string[];
      };
      motivationsEvidence: {
        goals: string[];
        decisions: string[];
        applications: string[];
      };
    };
  };
}

export function CareerNarrativeIntelligence({ narrative }: CareerNarrativeIntelligenceProps) {
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100";
    if (confidence >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getThemeIcon = (theme: string) => {
    const themeLower = theme.toLowerCase();
    if (themeLower.includes("leadership")) return <Users className="w-4 h-4" />;
    if (themeLower.includes("expertise") || themeLower.includes("technical")) return <Brain className="w-4 h-4" />;
    if (themeLower.includes("innovation")) return <Lightbulb className="w-4 h-4" />;
    if (themeLower.includes("management")) return <Briefcase className="w-4 h-4" />;
    if (themeLower.includes("product")) return <Target className="w-4 h-4" />;
    if (themeLower.includes("research")) return <BookOpen className="w-4 h-4" />;
    if (themeLower.includes("commercial") || themeLower.includes("sales")) return <Trophy className="w-4 h-4" />;
    if (themeLower.includes("entrepreneur")) return <Sparkles className="w-4 h-4" />;
    if (themeLower.includes("communication")) return <MessageSquare className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Career Identity Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
        <CardHeader className="border-b border-purple-200">
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Identité Professionnelle
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-900">Identité dominante</span>
              <Badge className={`${getConfidenceBgColor(narrative.careerIdentity.confidence)} ${getConfidenceColor(narrative.careerIdentity.confidence)}`}>
                {narrative.careerIdentity.confidence}% confiance
              </Badge>
            </div>
            <p className="text-lg font-semibold text-purple-800">{narrative.careerIdentity.dominantIdentity}</p>
            
            <div className="pt-4 border-t border-purple-200">
              <p className="text-sm text-purple-700 mb-2">Définition personnelle</p>
              <p className="text-sm text-purple-600">{narrative.careerIdentity.selfDefinition}</p>
            </div>

            <div className="pt-4 border-t border-purple-200">
              <p className="text-sm text-purple-700 mb-2">Narrative core</p>
              <p className="text-sm text-purple-600">{narrative.careerIdentity.coreNarrative}</p>
            </div>

            <div className="pt-4 border-t border-purple-200">
              <p className="text-sm text-purple-700 mb-2">Histoire unique</p>
              <p className="text-sm text-purple-600">{narrative.careerIdentity.uniqueStory}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Story Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
        <CardHeader className="border-b border-blue-200">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Histoire de Carrière
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Confiance narrative</span>
              <Badge className={`${getConfidenceBgColor(narrative.careerStory.confidence)} ${getConfidenceColor(narrative.careerStory.confidence)}`}>
                {narrative.careerStory.confidence}%
              </Badge>
            </div>

            <div>
              <p className="text-sm text-blue-700 mb-2">Résumé</p>
              <p className="text-sm text-blue-600">{narrative.careerStory.summary}</p>
            </div>

            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm text-blue-700 mb-2">Fil conducteur</p>
              <p className="text-sm text-blue-600">{narrative.careerStory.thread}</p>
            </div>

            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm text-blue-700 mb-2">Direction actuelle</p>
              <p className="text-sm text-blue-600">{narrative.careerStory.currentDirection}</p>
            </div>

            {narrative.careerStory.keyTurningPoints.length > 0 && (
              <div className="pt-4 border-t border-blue-200">
                <p className="text-sm text-blue-700 mb-2">Points de virage clés</p>
                <div className="space-y-2">
                  {narrative.careerStory.keyTurningPoints.map((point, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-blue-200">
                      <p className="text-xs font-medium text-blue-800">{point.point}</p>
                      <p className="text-xs text-blue-600 mt-1">{point.significance}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-blue-500">{point.confidence}% confiance</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Career Themes Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
        <CardHeader className="border-b border-green-200">
          <CardTitle className="text-green-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Thèmes Professionnels
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {narrative.careerThemes.map((theme, index) => (
              <div key={index} className="p-3 bg-white rounded border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getThemeIcon(theme.theme)}
                    <span className="text-sm font-medium text-green-800">{theme.theme}</span>
                  </div>
                  <Badge className={`${getConfidenceBgColor(theme.confidence)} ${getConfidenceColor(theme.confidence)}`}>
                    {theme.confidence}%
                  </Badge>
                </div>
                <p className="text-xs text-green-600">{theme.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strength Narrative Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-sm">
        <CardHeader className="border-b border-orange-200">
          <CardTitle className="text-orange-900 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Forces Récurrentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-900">Confiance</span>
              <Badge className={`${getConfidenceBgColor(narrative.strengthNarrative.confidence)} ${getConfidenceColor(narrative.strengthNarrative.confidence)}`}>
                {narrative.strengthNarrative.confidence}%
              </Badge>
            </div>

            <div className="space-y-2">
              {narrative.strengthNarrative.recurringStrengths.map((strength, index) => (
                <div key={index} className="p-3 bg-white rounded border border-orange-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-orange-800">{strength.strength}</span>
                    <Badge className={`${getConfidenceBgColor(strength.confidence)} ${getConfidenceColor(strength.confidence)}`}>
                      {strength.confidence}%
                    </Badge>
                  </div>
                  <p className="text-xs text-orange-600">{strength.appearance}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-orange-200">
              <p className="text-sm text-orange-700 mb-2">Livraison de valeur</p>
              <p className="text-sm text-orange-600">{narrative.strengthNarrative.valueDelivery}</p>
            </div>

            <div className="pt-4 border-t border-orange-200">
              <p className="text-sm text-orange-700 mb-2">Valeur unique</p>
              <p className="text-sm text-orange-600">{narrative.strengthNarrative.uniqueValue}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transition Analysis Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200 shadow-sm">
        <CardHeader className="border-b border-indigo-200">
          <CardTitle className="text-indigo-900 flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Transitions de Carrière
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {narrative.transitionAnalysis.map((transition, index) => (
              <div key={index} className="p-3 bg-white rounded border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800">{transition.transition}</span>
                  <Badge className={`${getConfidenceBgColor(transition.confidence)} ${getConfidenceColor(transition.confidence)}`}>
                    {transition.confidence}%
                  </Badge>
                </div>
                <p className="text-xs text-indigo-600 mb-2">Raison: {transition.reason}</p>
                <p className="text-xs text-indigo-600 mb-2">Appris: {transition.learned}</p>
                <p className="text-xs text-indigo-600 mb-2">Cadre positif: {transition.positiveFraming}</p>
                {transition.skillsTransferred.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-indigo-700 mb-1">Compétences transférées:</p>
                    <div className="flex flex-wrap gap-1">
                      {transition.skillsTransferred.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consistency Analysis Card */}
      <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200 shadow-sm">
        <CardHeader className="border-b border-red-200">
          <CardTitle className="text-red-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analyse de Cohérence
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-900">Cohérence globale</span>
              <Badge className={`${getConfidenceBgColor(narrative.consistencyAnalysis.confidence)} ${getConfidenceColor(narrative.consistencyAnalysis.confidence)}`}>
                {narrative.consistencyAnalysis.confidence}%
              </Badge>
            </div>

            <p className="text-sm text-red-700">{narrative.consistencyAnalysis.overallCoherence}</p>

            {narrative.consistencyAnalysis.coherenceBreaks.length > 0 && (
              <div className="pt-4 border-t border-red-200">
                <p className="text-sm text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Ruptures de cohérence
                </p>
                <div className="space-y-2">
                  {narrative.consistencyAnalysis.coherenceBreaks.map((breakItem, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-red-200">
                      <p className="text-xs font-medium text-red-800">{breakItem.break}</p>
                      <p className="text-xs text-red-600 mt-1">Impact: {breakItem.impact}</p>
                      <p className="text-xs text-red-500 MT-1">Suggestion: {breakItem.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {narrative.consistencyAnalysis.gaps.length > 0 && (
              <div className="pt-4 border-t border-red-200">
                <p className="text-sm text-red-700 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Éléments manquants
                </p>
                <div className="space-y-2">
                  {narrative.consistencyAnalysis.gaps.map((gap, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-red-200">
                      <p className="text-xs font-medium text-red-800">{gap.gap}</p>
                      <p className="text-xs text-red-600 mt-1">Besoin: {gap.needs}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overall Confidence Card */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Score de Confiance Global
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{narrative.confidence.overall}%</span>
              <Badge className={`${getConfidenceBgColor(narrative.confidence.overall)} ${getConfidenceColor(narrative.confidence.overall)} text-lg px-3 py-1`}>
                {narrative.confidence.overall >= 80 ? "Élevé" : narrative.confidence.overall >= 60 ? "Modéré" : "Faible"}
              </Badge>
            </div>

            <Progress value={narrative.confidence.overall} className="h-3" />

            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-700 mb-3">Confiance par élément</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Histoire de carrière</span>
                  <span className={`text-xs font-medium ${getConfidenceColor(narrative.confidence.byElement.careerStory)}`}>
                    {narrative.confidence.byElement.careerStory}%
                  </span>
                </div>
                <Progress value={narrative.confidence.byElement.careerStory} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Thèmes professionnels</span>
                  <span className={`text-xs font-medium ${getConfidenceColor(narrative.confidence.byElement.careerThemes)}`}>
                    {narrative.confidence.byElement.careerThemes}%
                  </span>
                </div>
                <Progress value={narrative.confidence.byElement.careerThemes} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Évolution narrative</span>
                  <span className={`text-xs font-medium ${getConfidenceColor(narrative.confidence.byElement.evolutionNarrative)}`}>
                    {narrative.confidence.byElement.evolutionNarrative}%
                  </span>
                </div>
                <Progress value={narrative.confidence.byElement.evolutionNarrative} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Analyse des transitions</span>
                  <span className={`text-xs font-medium ${getConfidenceColor(narrative.confidence.byElement.transitionAnalysis)}`}>
                    {narrative.confidence.byElement.transitionAnalysis}%
                  </span>
                </div>
                <Progress value={narrative.confidence.byElement.transitionAnalysis} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Narrative des forces</span>
                  <span className={`text-xs font-medium ${getConfidenceColor(narrative.confidence.byElement.strengthNarrative)}`}>
                    {narrative.confidence.byElement.strengthNarrative}%
                  </span>
                </div>
                <Progress value={narrative.confidence.byElement.strengthNarrative} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Narrative des motivations</span>
                  <span className={`text-xs font-medium ${getConfidenceColor(narrative.confidence.byElement.motivationNarrative)}`}>
                    {narrative.confidence.byElement.motivationNarrative}%
                  </span>
                </div>
                <Progress value={narrative.confidence.byElement.motivationNarrative} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Identité de carrière</span>
                  <span className={`text-xs font-medium ${getConfidenceColor(narrative.confidence.byElement.careerIdentity)}`}>
                    {narrative.confidence.byElement.careerIdentity}%
                  </span>
                </div>
                <Progress value={narrative.confidence.byElement.careerIdentity} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Analyse de cohérence</span>
                  <span className={`text-xs font-medium ${getConfidenceColor(narrative.confidence.byElement.consistencyAnalysis)}`}>
                    {narrative.confidence.byElement.consistencyAnalysis}%
                  </span>
                </div>
                <Progress value={narrative.confidence.byElement.consistencyAnalysis} className="h-2" />
              </div>
            </div>

            {narrative.confidence.informationGaps.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Lacunes d'information
                </p>
                <div className="space-y-1">
                  {narrative.confidence.informationGaps.map((gap, index) => (
                    <p key={index} className="text-xs text-slate-600">• {gap}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Narrative Fingerprint Card */}
      {narrative.narrativeFingerprint && (
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Fingerprint className="w-5 h-5" />
              Empreinte Narrative
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Hash</span>
                <span className="text-xs font-mono text-gray-900">{narrative.narrativeFingerprint.hash}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Stabilité</span>
                <Badge className={narrative.narrativeFingerprint.stability === "stable" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                  {narrative.narrativeFingerprint.stability === "stable" ? "Stable" : "Changé"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Dernière modification</span>
                <span className="text-xs text-gray-600">{new Date(narrative.narrativeFingerprint.lastModified).toLocaleDateString()}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">Sources de données:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {narrative.narrativeFingerprint.dataSources.map((source, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consistency Score Card */}
      {narrative.consistencyScore && (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
          <CardHeader className="border-b border-blue-200">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Score de Cohérence (0-100)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-900">{narrative.consistencyScore.overall}</span>
                <Badge className={`${narrative.consistencyScore.overall >= 80 ? "bg-green-100 text-green-800" : narrative.consistencyScore.overall >= 60 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"} text-lg px-3 py-1`}>
                  {narrative.consistencyScore.overall >= 80 ? "Excellent" : narrative.consistencyScore.overall >= 60 ? "Bon" : "À améliorer"}
                </Badge>
              </div>
              <Progress value={narrative.consistencyScore.overall} className="h-3" />
              <p className="text-sm text-blue-700">{narrative.consistencyScore.explanation}</p>
              <div className="pt-3 border-t border-blue-200 grid grid-cols-2 gap-2">
                <div className="p-2 bg-white rounded border border-blue-200">
                  <p className="text-xs text-blue-600">Contradictions</p>
                  <p className="text-lg font-bold text-blue-900">{narrative.consistencyScore.contradictionsDetected}</p>
                </div>
                <div className="p-2 bg-white rounded border border-blue-200">
                  <p className="text-xs text-blue-600">Transitions non expliquées</p>
                  <p className="text-lg font-bold text-blue-900">{narrative.consistencyScore.transitionsUnexplained}</p>
                </div>
                <div className="p-2 bg-white rounded border border-blue-200">
                  <p className="text-xs text-blue-600">Périodes non documentées</p>
                  <p className="text-lg font-bold text-blue-900">{narrative.consistencyScore.periodsUndocumented}</p>
                </div>
                <div className="p-2 bg-white rounded border border-blue-200">
                  <p className="text-xs text-blue-600">Narration incomplète</p>
                  <p className="text-lg font-bold text-blue-900">{narrative.consistencyScore.narrationIncomplete}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Narrative Evolution Card */}
      {narrative.narrativeEvolution && (
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Évolution Narrative
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {narrative.narrativeEvolution.identityEvolution && (
                <div className="p-3 bg-white rounded border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Identité professionnelle</p>
                  <p className="text-xs text-amber-700 mb-1">Avant: {narrative.narrativeEvolution.identityEvolution.previousIdentity}</p>
                  <p className="text-xs text-amber-700 mb-1">Après: {narrative.narrativeEvolution.identityEvolution.currentIdentity}</p>
                  <p className="text-xs text-amber-600 mt-2">{narrative.narrativeEvolution.identityEvolution.changeExplanation}</p>
                </div>
              )}
              {narrative.narrativeEvolution.strengthsEvolution && (
                <div className="p-3 bg-white rounded border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Forces</p>
                  <p className="text-xs text-amber-600">{narrative.narrativeEvolution.strengthsEvolution.evolutionExplanation}</p>
                </div>
              )}
              {narrative.narrativeEvolution.motivationsEvolution && (
                <div className="p-3 bg-white rounded border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Motivations</p>
                  <p className="text-xs text-amber-600">{narrative.narrativeEvolution.motivationsEvolution.evolutionExplanation}</p>
                </div>
              )}
              {narrative.narrativeEvolution.coherenceEvolution && (
                <div className="p-3 bg-white rounded border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Cohérence</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-700">{narrative.narrativeEvolution.coherenceEvolution.previousCoherence}% → {narrative.narrativeEvolution.coherenceEvolution.currentCoherence}%</span>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">{narrative.narrativeEvolution.coherenceEvolution.evolutionExplanation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Narrative Evidence Card */}
      {narrative.narrativeEvidence && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Preuves Narratives
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {narrative.narrativeEvidence.careerIdentityEvidence && (
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Preuves d'identité</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-xs text-purple-600">Expériences</p>
                      <p className="text-lg font-bold text-purple-900">{narrative.narrativeEvidence.careerIdentityEvidence.experiences.length}</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-xs text-purple-600">Compétences</p>
                      <p className="text-lg font-bold text-purple-900">{narrative.narrativeEvidence.careerIdentityEvidence.skills.length}</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-xs text-purple-600">Réalisations</p>
                      <p className="text-lg font-bold text-purple-900">{narrative.narrativeEvidence.careerIdentityEvidence.achievements.length}</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-xs text-purple-600">Recommandations</p>
                      <p className="text-lg font-bold text-purple-900">{narrative.narrativeEvidence.careerIdentityEvidence.recommendations.length}</p>
                    </div>
                  </div>
                </div>
              )}
              {narrative.narrativeEvidence.careerStoryEvidence && (
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Preuves d'histoire</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-xs text-purple-600">Expériences</p>
                      <p className="text-lg font-bold text-purple-900">{narrative.narrativeEvidence.careerStoryEvidence.experiences.length}</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-xs text-purple-600">Transitions</p>
                      <p className="text-lg font-bold text-purple-900">{narrative.narrativeEvidence.careerStoryEvidence.transitions.length}</p>
                    </div>
                  </div>
                </div>
              )}
              {narrative.narrativeEvidence.strengthsEvidence && (
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Preuves de forces</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-xs text-purple-600">Expériences</p>
                      <p className="text-lg font-bold text-purple-900">{narrative.narrativeEvidence.strengthsEvidence.experiences.length}</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-xs text-purple-600">Compétences</p>
                      <p className="text-lg font-bold text-purple-900">{narrative.narrativeEvidence.strengthsEvidence.skills.length}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

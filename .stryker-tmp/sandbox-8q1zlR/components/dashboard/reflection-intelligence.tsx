// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/components/design-system";
import { Brain, CheckCircle, AlertTriangle, Eye, GitBranch, Scale, Search, Lightbulb, TrendingUp, Info, ArrowRight, AlertOctagon, Radar, FileCheck } from "lucide-react";

interface ReflectionIntelligenceProps {
  reflection: {
    recommendationReview: {
      recommendations: Array<{
        recommendation: string;
        quality: number;
        coherence: number;
        justification: string;
        confidence: number;
        improvementSuggestion: string;
      }>;
      overallQuality: number;
    };
    alternativeAnalysis: {
      alternatives: Array<{
        alternative: string;
        advantages: string[];
        disadvantages: string[];
        risks: string[];
        confidence: number;
      }>;
      preferredChoice: string;
      rationale: string;
    };
    assumptionDetection: {
      assumptions: Array<{
        assumption: string;
        category: "market" | "skill" | "goal" | "motivation" | "constraint";
        validity: "high" | "medium" | "low";
        needsValidation: boolean;
        reason: string;
      }>;
      criticalAssumptions: string[];
    };
    blindSpotDetection: {
      blindSpots: Array<{
        blindSpot: string;
        category: "skill" | "opportunity" | "experience" | "evidence" | "risk";
        impact: "high" | "medium" | "low";
        suggestion: string;
      }>;
      priorityBlindSpots: string[];
    };
    contradictionDetection: {
      contradictions: Array<{
        contradiction: string;
        sourceA: string;
        sourceB: string;
        severity: "high" | "medium" | "low";
        resolution: string;
      }>;
      unresolvedContradictions: string[];
    };
    evidenceReview: {
      conclusions: Array<{
        conclusion: string;
        evidenceStrength: "strong" | "moderate" | "weak";
        missingEvidence: string[];
        contradictoryEvidence: string[];
        needsStrengthening: boolean;
      }>;
      overallEvidenceQuality: number;
    };
    confidenceCalibration: {
      calibrations: Array<{
        recommendation: string;
        originalConfidence: number;
        calibratedConfidence: number;
        reason: string;
      }>;
      overallConfidence: number;
    };
    reflectionSummary: {
      confirmed: string[];
      improved: string[];
      uncertain: string[];
      needsMoreInfo: string[];
      overallReflectionQuality: number;
      reflectionTimestamp: string;
    };
    explainability: {
      enginesConsulted: string[];
      evidenceUsed: string[];
      assumptionsRetained: string[];
      assumptionsRejected: string[];
      contradictionsDetected: string[];
      alternativesAnalyzed: string[];
      reasonsForDecision: string[];
      finalConfidence: number;
    };
  };
}

export function ReflectionIntelligence({ reflection }: ReflectionIntelligenceProps) {
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100";
    if (confidence >= 60) return "bg-amber-100";
    return "bg-red-100";
  };

  const getValidityColor = (validity: string) => {
    if (validity === "high") return "bg-green-100 text-green-800";
    if (validity === "medium") return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "high") return "bg-red-100 text-red-800";
    if (severity === "medium") return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-800";
  };

  const getEvidenceStrengthColor = (strength: string) => {
    if (strength === "strong") return "bg-green-100 text-green-800";
    if (strength === "moderate") return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  const getImpactColor = (impact: string) => {
    if (impact === "high") return "bg-red-100 text-red-800";
    if (impact === "medium") return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Reflection Summary Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
        <CardHeader className="border-b border-indigo-200">
          <CardTitle className="text-indigo-900 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Synthèse de Réflexion
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-indigo-900">{reflection.reflectionSummary.overallReflectionQuality}%</span>
              <Badge className={`${getConfidenceBgColor(reflection.reflectionSummary.overallReflectionQuality)} ${getConfidenceColor(reflection.reflectionSummary.overallReflectionQuality)} text-lg px-3 py-1`}>
                {reflection.reflectionSummary.overallReflectionQuality >= 80 ? "Excellent" : reflection.reflectionSummary.overallReflectionQuality >= 60 ? "Bon" : "À améliorer"}
              </Badge>
            </div>
            <Progress value={reflection.reflectionSummary.overallReflectionQuality} className="h-3" />
            <p className="text-xs text-indigo-600">Dernière réflexion: {new Date(reflection.reflectionSummary.reflectionTimestamp).toLocaleString()}</p>

            {reflection.reflectionSummary.confirmed.length > 0 && (
              <div className="pt-4 border-t border-indigo-200">
                <p className="text-sm text-indigo-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Confirmé
                </p>
                <div className="space-y-1">
                  {reflection.reflectionSummary.confirmed.map((item, index) => (
                    <p key={index} className="text-xs text-indigo-600">• {item}</p>
                  ))}
                </div>
              </div>
            )}

            {reflection.reflectionSummary.improved.length > 0 && (
              <div className="pt-4 border-t border-indigo-200">
                <p className="text-sm text-indigo-700 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Amélioré
                </p>
                <div className="space-y-1">
                  {reflection.reflectionSummary.improved.map((item, index) => (
                    <p key={index} className="text-xs text-indigo-600">• {item}</p>
                  ))}
                </div>
              </div>
            )}

            {reflection.reflectionSummary.uncertain.length > 0 && (
              <div className="pt-4 border-t border-indigo-200">
                <p className="text-sm text-indigo-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Incertain
                </p>
                <div className="space-y-1">
                  {reflection.reflectionSummary.uncertain.map((item, index) => (
                    <p key={index} className="text-xs text-indigo-600">• {item}</p>
                  ))}
                </div>
              </div>
            )}

            {reflection.reflectionSummary.needsMoreInfo.length > 0 && (
              <div className="pt-4 border-t border-indigo-200">
                <p className="text-sm text-indigo-700 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Nécessite plus d'informations
                </p>
                <div className="space-y-1">
                  {reflection.reflectionSummary.needsMoreInfo.map((item, index) => (
                    <p key={index} className="text-xs text-indigo-600">• {item}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Review Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
        <CardHeader className="border-b border-blue-200">
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Revue des Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Qualité globale</span>
              <Badge className={`${getConfidenceBgColor(reflection.recommendationReview.overallQuality)} ${getConfidenceColor(reflection.recommendationReview.overallQuality)}`}>
                {reflection.recommendationReview.overallQuality}%
              </Badge>
            </div>
            <Progress value={reflection.recommendationReview.overallQuality} className="h-3" />

            <div className="space-y-3">
              {reflection.recommendationReview.recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">{rec.recommendation}</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-600">Qualité:</span>
                      <span className={`text-xs font-medium ${getConfidenceColor(rec.quality)}`}>{rec.quality}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-600">Cohérence:</span>
                      <span className={`text-xs font-medium ${getConfidenceColor(rec.coherence)}`}>{rec.coherence}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 mb-2">{rec.justification}</p>
                  {rec.improvementSuggestion && (
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Suggestion: {rec.improvementSuggestion}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Analysis Card */}
      {reflection.alternativeAnalysis.alternatives.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
          <CardHeader className="border-b border-green-200">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Analyse des Alternatives
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-3 bg-white rounded border border-green-200">
                <p className="text-sm font-medium text-green-900 mb-2">Choix préféré</p>
                <p className="text-sm text-green-800">{reflection.alternativeAnalysis.preferredChoice}</p>
                <p className="text-xs text-green-600 mt-2">{reflection.alternativeAnalysis.rationale}</p>
              </div>

              <div className="space-y-3">
                {reflection.alternativeAnalysis.alternatives.map((alt, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-green-900">{alt.alternative}</p>
                      <Badge className={`${getConfidenceBgColor(alt.confidence)} ${getConfidenceColor(alt.confidence)}`}>
                        {alt.confidence}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-green-700 mb-1">Avantages:</p>
                        <div className="flex flex-wrap gap-1">
                          {alt.advantages.map((adv, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{adv}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-green-700 mb-1">Inconvénients:</p>
                        <div className="flex flex-wrap gap-1">
                          {alt.disadvantages.map((dis, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{dis}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-green-700 mb-1">Risques:</p>
                        <div className="flex flex-wrap gap-1">
                          {alt.risks.map((risk, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{risk}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assumption Detection Card */}
      {reflection.assumptionDetection.assumptions.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Détection des Hypothèses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {reflection.assumptionDetection.criticalAssumptions.length > 0 && (
                <div className="p-3 bg-white rounded border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Hypothèses critiques</p>
                  <div className="space-y-1">
                    {reflection.assumptionDetection.criticalAssumptions.map((assumption, index) => (
                      <p key={index} className="text-xs text-amber-700">• {assumption}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {reflection.assumptionDetection.assumptions.map((assumption, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-amber-900">{assumption.assumption}</p>
                      <Badge className={getValidityColor(assumption.validity)}>
                        {assumption.validity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{assumption.category}</Badge>
                      {assumption.needsValidation && (
                        <Badge className="bg-orange-100 text-orange-800 text-xs">À valider</Badge>
                      )}
                    </div>
                    <p className="text-xs text-amber-600">{assumption.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blind Spot Detection Card */}
      {reflection.blindSpotDetection.blindSpots.length > 0 && (
        <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200 shadow-sm">
          <CardHeader className="border-b border-red-200">
            <CardTitle className="text-red-900 flex items-center gap-2">
              <Radar className="w-5 h-5" />
              Détection des Angles Morts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {reflection.blindSpotDetection.priorityBlindSpots.length > 0 && (
                <div className="p-3 bg-white rounded border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Angles morts prioritaires</p>
                  <div className="space-y-1">
                    {reflection.blindSpotDetection.priorityBlindSpots.map((blindSpot, index) => (
                      <p key={index} className="text-xs text-red-700">• {blindSpot}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {reflection.blindSpotDetection.blindSpots.map((blindSpot, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-red-900">{blindSpot.blindSpot}</p>
                      <Badge className={getImpactColor(blindSpot.impact)}>
                        {blindSpot.impact}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{blindSpot.category}</Badge>
                    </div>
                    <p className="text-xs text-red-600">{blindSpot.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contradiction Detection Card */}
      {reflection.contradictionDetection.contradictions.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5" />
              Détection des Contradictions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {reflection.contradictionDetection.unresolvedContradictions.length > 0 && (
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2">Contradictions non résolues</p>
                  <div className="space-y-1">
                    {reflection.contradictionDetection.unresolvedContradictions.map((contradiction, index) => (
                      <p key={index} className="text-xs text-purple-700">• {contradiction}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {reflection.contradictionDetection.contradictions.map((contradiction, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-purple-900">{contradiction.contradiction}</p>
                      <Badge className={getSeverityColor(contradiction.severity)}>
                        {contradiction.severity}
                      </Badge>
                    </div>
                    <div className="space-y-1 mb-2">
                      <p className="text-xs text-purple-600">Source A: {contradiction.sourceA}</p>
                      <p className="text-xs text-purple-600">Source B: {contradiction.sourceB}</p>
                    </div>
                    <p className="text-xs text-purple-700">Résolution: {contradiction.resolution}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evidence Review Card */}
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
        <CardHeader className="border-b border-teal-200">
          <CardTitle className="text-teal-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Revue des Preuves
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-teal-900">Qualité globale des preuves</span>
              <Badge className={`${getConfidenceBgColor(reflection.evidenceReview.overallEvidenceQuality)} ${getConfidenceColor(reflection.evidenceReview.overallEvidenceQuality)}`}>
                {reflection.evidenceReview.overallEvidenceQuality}%
              </Badge>
            </div>
            <Progress value={reflection.evidenceReview.overallEvidenceQuality} className="h-3" />

            <div className="space-y-3">
              {reflection.evidenceReview.conclusions.map((conclusion, index) => (
                <div key={index} className="p-3 bg-white rounded border border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-teal-900">{conclusion.conclusion}</p>
                    <Badge className={getEvidenceStrengthColor(conclusion.evidenceStrength)}>
                      {conclusion.evidenceStrength}
                    </Badge>
                  </div>
                  {conclusion.needsStrengthening && (
                    <Badge className="bg-orange-100 text-orange-800 text-xs mb-2">À renforcer</Badge>
                  )}
                  {conclusion.missingEvidence.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-teal-700 mb-1">Preuves manquantes:</p>
                      <div className="flex flex-wrap gap-1">
                        {conclusion.missingEvidence.map((evidence, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{evidence}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {conclusion.contradictoryEvidence.length > 0 && (
                    <div>
                      <p className="text-xs text-teal-700 mb-1">Preuves contradictoires:</p>
                      <div className="flex flex-wrap gap-1">
                        {conclusion.contradictoryEvidence.map((evidence, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{evidence}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Calibration Card */}
      {reflection.confidenceCalibration.calibrations.length > 0 && (
        <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Recalibrage de Confiance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">Confiance globale</span>
                <Badge className={`${getConfidenceBgColor(reflection.confidenceCalibration.overallConfidence)} ${getConfidenceColor(reflection.confidenceCalibration.overallConfidence)}`}>
                  {reflection.confidenceCalibration.overallConfidence}%
                </Badge>
              </div>
              <Progress value={reflection.confidenceCalibration.overallConfidence} className="h-3" />

              <div className="space-y-3">
                {reflection.confidenceCalibration.calibrations.map((calibration, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-slate-200">
                    <p className="text-sm font-medium text-slate-900 mb-2">{calibration.recommendation}</p>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">Original:</span>
                        <span className={`text-xs font-medium ${getConfidenceColor(calibration.originalConfidence)}`}>{calibration.originalConfidence}%</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">Recalibré:</span>
                        <span className={`text-xs font-medium ${getConfidenceColor(calibration.calibratedConfidence)}`}>{calibration.calibratedConfidence}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{calibration.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explainability Card */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Explicabilité
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Confiance finale</span>
              <Badge className={`${getConfidenceBgColor(reflection.explainability.finalConfidence)} ${getConfidenceColor(reflection.explainability.finalConfidence)}`}>
                {reflection.explainability.finalConfidence}%
              </Badge>
            </div>
            <Progress value={reflection.explainability.finalConfidence} className="h-3" />

            <div className="space-y-3">
              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Moteurs consultés</p>
                <div className="flex flex-wrap gap-1">
                  {reflection.explainability.enginesConsulted.map((engine, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{engine}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Preuves utilisées</p>
                <div className="flex flex-wrap gap-1">
                  {reflection.explainability.evidenceUsed.map((evidence, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{evidence}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Hypothèses retenues</p>
                <div className="flex flex-wrap gap-1">
                  {reflection.explainability.assumptionsRetained.map((assumption, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{assumption}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Hypothèses rejetées</p>
                <div className="flex flex-wrap gap-1">
                  {reflection.explainability.assumptionsRejected.map((assumption, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{assumption}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Contradictions détectées</p>
                <div className="flex flex-wrap gap-1">
                  {reflection.explainability.contradictionsDetected.map((contradiction, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{contradiction}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Alternatives analysées</p>
                <div className="flex flex-wrap gap-1">
                  {reflection.explainability.alternativesAnalyzed.map((alternative, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{alternative}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Raisons de la décision</p>
                <div className="space-y-1">
                  {reflection.explainability.reasonsForDecision.map((reason, index) => (
                    <p key={index} className="text-xs text-gray-600">• {reason}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

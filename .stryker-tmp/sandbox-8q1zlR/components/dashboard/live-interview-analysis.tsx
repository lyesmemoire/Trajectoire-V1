// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, AlertTriangle, CheckCircle, Star, Target, BarChart3, Activity, Brain } from "lucide-react";

interface LiveAnalysisData {
  overallQuality: {
    score: number;
    level: string;
  };
  technicalQuality: {
    score: number;
    level: string;
  };
  behavioralQuality: {
    score: number;
    level: string;
  };
  communicationQuality: {
    score: number;
    level: string;
  };
  starCompliance: {
    score: number;
    level: string;
  };
  answerCompleteness: {
    score: number;
    level: string;
  };
  evidenceScore: {
    score: number;
    level: string;
  };
  credibilityScore: {
    score: number;
    level: string;
  };
  recruiterConfidence: {
    score: number;
    level: string;
  };
  missingElements: string[];
  strongElements: string[];
  risksDetected: string[];
  opportunitiesDetected: string[];
  followUpSuggestions: string[];
}

interface LiveInterviewAnalysisProps {
  analysisData: LiveAnalysisData | null;
}

export function LiveInterviewAnalysis({ analysisData }: LiveInterviewAnalysisProps) {
  if (!analysisData) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Analyse en Temps Réel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 text-sm py-8">
            Aucune analyse en temps réel disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  const { overallQuality, technicalQuality, behavioralQuality, communicationQuality, starCompliance, answerCompleteness, evidenceScore, credibilityScore, recruiterConfidence, missingElements, strongElements, risksDetected, opportunitiesDetected, followUpSuggestions } = analysisData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-200";
    if (score >= 60) return "bg-blue-100 border-blue-200";
    if (score >= 40) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Excellent":
        return "bg-green-100 text-green-700 border-green-200";
      case "Good":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Average":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Below Average":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Poor":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Analyse en Temps Réel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quality Scores */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`border rounded-lg p-4 ${getScoreBgColor(overallQuality.score)}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Qualité Globale</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(overallQuality.score)}`}>{overallQuality.score}</div>
              <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getLevelColor(overallQuality.level)}`}>
                {overallQuality.level}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={`border rounded-lg p-4 ${getScoreBgColor(technicalQuality.score)}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4" />
                <span className="text-xs font-medium">Qualité Technique</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(technicalQuality.score)}`}>{technicalQuality.score}</div>
              <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getLevelColor(technicalQuality.level)}`}>
                {technicalQuality.level}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`border rounded-lg p-4 ${getScoreBgColor(recruiterConfidence.score)}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-xs font-medium">Confiance Recruteur</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(recruiterConfidence.score)}`}>{recruiterConfidence.score}</div>
              <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getLevelColor(recruiterConfidence.level)}`}>
                {recruiterConfidence.level}
              </div>
            </motion.div>
          </div>

          {/* Detailed Scores */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Scores Détaillés</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Comportemental</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${behavioralQuality.score}%` }} />
                  </div>
                  <span className={`font-medium ${getScoreColor(behavioralQuality.score)}`}>{behavioralQuality.score}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Communication</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${communicationQuality.score}%` }} />
                  </div>
                  <span className={`font-medium ${getScoreColor(communicationQuality.score)}`}>{communicationQuality.score}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">STAR</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${starCompliance.score}%` }} />
                  </div>
                  <span className={`font-medium ${getScoreColor(starCompliance.score)}`}>{starCompliance.score}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Complétude</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${answerCompleteness.score}%` }} />
                  </div>
                  <span className={`font-medium ${getScoreColor(answerCompleteness.score)}`}>{answerCompleteness.score}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Preuves</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-600 h-2 rounded-full" style={{ width: `${evidenceScore.score}%` }} />
                  </div>
                  <span className={`font-medium ${getScoreColor(evidenceScore.score)}`}>{evidenceScore.score}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Crédibilité</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${credibilityScore.score}%` }} />
                  </div>
                  <span className={`font-medium ${getScoreColor(credibilityScore.score)}`}>{credibilityScore.score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strong Elements */}
          {strongElements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Points Forts</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{strongElements.length}</span>
              </div>
              <div className="space-y-2">
                {strongElements.map((element, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-3"
                  >
                    <span className="text-sm font-medium text-green-900">{element}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Elements */}
          {missingElements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-900">Éléments Manquants</span>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">{missingElements.length}</span>
              </div>
              <div className="space-y-2">
                {missingElements.map((element, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                  >
                    <span className="text-sm font-medium text-yellow-900">{element}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Risks */}
          {risksDetected.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Risques Détectés</span>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{risksDetected.length}</span>
              </div>
              <div className="space-y-2">
                {risksDetected.map((risk, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <span className="text-sm font-medium text-red-900">{risk}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities */}
          {opportunitiesDetected.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Opportunités</span>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">{opportunitiesDetected.length}</span>
              </div>
              <div className="space-y-2">
                {opportunitiesDetected.map((opportunity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-purple-50 border border-purple-200 rounded-lg p-3"
                  >
                    <span className="text-sm font-medium text-purple-900">{opportunity}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Suggestions */}
          {followUpSuggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Suggestions de Relance</span>
              </div>
              <div className="space-y-2">
                {followUpSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                  >
                    <span className="text-sm font-medium text-blue-900">{suggestion}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

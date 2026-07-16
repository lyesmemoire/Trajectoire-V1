// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { FileText, AlertTriangle, CheckCircle, Target, Award, Clock, User, BarChart3, Download } from "lucide-react";

interface FinalReportData {
  executiveSummary: {
    overview: string;
    highlights: string[];
    overallAssessment: string;
  };
  recruiterDecision: {
    decision: string;
    justification: string;
    keyFactors: string[];
  };
  globalScore: {
    overall: number;
    technical: number;
    behavioral: number;
    communication: number;
    leadership: number;
    business: number;
    confidence: number;
    star: number;
    evidence: number;
  };
  demonstratedStrengths: Array<{ name: string; evidence: string }>;
  observedWeaknesses: Array<{ name: string; evidence: string }>;
  demonstratedSkills: Array<{ skill: string; evidence: string }>;
  insufficientlyDemonstratedSkills: Array<{ skill: string; evidence: string }>;
  criticalGaps: Array<{ gap: string; impact: string }>;
  compensatingTransferableSkills: Array<{ name: string; evidence: string }>;
  successfulQuestions: Array<{ name: string; evidence: string }>;
  difficultQuestions: Array<{ name: string; evidence: string }>;
  detectedContradictions: Array<{ name: string; evidence: string }>;
  missedOpportunities: Array<{ name: string; evidence: string }>;
  remarkableMoments: Array<{ name: string; evidence: string }>;
  personalizedAdvice: Array<{ name: string; evidence: string }>;
  recruiterTakeaways: Array<{ name: string; evidence: string }>;
  improvementPlan: {
    shortTerm: Array<{ improvement: string; priority: string }>;
    mediumTerm: Array<{ improvement: string; priority: string }>;
    longTerm: Array<{ improvement: string; priority: string }>;
  };
  finalSynthesis: {
    conclusion: string;
    keyTakeaways: string[];
    nextSteps: string[];
  };
}

interface FinalInterviewReportProps {
  reportData: FinalReportData | null;
}

export function FinalInterviewReport({ reportData }: FinalInterviewReportProps) {
  if (!reportData) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Rapport Final d'Entretien</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 text-sm py-8">
            Aucun rapport final disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  const { executiveSummary, recruiterDecision, globalScore, demonstratedStrengths, observedWeaknesses, demonstratedSkills, insufficientlyDemonstratedSkills, criticalGaps, compensatingTransferableSkills, successfulQuestions, difficultQuestions, detectedContradictions, missedOpportunities, remarkableMoments, personalizedAdvice, recruiterTakeaways, improvementPlan, finalSynthesis } = reportData;

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "Strong Hire":
        return "bg-green-100 text-green-700 border-green-200";
      case "Hire":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Lean Hire":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Neutral":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Lean Reject":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Reject":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900">Rapport Final d'Entretien</CardTitle>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Exporter PDF</span>
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Executive Summary */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Résumé Exécutif</h3>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-900 mb-3">{executiveSummary.overview}</p>
              <div className="space-y-2">
                {executiveSummary.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-900 mt-3 font-medium">{executiveSummary.overallAssessment}</p>
            </div>
          </div>

          {/* Recruiter Decision */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Décision du Recruteur</h3>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`px-4 py-2 rounded-lg text-lg font-bold ${getDecisionColor(recruiterDecision.decision)}`}>
                  {recruiterDecision.decision}
                </div>
              </div>
              <p className="text-sm text-gray-900 mb-3">{recruiterDecision.justification}</p>
              <div className="space-y-2">
                {recruiterDecision.keyFactors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Global Score */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Score Global</h3>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(globalScore.overall)}`}>{globalScore.overall}</div>
                  <div className="text-xs text-gray-600 mt-1">Global</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(globalScore.technical)}`}>{globalScore.technical}</div>
                  <div className="text-xs text-gray-600 mt-1">Technique</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(globalScore.behavioral)}`}>{globalScore.behavioral}</div>
                  <div className="text-xs text-gray-600 mt-1">Comportemental</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(globalScore.communication)}`}>{globalScore.communication}</div>
                  <div className="text-xs text-gray-600 mt-1">Communication</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(globalScore.leadership)}`}>{globalScore.leadership}</div>
                  <div className="text-xs text-gray-600 mt-1">Leadership</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(globalScore.business)}`}>{globalScore.business}</div>
                  <div className="text-xs text-gray-600 mt-1">Business</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(globalScore.confidence)}`}>{globalScore.confidence}</div>
                  <div className="text-xs text-gray-600 mt-1">Confiance</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(globalScore.star)}`}>{globalScore.star}</div>
                  <div className="text-xs text-gray-600 mt-1">STAR</div>
                </div>
              </div>
            </div>
          </div>

          {/* Demonstrated Strengths */}
          {demonstratedStrengths.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Forces Démontrées</h3>
              </div>
              <div className="space-y-2">
                {demonstratedStrengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-3"
                  >
                    <div className="text-sm font-medium text-green-900">{strength.name}</div>
                    <div className="text-xs text-green-700 mt-1">{strength.evidence}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Observed Weaknesses */}
          {observedWeaknesses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">Faiblesses Observées</h3>
              </div>
              <div className="space-y-2">
                {observedWeaknesses.map((weakness, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                  >
                    <div className="text-sm font-medium text-yellow-900">{weakness.name}</div>
                    <div className="text-xs text-yellow-700 mt-1">{weakness.evidence}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Critical Gaps */}
          {criticalGaps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Gaps Critiques</h3>
              </div>
              <div className="space-y-2">
                {criticalGaps.map((gap, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <div className="text-sm font-medium text-red-900">{gap.gap}</div>
                    <div className="text-xs text-red-700 mt-1">{gap.impact}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Plan */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Plan d'Amélioration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Court Terme (0-3 mois)</div>
                <div className="space-y-2">
                  {improvementPlan.shortTerm.map((item, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-sm text-gray-900">{item.improvement}</div>
                      <div className="text-xs text-blue-700 mt-1">Priorité: {item.priority}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Moyen Terme (3-6 mois)</div>
                <div className="space-y-2">
                  {improvementPlan.mediumTerm.map((item, index) => (
                    <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="text-sm text-gray-900">{item.improvement}</div>
                      <div className="text-xs text-purple-700 mt-1">Priorité: {item.priority}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Long Terme (6-12 mois)</div>
                <div className="space-y-2">
                  {improvementPlan.longTerm.map((item, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-sm text-gray-900">{item.improvement}</div>
                      <div className="text-xs text-green-700 mt-1">Priorité: {item.priority}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Final Synthesis */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Synthèse Finale</h3>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-sm text-gray-900 mb-3">{finalSynthesis.conclusion}</p>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900">Points Clés:</div>
                {finalSynthesis.keyTakeaways.map((takeaway, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mt-3">
                <div className="text-sm font-medium text-gray-900">Prochaines Étapes:</div>
                {finalSynthesis.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}

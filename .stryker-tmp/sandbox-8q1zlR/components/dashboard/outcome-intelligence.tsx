// @ts-nocheck
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/design-system";
import { Badge } from "@/components/design-system";
import { Progress } from "@/components/design-system";
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle, Lightbulb, CheckCircle, XCircle } from "lucide-react";

interface OutcomeIntelligenceProps {
  outcomeIntelligence: {
    recommendationEffectiveness: Array<{
      recommendationType: string;
      effectiveness: number;
      observedImpact: string;
      timeToResult: string;
      realROI: string;
      successFrequency: number;
      failureFrequency: number;
      evidenceLevel: string;
      confidence: number;
      conditions: string[];
      lastUpdated: string;
    }>;
    candidatePatterns: Array<{
      pattern: string;
      evidence: string;
      confidence: number;
      implications: string;
    }>;
    topPerformingActions: Array<{
      action: string;
      successRate: number;
      avgTimeToResult: string;
      evidenceCount: number;
      confidence: number;
    }>;
    underperformingActions: Array<{
      action: string;
      successRate: number;
      avgTimeToResult: string;
      evidenceCount: number;
      confidence: number;
      recommendation: string;
    }>;
    recentLearnings: Array<{
      learning: string;
      evidence: string;
      confidence: number;
      date: string;
    }>;
    hypothesisStatus: Array<{
      hypothesis: string;
      status: string;
      evidence: string;
      confidence: number;
    }>;
    summary: string;
    confidence: number;
    dataQuality: string;
    nextActions: string[];
  };
}

export function OutcomeIntelligence({ outcomeIntelligence }: OutcomeIntelligenceProps) {
  const {
    recommendationEffectiveness,
    candidatePatterns,
    topPerformingActions,
    underperformingActions,
    recentLearnings,
    hypothesisStatus,
    summary,
    confidence,
    dataQuality,
    nextActions,
  } = outcomeIntelligence;

  const getEvidenceColor = (level: string) => {
    switch (level) {
      case "strong":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "weak":
        return "bg-orange-500";
      case "very_weak":
        return "bg-red-500";
      case "none":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getHypothesisColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "inconclusive":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getHypothesisIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inconclusive":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-serif">Outcome Intelligence</CardTitle>
          <Badge variant="outline" className="text-xs">
            {confidence}% confiance
          </Badge>
        </div>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Quality */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Target className="w-4 h-4" />
          <span>Qualité des données: {dataQuality}</span>
        </div>

        {/* Top Performing Actions */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Actions les plus efficaces
          </h4>
          <div className="space-y-2">
            {topPerformingActions.slice(0, 3).map((action, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{action.action}</span>
                  <Badge className="bg-green-500 text-white text-xs">
                    {Math.round(action.successRate * 100)}% succès
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>⏱️ {action.avgTimeToResult}</span>
                  <span>📊 {action.evidenceCount} preuves</span>
                  <span>🎯 {action.confidence}% confiance</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Underperforming Actions */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            Actions moins efficaces
          </h4>
          <div className="space-y-2">
            {underperformingActions.slice(0, 3).map((action, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{action.action}</span>
                  <Badge className="bg-red-500 text-white text-xs">
                    {Math.round(action.successRate * 100)}% succès
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-1">
                  <span>⏱️ {action.avgTimeToResult}</span>
                  <span>📊 {action.evidenceCount} preuves</span>
                  <span>🎯 {action.confidence}% confiance</span>
                </div>
                <p className="text-xs text-red-600 font-medium">{action.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Patterns */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-500" />
            Patterns observés
          </h4>
          <div className="space-y-2">
            {candidatePatterns.slice(0, 3).map((pattern, index) => (
              <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium mb-1">{pattern.pattern}</p>
                <p className="text-xs text-gray-600 mb-2">{pattern.evidence}</p>
                <p className="text-xs text-purple-600 font-medium">{pattern.implications}</p>
                <div className="mt-2">
                  <Progress value={pattern.confidence} className="h-1" />
                  <span className="text-xs text-gray-500">{pattern.confidence}% confiance</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation Effectiveness */}
        <div>
          <h4 className="text-sm font-medium mb-3">Efficacité par type de recommandation</h4>
          <div className="space-y-2">
            {recommendationEffectiveness.slice(0, 4).map((rec, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{rec.recommendationType}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getEvidenceColor(rec.evidenceLevel)} text-xs`} variant="outline">
                      {rec.evidenceLevel}
                    </Badge>
                    <span className="text-xs text-gray-500">{Math.round(rec.effectiveness * 100)}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600">{rec.observedImpact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Learnings */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            Apprentissages récents
          </h4>
          <div className="space-y-2">
            {recentLearnings.slice(0, 3).map((learning, index) => (
              <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium mb-1">{learning.learning}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>📝 {learning.evidence}</span>
                  <span>🎯 {learning.confidence}% confiance</span>
                  <span>📅 {learning.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hypothesis Status */}
        <div>
          <h4 className="text-sm font-medium mb-3">Statut des hypothèses</h4>
          <div className="space-y-2">
            {hypothesisStatus.slice(0, 3).map((hypothesis, index) => (
              <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                {getHypothesisIcon(hypothesis.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{hypothesis.hypothesis}</p>
                  <p className="text-xs text-gray-600">{hypothesis.evidence}</p>
                </div>
                <Badge variant="outline" className={`text-xs ${getHypothesisColor(hypothesis.status)}`}>
                  {hypothesis.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Next Actions */}
        <div>
          <h4 className="text-sm font-medium mb-3">Actions recommandées</h4>
          <ul className="space-y-1">
            {nextActions.slice(0, 4).map((action, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, TrendingDown, BarChart3, Clock, Target, Shield, AlertCircle } from "lucide-react";

export interface ConfidenceProfileProps {
  globalConfidence: number;
  confidenceLevel: "very_high" | "high" | "moderate" | "low" | "insufficient";
  reliableDomains: {
    domain: string;
    confidence: number;
    reason: string;
  }[];
  uncertainDomains: {
    domain: string;
    confidence: number;
    reason: string;
  }[];
  missingData: {
    type: string;
    description: string;
    impact: string;
  }[];
  solidAnalyses: {
    analysis: string;
    confidence: number;
    evidence: string[];
  }[];
  remainingHypotheses: {
    hypothesis: string;
    confidence: number;
    evidence: string[];
  }[];
  confidenceEvolution: {
    previousConfidence: number;
    currentConfidence: number;
    change: number;
    reason: string;
  };
}

export function ConfidenceProfile({ profile }: { profile: ConfidenceProfileProps }) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-50";
    if (confidence >= 70) return "text-blue-600 bg-blue-50";
    if (confidence >= 50) return "text-amber-600 bg-amber-50";
    if (confidence >= 30) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getConfidenceLevelColor = (level: string) => {
    switch (level) {
      case "very_high":
        return "text-green-600 bg-green-50";
      case "high":
        return "text-blue-600 bg-blue-50";
      case "moderate":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-orange-600 bg-orange-50";
      case "insufficient":
        return "text-red-600 bg-red-50";
    }
  };

  const getConfidenceLevelLabel = (level: string) => {
    switch (level) {
      case "very_high":
        return "Très élevée";
      case "high":
        return "Élevée";
      case "moderate":
        return "Modérée";
      case "low":
        return "Faible";
      case "insufficient":
        return "Insuffisante";
    }
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
      <CardHeader className="border-b border-indigo-200">
        <CardTitle className="text-indigo-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Niveau de confiance de mon profil
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Global Confidence */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-indigo-600">Confiance globale</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-bold ${getConfidenceColor(profile.globalConfidence)}`}>
              {profile.globalConfidence}%
            </span>
          </div>

          {/* Confidence Level */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-indigo-600">Niveau de confiance</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getConfidenceLevelColor(profile.confidenceLevel)}`}>
              {getConfidenceLevelLabel(profile.confidenceLevel)}
            </span>
          </div>

          {/* Confidence Evolution */}
          {profile.confidenceEvolution.change !== 0 && (
            <div className="p-4 bg-white rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <p className="text-sm text-indigo-600">Évolution</p>
                </div>
                <div className="flex items-center gap-2">
                  {profile.confidenceEvolution.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-bold ${profile.confidenceEvolution.change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {profile.confidenceEvolution.change > 0 ? "+" : ""}{profile.confidenceEvolution.change}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600">{profile.confidenceEvolution.reason}</p>
            </div>
          )}

          {/* Reliable Domains */}
          {profile.reliableDomains.length > 0 && (
            <div>
              <p className="text-sm font-medium text-indigo-900 mb-2">Domaines très fiables</p>
              <div className="space-y-2">
                {profile.reliableDomains.map((domain, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-green-900">{domain.domain}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(domain.confidence)}`}>
                        {domain.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-green-800">{domain.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uncertain Domains */}
          {profile.uncertainDomains.length > 0 && (
            <div>
              <p className="text-sm font-medium text-indigo-900 mb-2">Domaines encore incertains</p>
              <div className="space-y-2">
                {profile.uncertainDomains.map((domain, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-orange-900">{domain.domain}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(domain.confidence)}`}>
                        {domain.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-orange-800">{domain.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Data */}
          {profile.missingData.length > 0 && (
            <div>
              <p className="text-sm font-medium text-indigo-900 mb-2">Informations manquantes</p>
              <div className="space-y-2">
                {profile.missingData.map((data, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900 mb-1">{data.type}</p>
                        <p className="text-xs text-red-800 mb-1">{data.description}</p>
                        <p className="text-xs text-red-700">Impact: {data.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solid Analyses */}
          {profile.solidAnalyses.length > 0 && (
            <div>
              <p className="text-sm font-medium text-indigo-900 mb-2">Analyses solides</p>
              <div className="space-y-2">
                {profile.solidAnalyses.slice(0, 3).map((analysis, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-green-900">{analysis.analysis}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(analysis.confidence)}`}>
                        {analysis.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-green-700">
                      Preuves: {analysis.evidence.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remaining Hypotheses */}
          {profile.remainingHypotheses.length > 0 && (
            <div>
              <p className="text-sm font-medium text-indigo-900 mb-2">Hypothèses restantes</p>
              <div className="space-y-2">
                {profile.remainingHypotheses.slice(0, 3).map((hypothesis, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-amber-900">{hypothesis.hypothesis}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(hypothesis.confidence)}`}>
                        {hypothesis.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-amber-700">
                      Preuves: {hypothesis.evidence.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

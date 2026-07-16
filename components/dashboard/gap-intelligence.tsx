"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { AlertTriangle, AlertCircle, CheckCircle, Clock, TrendingUp, XCircle } from "lucide-react";

interface Gap {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  blocking: boolean;
  compensable: boolean;
  transferable: boolean;
  learningPossible: boolean;
  learningTimeEstimate: string;
  businessImpact: string;
  explanation: string;
}

interface GapSummary {
  totalGaps: number;
  criticalGapsCount: number;
  blockingGapsCount: number;
  compensableGapsCount: number;
  totalLearningTimeEstimate: string;
}

interface GapIntelligenceData {
  hardSkillGaps: Gap[];
  softSkillGaps: Gap[];
  technologyGaps: Gap[];
  experienceGaps: Gap[];
  educationGaps: Gap[];
  languageGaps: Gap[];
  businessGaps: Gap[];
  cultureGaps: Gap[];
  mobilityGaps: Gap[];
  criticalGaps: string[];
  blockingGaps: string[];
  transferableGaps: string[];
  learningGaps: string[];
  summary: GapSummary;
}

interface GapIntelligenceProps {
  gapData: GapIntelligenceData | null;
}

export function GapIntelligence({ gapData }: GapIntelligenceProps) {
  if (!gapData) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Analyse des Écarts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 text-sm py-8">
            Aucune donnée d'analyse d'écart disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  const { summary, criticalGaps, blockingGaps, transferableGaps, learningGaps } = gapData;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "high":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case "medium":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Analyse des Écarts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-5 gap-4">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Total Écarts</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{summary.totalGaps}</div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">Critiques</span>
              </div>
              <div className="text-2xl font-bold text-red-900">{summary.criticalGapsCount}</div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-orange-50 border border-orange-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-700">Bloquants</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">{summary.blockingGapsCount}</div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Compensables</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{summary.compensableGapsCount}</div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Temps Apprentissage</span>
              </div>
              <div className="text-xs font-bold text-blue-900">{summary.totalLearningTimeEstimate}</div>
            </m.div>
          </div>

          {/* Critical Gaps */}
          {criticalGaps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Écarts Critiques</span>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{criticalGaps.length}</span>
              </div>
              <div className="space-y-2">
                {gapData.hardSkillGaps.filter(g => g.severity === "critical").map((gap, index) => (
                  <m.div
                    key={gap.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(gap.severity)}
                        <span className="text-sm font-medium text-red-900">{gap.title}</span>
                      </div>
                      {gap.blocking && (
                        <span className="text-xs text-red-600 bg-red-200 px-2 py-0.5 rounded-full">Bloquant</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{gap.description}</p>
                  </m.div>
                ))}
              </div>
            </div>
          )}

          {/* Blocking Gaps */}
          {blockingGaps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">Écarts Bloquants</span>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">{blockingGaps.length}</span>
              </div>
              <div className="space-y-2">
                {gapData.hardSkillGaps.filter(g => g.blocking).map((gap, index) => (
                  <m.div
                    key={gap.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-orange-50 border border-orange-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(gap.severity)}
                        <span className="text-sm font-medium text-orange-900">{gap.title}</span>
                      </div>
                      <span className="text-xs text-orange-600 bg-orange-200 px-2 py-0.5 rounded-full">Bloquant</span>
                    </div>
                    <p className="text-xs text-gray-600">{gap.description}</p>
                  </m.div>
                ))}
              </div>
            </div>
          )}

          {/* Transferable Gaps */}
          {transferableGaps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Écarts Transférables</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{transferableGaps.length}</span>
              </div>
              <div className="space-y-2">
                {gapData.hardSkillGaps.filter(g => g.transferable).map((gap, index) => (
                  <m.div
                    key={gap.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(gap.severity)}
                        <span className="text-sm font-medium text-green-900">{gap.title}</span>
                      </div>
                      <span className="text-xs text-green-600 bg-green-200 px-2 py-0.5 rounded-full">Transférable</span>
                    </div>
                    <p className="text-xs text-gray-600">{gap.description}</p>
                  </m.div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Gaps */}
          {learningGaps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Écarts Apprenables</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{learningGaps.length}</span>
              </div>
              <div className="space-y-2">
                {gapData.hardSkillGaps.filter(g => g.learningPossible).slice(0, 5).map((gap, index) => (
                  <m.div
                    key={gap.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(gap.severity)}
                        <span className="text-sm font-medium text-blue-900">{gap.title}</span>
                      </div>
                      <span className="text-xs text-blue-600">{gap.learningTimeEstimate}</span>
                    </div>
                    <p className="text-xs text-gray-600">{gap.description}</p>
                  </m.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

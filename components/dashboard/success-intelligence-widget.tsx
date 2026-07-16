"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, AlertTriangle, Target, Zap, ArrowUpRight } from "lucide-react";

interface SuccessIntelligenceWidgetProps {
  successIntelligence: {
    mainLever: {
      lever: string;
      impact: string;
      effort: "low" | "medium" | "high";
      expectedGain: string;
      confidence: "high" | "medium" | "low";
      reason: string;
    };
    mainBlocker: {
      blocker: string;
      severity: "critical" | "high" | "medium" | "low";
      impact: string;
      solution: string;
      confidence: "high" | "medium" | "low";
      reason: string;
    };
    bestInvestment: {
      investment: string;
      roi: number;
      effort: "low" | "medium" | "high";
      time: string;
      expectedValue: string;
      confidence: "high" | "medium" | "low";
      reason: string;
    };
    quickWins: Array<{
      action: string;
      impact: string;
      effort: "low" | "medium" | "high";
      time: string;
      confidence: "high" | "medium" | "low";
      reason: string;
    }>;
    recommendedOptimizations: Array<{
      optimization: string;
      priority: "critical" | "high" | "medium" | "low";
      impact: string;
      effort: "low" | "medium" | "high";
      risk: "low" | "medium" | "high";
      roi: number;
      confidence: "high" | "medium" | "low";
      reason: string;
    }>;
    confidence: {
      overallConfidence: "very_high" | "high" | "moderate" | "low" | "insufficient";
      dataQuality: "excellent" | "good" | "moderate" | "poor";
      reason: string;
    };
  } | null;
}

export function SuccessIntelligenceWidget({ successIntelligence }: SuccessIntelligenceWidgetProps) {
  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "low":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "high":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "very_high":
        return "bg-green-100 text-green-700";
      case "high":
        return "bg-emerald-100 text-emerald-700";
      case "moderate":
        return "bg-amber-100 text-amber-700";
      case "low":
        return "bg-orange-100 text-orange-700";
      case "insufficient":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!successIntelligence) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Success Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 text-center py-4">Aucune donnée d'optimisation disponible</p>
        </CardContent>
      </Card>
    );
  }

  const priorityOptimizations = successIntelligence.recommendedOptimizations.slice(0, 3);
  const priorityQuickWins = successIntelligence.quickWins.slice(0, 2);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Success Intelligence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Lever */}
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-start gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-900">Levier principal</p>
              <p className="text-sm text-emerald-800 font-medium">{successIntelligence.mainLever.lever}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffortColor(successIntelligence.mainLever.effort)}`}>
              {successIntelligence.mainLever.effort}
            </span>
          </div>
          <p className="text-xs text-emerald-700 mb-1">Gain attendu: {successIntelligence.mainLever.expectedGain}</p>
          <p className="text-xs text-emerald-600">{successIntelligence.mainLever.reason}</p>
        </div>

        {/* Main Blocker */}
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">Frein principal</p>
              <p className="text-sm text-red-800 font-medium">{successIntelligence.mainBlocker.blocker}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(successIntelligence.mainBlocker.severity)}`}>
              {successIntelligence.mainBlocker.severity}
            </span>
          </div>
          <p className="text-xs text-red-700 mb-1">Solution: {successIntelligence.mainBlocker.solution}</p>
          <p className="text-xs text-red-600">{successIntelligence.mainBlocker.reason}</p>
        </div>

        {/* Best Investment */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">Meilleur investissement</p>
              <p className="text-sm text-blue-800 font-medium">{successIntelligence.bestInvestment.investment}</p>
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              ROI: {successIntelligence.bestInvestment.roi}%
            </span>
          </div>
          <p className="text-xs text-blue-700 mb-1">Valeur attendue: {successIntelligence.bestInvestment.expectedValue}</p>
          <p className="text-xs text-blue-600">Temps: {successIntelligence.bestInvestment.time}</p>
        </div>

        {/* Quick Wins */}
        {priorityQuickWins.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Gains rapides
            </p>
            <div className="space-y-2">
              {priorityQuickWins.map((win, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="p-2 bg-amber-50 rounded border border-amber-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-amber-900">{win.action}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffortColor(win.effort)}`}>
                      {win.effort}
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 mt-1">{win.impact}</p>
                  <p className="text-xs text-amber-600">Temps: {win.time}</p>
                </m.div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Optimizations */}
        {priorityOptimizations.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-blue-500" />
              Optimisations recommandées
            </p>
            <div className="space-y-2">
              {priorityOptimizations.map((opt, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="p-2 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{opt.optimization}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(opt.priority)}`}>
                      {opt.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">ROI: {opt.roi}%</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffortColor(opt.effort)}`}>
                      {opt.effort}
                    </span>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Level */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">Confiance globale</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(successIntelligence.confidence.overallConfidence)}`}>
              {successIntelligence.confidence.overallConfidence.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Qualité des données: {successIntelligence.confidence.dataQuality}</p>
        </div>
      </CardContent>
    </Card>
  );
}

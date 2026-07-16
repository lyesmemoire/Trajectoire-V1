"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface LiveScoresWidgetProps {
  overallScore: number;
  change: number;
  trend: "up" | "stable" | "down";
  liveScores: {
    communication: number;
    leadership: number;
    confidence: number;
    structure: number;
    impact: number;
  };
  scoreEvolutions?: {
    communication?: { change: number; trend: "improving" | "stable" | "declining"; since: string };
    leadership?: { change: number; trend: "improving" | "stable" | "declining"; since: string };
    confidence?: { change: number; trend: "improving" | "stable" | "declining"; since: string };
    structure?: { change: number; trend: "improving" | "stable" | "declining"; since: string };
    impact?: { change: number; trend: "improving" | "stable" | "declining"; since: string };
  };
}

export function LiveScoresWidget({ overallScore, change, trend, liveScores, scoreEvolutions }: LiveScoresWidgetProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case "stable":
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-emerald-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
    }
  };

  const getScoreTrendIcon = (scoreTrend?: "improving" | "stable" | "declining") => {
    switch (scoreTrend) {
      case "improving":
        return <TrendingUp className="w-3 h-3 text-emerald-600" />;
      case "declining":
        return <TrendingDown className="w-3 h-3 text-red-600" />;
      case "stable":
        return <Minus className="w-3 h-3 text-gray-600" />;
      default:
        return null;
    }
  };

  const getScoreTrendColor = (scoreTrend?: "improving" | "stable" | "declining") => {
    switch (scoreTrend) {
      case "improving":
        return "text-emerald-600";
      case "declining":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Scores en direct</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overall Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Score global</span>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {change >= 0 ? "+" : ""}{change}
              </span>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-900">{overallScore}</span>
            <span className="text-sm text-gray-500 mb-1">/100</span>
          </div>
        </div>

        {/* Live Scores */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Communication</span>
              <div className="flex items-center gap-2">
                {scoreEvolutions?.communication && (
                  <>
                    {getScoreTrendIcon(scoreEvolutions.communication.trend)}
                    <span className={`text-xs font-medium ${getScoreTrendColor(scoreEvolutions.communication.trend)}`}>
                      {scoreEvolutions.communication.change >= 0 ? "+" : ""}{scoreEvolutions.communication.change} {scoreEvolutions.communication.since}
                    </span>
                  </>
                )}
                <span className="text-sm font-medium text-gray-900">{liveScores.communication}</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${liveScores.communication}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Leadership</span>
              <div className="flex items-center gap-2">
                {scoreEvolutions?.leadership && (
                  <>
                    {getScoreTrendIcon(scoreEvolutions.leadership.trend)}
                    <span className={`text-xs font-medium ${getScoreTrendColor(scoreEvolutions.leadership.trend)}`}>
                      {scoreEvolutions.leadership.change >= 0 ? "+" : ""}{scoreEvolutions.leadership.change} {scoreEvolutions.leadership.since}
                    </span>
                  </>
                )}
                <span className="text-sm font-medium text-gray-900">{liveScores.leadership}</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${liveScores.leadership}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-purple-500 rounded-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Confiance</span>
              <div className="flex items-center gap-2">
                {scoreEvolutions?.confidence && (
                  <>
                    {getScoreTrendIcon(scoreEvolutions.confidence.trend)}
                    <span className={`text-xs font-medium ${getScoreTrendColor(scoreEvolutions.confidence.trend)}`}>
                      {scoreEvolutions.confidence.change >= 0 ? "+" : ""}{scoreEvolutions.confidence.change} {scoreEvolutions.confidence.since}
                    </span>
                  </>
                )}
                <span className="text-sm font-medium text-gray-900">{liveScores.confidence}</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${liveScores.confidence}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Structure</span>
              <div className="flex items-center gap-2">
                {scoreEvolutions?.structure && (
                  <>
                    {getScoreTrendIcon(scoreEvolutions.structure.trend)}
                    <span className={`text-xs font-medium ${getScoreTrendColor(scoreEvolutions.structure.trend)}`}>
                      {scoreEvolutions.structure.change >= 0 ? "+" : ""}{scoreEvolutions.structure.change} {scoreEvolutions.structure.since}
                    </span>
                  </>
                )}
                <span className="text-sm font-medium text-gray-900">{liveScores.structure}</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${liveScores.structure}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Impact</span>
              <div className="flex items-center gap-2">
                {scoreEvolutions?.impact && (
                  <>
                    {getScoreTrendIcon(scoreEvolutions.impact.trend)}
                    <span className={`text-xs font-medium ${getScoreTrendColor(scoreEvolutions.impact.trend)}`}>
                      {scoreEvolutions.impact.change >= 0 ? "+" : ""}{scoreEvolutions.impact.change} {scoreEvolutions.impact.since}
                    </span>
                  </>
                )}
                <span className="text-sm font-medium text-gray-900">{liveScores.impact}</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${liveScores.impact}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-rose-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

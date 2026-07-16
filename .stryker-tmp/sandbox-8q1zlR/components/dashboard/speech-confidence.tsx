// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, TrendingDown, Activity, CheckCircle } from "lucide-react";

interface SpeechConfidenceProps {
  confidenceData: {
    currentConfidence: number;
    averageConfidence: number;
    confidenceHistory: Array<{
      timestamp: number;
      confidence: number;
    }>;
    threshold: number;
  };
}

export function SpeechConfidence({ confidenceData }: SpeechConfidenceProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= confidenceData.threshold) {
      return "bg-green-100 text-green-700 border-green-200";
    } else if (confidence >= confidenceData.threshold - 0.1) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    } else {
      return "bg-red-100 text-red-700 border-red-200";
    }
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= confidenceData.threshold) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (confidence >= confidenceData.threshold - 0.1) {
      return <Activity className="w-4 h-4 text-yellow-600" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Speech Confidence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Current Confidence</div>
                <div className="text-xs text-gray-600">Threshold: {(confidenceData.threshold * 100).toFixed(0)}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(confidenceData.currentConfidence)}`}>
                {(confidenceData.currentConfidence * 100).toFixed(1)}%
              </div>
              {getConfidenceIcon(confidenceData.currentConfidence)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Average Confidence</div>
              <div className="text-sm font-medium text-gray-900">{(confidenceData.averageConfidence * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">History Length</div>
              <div className="text-sm font-medium text-gray-900">{confidenceData.confidenceHistory.length}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="space-y-2">
              <div className="text-xs text-gray-600 mb-2">Confidence History</div>
              <div className="flex gap-1 h-8 items-end">
                {confidenceData.confidenceHistory.slice(-20).map((entry, index) => (
                  <motion.div
                    key={entry.timestamp}
                    initial={{ height: 0 }}
                    animate={{ height: `${entry.confidence * 100}%` }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex-1 rounded-sm ${getConfidenceColor(entry.confidence)}`}
                    style={{ minHeight: "4px" }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              {confidenceData.currentConfidence >= confidenceData.averageConfidence ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span>
                {confidenceData.currentConfidence >= confidenceData.averageConfidence ? "Above" : "Below"} average
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

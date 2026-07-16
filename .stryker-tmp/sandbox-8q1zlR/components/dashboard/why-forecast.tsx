// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, Info, CheckCircle, BarChart3 } from "lucide-react";

export interface ForecastExplanation {
  forecast: string;
  basedOn: string[];
  explanation: string;
  confidence: number;
  factors: {
    factor: string;
    impact: string;
  }[];
}

export interface WhyForecastProps {
  forecastExplanation: ForecastExplanation;
}

export function WhyForecast({ forecastExplanation }: WhyForecastProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-50";
    if (confidence >= 60) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Pourquoi cette prévision ?
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Forecast */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <p className="text-sm font-medium text-indigo-900 mb-1">Prévision</p>
            <p className="text-base font-bold text-indigo-900">{forecastExplanation.forecast}</p>
          </div>

          {/* Based On */}
          {forecastExplanation.basedOn.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Basée sur</p>
              <div className="space-y-2">
                {forecastExplanation.basedOn.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          {forecastExplanation.explanation && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Explication</p>
              <p className="text-sm text-gray-700">{forecastExplanation.explanation}</p>
            </div>
          )}

          {/* Factors */}
          {forecastExplanation.factors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Facteurs d'influence</p>
              <div className="space-y-2">
                {forecastExplanation.factors.map((factor, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{factor.factor}</p>
                        <p className="text-xs text-gray-600">{factor.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-600" />
              <p className="text-sm text-gray-600">Confiance</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(forecastExplanation.confidence)}`}>
              {forecastExplanation.confidence}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

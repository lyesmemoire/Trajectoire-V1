"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { BarChart3, TrendingUp, Layers, Activity } from "lucide-react";

interface EmbeddingMetricsProps {
  metricsData: {
    totalEmbeddings: number;
    totalTokens: number;
    totalDimensions: number;
    averageLatency: number;
    batchSize: number;
    successRate: number;
  };
}

export function EmbeddingMetrics({ metricsData }: EmbeddingMetricsProps) {
  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Embedding Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Performance Metrics</div>
                <div className="text-xs text-gray-600">Embedding statistics</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Embeddings</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-600" />
                {metricsData.totalEmbeddings}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Tokens</div>
              <div className="text-sm font-medium text-gray-900">{metricsData.totalTokens}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Dimensions</div>
              <div className="text-sm font-medium text-gray-900">{metricsData.totalDimensions}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-600 mb-1">Average Latency</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Activity className="w-3 h-3 text-green-600" />
                {metricsData.averageLatency}ms
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Batch Size</div>
              <div className="text-sm font-medium text-gray-900">{metricsData.batchSize}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Success Rate</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                {metricsData.successRate}%
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${metricsData.successRate}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">Success Rate: {metricsData.successRate}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

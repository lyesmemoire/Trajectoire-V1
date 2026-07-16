"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, DollarSign, Layers, Zap } from "lucide-react";

interface EmbeddingUsageProps {
  usageData: {
    totalEmbeddings: number;
    totalTokens: number;
    totalCost: number;
    averageCostPerEmbedding: number;
    averageTokensPerEmbedding: number;
    costPerToken: number;
  };
}

export function EmbeddingUsage({ usageData }: EmbeddingUsageProps) {
  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Embedding Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Usage Statistics</div>
                <div className="text-xs text-gray-600">Embedding consumption</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Embeddings</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-600" />
                {usageData.totalEmbeddings}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Tokens</div>
              <div className="text-sm font-medium text-gray-900">{usageData.totalTokens}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Cost</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-green-600" />
                ${usageData.totalCost.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-600 mb-1">Avg Cost/Embedding</div>
              <div className="text-sm font-medium text-gray-900">
                ${usageData.averageCostPerEmbedding.toFixed(6)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Avg Tokens/Embedding</div>
              <div className="text-sm font-medium text-gray-900">
                {usageData.averageTokensPerEmbedding.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Cost/Token</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-600" />
                ${usageData.costPerToken.toFixed(6)}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Cost Distribution</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: "100%" }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Total: ${usageData.totalCost.toFixed(4)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

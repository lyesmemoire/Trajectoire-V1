// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Clock, DollarSign, MessageSquare, Zap } from "lucide-react";

interface OpenAIRealtimeMetricsProps {
  metricsData: {
    latency: {
      audio: number;
      transcript: number;
      response: number;
      total: number;
    };
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      cost: number;
    };
    streaming: {
      chunksReceived: number;
      chunksSent: number;
      bytesReceived: number;
      bytesSent: number;
    };
  };
}

export function OpenAIRealtimeMetrics({ metricsData }: OpenAIRealtimeMetricsProps) {
  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">OpenAI Realtime Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Clock className="w-3 h-3" />
              <span>Latency (ms)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Audio</div>
                <div className="text-sm font-medium text-gray-900">{metricsData.latency.audio}</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Transcript</div>
                <div className="text-sm font-medium text-gray-900">{metricsData.latency.transcript}</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Response</div>
                <div className="text-sm font-medium text-gray-900">{metricsData.latency.response}</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Total</div>
                <div className="text-sm font-medium text-gray-900">{metricsData.latency.total}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <MessageSquare className="w-3 h-3" />
              <span>Token Usage</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Prompt</div>
                <div className="text-sm font-medium text-blue-900">{metricsData.usage.promptTokens}</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Completion</div>
                <div className="text-sm font-medium text-purple-900">{metricsData.usage.completionTokens}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Total</div>
                <div className="text-sm font-medium text-green-900">{metricsData.usage.totalTokens}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <DollarSign className="w-3 h-3" />
              <span>Cost</span>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center">
              <div className="text-sm font-medium text-yellow-900">${metricsData.usage.cost.toFixed(4)}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Zap className="w-3 h-3" />
              <span>Streaming</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Chunks In</div>
                <div className="text-sm font-medium text-gray-900">{metricsData.streaming.chunksReceived}</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Chunks Out</div>
                <div className="text-sm font-medium text-gray-900">{metricsData.streaming.chunksSent}</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Bytes In</div>
                <div className="text-sm font-medium text-gray-900">{(metricsData.streaming.bytesReceived / 1024).toFixed(2)} KB</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                <div className="text-xs text-gray-600">Bytes Out</div>
                <div className="text-sm font-medium text-gray-900">{(metricsData.streaming.bytesSent / 1024).toFixed(2)} KB</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

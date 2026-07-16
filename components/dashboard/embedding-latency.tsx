"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Clock, Zap, AlertTriangle, CheckCircle } from "lucide-react";

interface EmbeddingLatencyProps {
  latencyData: {
    embeddingLatency: number;
    batchLatency: number;
    totalLatency: number;
    averageLatency: number;
    latencyHistory: Array<{
      timestamp: number;
      latency: number;
    }>;
    threshold: number;
  };
}

export function EmbeddingLatency({ latencyData }: EmbeddingLatencyProps) {
  const getLatencyStatus = (latency: number, threshold: number) => {
    if (latency < threshold * 0.5) return "good";
    if (latency < threshold) return "warning";
    return "critical";
  };

  const getLatencyColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const embeddingStatus = getLatencyStatus(latencyData.embeddingLatency, latencyData.threshold);
  const batchStatus = getLatencyStatus(latencyData.batchLatency, latencyData.threshold);
  const totalStatus = getLatencyStatus(latencyData.totalLatency, latencyData.threshold * 2);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Embedding Latency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Latency Metrics</div>
                <div className="text-xs text-gray-600">Performance monitoring</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLatencyColor(totalStatus)}`}>
                {totalStatus}
              </div>
              {totalStatus === "good" && <CheckCircle className="w-4 h-4 text-green-600" />}
              {totalStatus === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
              {totalStatus === "critical" && <AlertTriangle className="w-4 h-4 text-red-600" />}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Embedding</div>
              <div className={`text-sm font-medium ${getLatencyColor(embeddingStatus)}`}>
                {latencyData.embeddingLatency}ms
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Batch</div>
              <div className={`text-sm font-medium ${getLatencyColor(batchStatus)}`}>
                {latencyData.batchLatency}ms
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total</div>
              <div className={`text-sm font-medium ${getLatencyColor(totalStatus)}`}>
                {latencyData.totalLatency}ms
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Average</div>
              <div className="text-sm font-medium text-gray-900">
                {latencyData.averageLatency}ms
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Latency History</div>
            <div className="space-y-2">
              {latencyData.latencyHistory.slice(-5).map((entry, index) => {
                const status = getLatencyStatus(entry.latency, latencyData.threshold);
                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="text-gray-600">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                    <div className={`font-medium ${getLatencyColor(status)}`}>
                      {entry.latency}ms
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">Threshold</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-600" />
                {latencyData.threshold}ms
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  totalStatus === "good" ? "bg-green-600" :
                  totalStatus === "warning" ? "bg-yellow-600" : "bg-red-600"
                }`}
                style={{ width: `${Math.min((latencyData.totalLatency / (latencyData.threshold * 2)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

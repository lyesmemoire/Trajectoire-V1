"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Clock, Zap, Activity, TrendingUp } from "lucide-react";

interface SpeechLatencyProps {
  latencyData: {
    audioLatency: number;
    transcriptLatency: number;
    totalLatency: number;
    averageLatency: number;
    latencyHistory: Array<{
      timestamp: number;
      latency: number;
    }>;
    threshold: number;
  };
}

export function SpeechLatency({ latencyData }: SpeechLatencyProps) {
  const getLatencyColor = (latency: number) => {
    if (latency <= latencyData.threshold) {
      return "bg-green-100 text-green-700 border-green-200";
    } else if (latency <= latencyData.threshold * 1.5) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    } else {
      return "bg-red-100 text-red-700 border-red-200";
    }
  };

  const getLatencyIcon = (latency: number) => {
    if (latency <= latencyData.threshold) {
      return <Activity className="w-4 h-4 text-green-600" />;
    } else if (latency <= latencyData.threshold * 1.5) {
      return <Clock className="w-4 h-4 text-yellow-600" />;
    } else {
      return <Zap className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Speech Latency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Total Latency</div>
                <div className="text-xs text-gray-600">Threshold: {latencyData.threshold}ms</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLatencyColor(latencyData.totalLatency)}`}>
                {latencyData.totalLatency}ms
              </div>
              {getLatencyIcon(latencyData.totalLatency)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Audio Latency</div>
              <div className="text-sm font-medium text-gray-900">{latencyData.audioLatency}ms</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Transcript Latency</div>
              <div className="text-sm font-medium text-gray-900">{latencyData.transcriptLatency}ms</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Average Latency</div>
              <div className="text-sm font-medium text-gray-900">{latencyData.averageLatency}ms</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="space-y-2">
              <div className="text-xs text-gray-600 mb-2">Latency History</div>
              <div className="flex gap-1 h-8 items-end">
                {latencyData.latencyHistory.slice(-20).map((entry, index) => (
                  <m.div
                    key={entry.timestamp}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min((entry.latency / latencyData.threshold) * 100, 100)}%` }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex-1 rounded-sm ${getLatencyColor(entry.latency)}`}
                    style={{ minHeight: "4px" }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              {latencyData.totalLatency <= latencyData.averageLatency ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <Zap className="w-3 h-3 text-red-600" />
              )}
              <span>
                {latencyData.totalLatency <= latencyData.averageLatency ? "Below" : "Above"} average
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

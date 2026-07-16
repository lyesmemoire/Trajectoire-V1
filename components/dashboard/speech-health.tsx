"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Heart, Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface SpeechHealthProps {
  healthData: {
    connectionHealth: string;
    streamingHealth: string;
    transcriptionHealth: string;
    lastCheck: number;
    uptime: number;
    errorRate: number;
  };
}

export function SpeechHealth({ healthData }: SpeechHealthProps) {
  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "bg-green-100 text-green-700 border-green-200";
      case "degraded":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "unhealthy":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "unhealthy":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Speech Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Connection</span>
                {getHealthIcon(healthData.connectionHealth)}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(healthData.connectionHealth)}`}>
                {healthData.connectionHealth}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Streaming</span>
                {getHealthIcon(healthData.streamingHealth)}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(healthData.streamingHealth)}`}>
                {healthData.streamingHealth}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Transcription</span>
                {getHealthIcon(healthData.transcriptionHealth)}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(healthData.transcriptionHealth)}`}>
                {healthData.transcriptionHealth}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Uptime</div>
              <div className="text-sm font-medium text-gray-900">{healthData.uptime.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Error Rate</div>
              <div className="text-sm font-medium text-gray-900">{healthData.errorRate.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Last Check</div>
              <div className="text-sm font-medium text-gray-900">{new Date(healthData.lastCheck).toLocaleTimeString()}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Heart className="w-3 h-3" />
              <span>Overall Health: {healthData.connectionHealth === "healthy" && healthData.streamingHealth === "healthy" && healthData.transcriptionHealth === "healthy" ? "Healthy" : "Degraded"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Activity, Zap, TrendingUp, Database } from "lucide-react";

interface TTSStreamingProps {
  streamingData: {
    state: string;
    chunksGenerated: number;
    chunksPlayed: number;
    bytesGenerated: number;
    bytesPlayed: number;
    chunksPerSecond: number;
    bytesPerSecond: number;
    bufferSize: number;
  };
}

export function TTSStreaming({ streamingData }: TTSStreamingProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Streaming":
        return "bg-green-100 text-green-700 border-green-200";
      case "Preparing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Idle":
      case "Stopped":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "Streaming":
        return <Activity className="w-4 h-4 text-green-600" />;
      case "Preparing":
        return <Zap className="w-4 h-4 text-yellow-600" />;
      case "Idle":
      case "Stopped":
        return <Database className="w-4 h-4 text-gray-600" />;
      default:
        return <Activity className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">TTS Streaming</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Streaming Status</div>
                <div className="text-xs text-gray-600">Real-time audio generation</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(streamingData.state)}`}>
                {streamingData.state}
              </div>
              {getStateIcon(streamingData.state)}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Chunks Generated</div>
              <div className="text-sm font-medium text-gray-900">{streamingData.chunksGenerated}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Chunks Played</div>
              <div className="text-sm font-medium text-gray-900">{streamingData.chunksPlayed}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Bytes Generated</div>
              <div className="text-sm font-medium text-gray-900">{streamingData.bytesGenerated}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Bytes Played</div>
              <div className="text-sm font-medium text-gray-900">{streamingData.bytesPlayed}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-600 mb-1">Chunks/Second</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                {streamingData.chunksPerSecond}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Bytes/Second</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                {streamingData.bytesPerSecond}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Buffer Size</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Database className="w-3 h-3 text-blue-600" />
                {streamingData.bufferSize}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

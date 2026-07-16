// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Activity, Zap } from "lucide-react";

interface OpenAIRealtimeStreamingProps {
  streamingData: {
    isActive: boolean;
    chunksPerSecond: number;
    bytesPerSecond: number;
    totalChunks: number;
    totalBytes: number;
    duration: number;
  };
}

export function OpenAIRealtimeStreaming({ streamingData }: OpenAIRealtimeStreamingProps) {
  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">OpenAI Realtime Streaming</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Streaming Status</div>
                <div className="text-xs text-gray-600">Duration: {streamingData.duration}s</div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${streamingData.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
              {streamingData.isActive ? "Active" : "Inactive"}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Chunks/s</div>
              <div className="text-sm font-medium text-gray-900">{streamingData.chunksPerSecond}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Bytes/s</div>
              <div className="text-sm font-medium text-gray-900">{(streamingData.bytesPerSecond / 1024).toFixed(2)} KB/s</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Chunks</div>
              <div className="text-sm font-medium text-gray-900">{streamingData.totalChunks}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Bytes</div>
              <div className="text-sm font-medium text-gray-900">{(streamingData.totalBytes / 1024).toFixed(2)} KB</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Zap className="w-3 h-3" />
              <span>Throughput: {(streamingData.bytesPerSecond / 1024).toFixed(2)} KB/s</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Mic, Volume2 } from "lucide-react";

interface OpenAIRealtimeAudioProps {
  audioData: {
    state: string;
    sampleRate: number;
    channels: number;
    format: string;
    chunksReceived: number;
    chunksSent: number;
    bytesReceived: number;
    bytesSent: number;
  };
}

export function OpenAIRealtimeAudio({ audioData }: OpenAIRealtimeAudioProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Streaming":
        return "bg-green-100 text-green-700 border-green-200";
      case "Listening":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Speaking":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Interrupted":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">OpenAI Realtime Audio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Audio State</div>
                <div className="text-xs text-gray-600">{audioData.format} @ {audioData.sampleRate}Hz</div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(audioData.state)}`}>
              {audioData.state}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Chunks In</div>
              <div className="text-sm font-medium text-gray-900">{audioData.chunksReceived}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Chunks Out</div>
              <div className="text-sm font-medium text-gray-900">{audioData.chunksSent}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Bytes In</div>
              <div className="text-sm font-medium text-gray-900">{(audioData.bytesReceived / 1024).toFixed(2)} KB</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Bytes Out</div>
              <div className="text-sm font-medium text-gray-900">{(audioData.bytesSent / 1024).toFixed(2)} KB</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Volume2 className="w-3 h-3" />
              <span>Channels: {audioData.channels}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

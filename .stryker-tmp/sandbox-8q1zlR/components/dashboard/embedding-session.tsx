// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Layers, CheckCircle, AlertTriangle, Square, Play } from "lucide-react";

interface EmbeddingSessionProps {
  sessionData: {
    state: string;
    sessionId: string;
    startedAt: number | null;
    endedAt: number | null;
    duration: number;
    model: string;
    language: string;
    dimensions: number;
  };
  onStart: () => void;
  onStop: () => void;
  onCancel: () => void;
}

export function EmbeddingSession({
  sessionData,
  onStart,
  onStop,
  onCancel
}: EmbeddingSessionProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Embedding":
      case "BatchProcessing":
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "Preparing":
      case "Recovering":
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
      case "Embedding":
      case "BatchProcessing":
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Preparing":
      case "Recovering":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "Idle":
      case "Stopped":
        return <Layers className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Embedding Session</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Session Status</div>
                <div className="text-xs text-gray-600">Session: {sessionData.sessionId}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(sessionData.state)}`}>
                {sessionData.state}
              </div>
              {getStateIcon(sessionData.state)}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Started At</div>
              <div className="text-sm font-medium text-gray-900">
                {sessionData.startedAt ? new Date(sessionData.startedAt).toLocaleTimeString() : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Duration</div>
              <div className="text-sm font-medium text-gray-900">{sessionData.duration}s</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Model</div>
              <div className="text-sm font-medium text-gray-900">{sessionData.model}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Language</div>
              <div className="text-sm font-medium text-gray-900">{sessionData.language}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Dimensions: {sessionData.dimensions}</div>
            <div className="flex gap-2">
              <button
                onClick={onStart}
                className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                <Play className="w-3 h-3 inline mr-1" />
                Start
              </button>
              <button
                onClick={onStop}
                className="flex-1 py-2 text-xs font-medium text-red-600 border border-red-300 rounded hover:bg-red-100 transition-colors"
              >
                <Square className="w-3 h-3 inline mr-1" />
                Stop
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

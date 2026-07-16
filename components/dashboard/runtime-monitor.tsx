"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Mic, MicOff, Brain, Clock, Activity, AlertTriangle, CheckCircle, XCircle, Signal, Zap, Volume2, MessageSquare, Radio, Gauge } from "lucide-react";

interface RuntimeMonitorProps {
  realtimeContext: {
    sessionId: string;
    currentState: string;
    connectionStatus: string;
    heartbeatStatus: {
      lastHeartbeat: number;
      interval: number;
      missed: number;
    };
    error: string | null;
  } | null;
  metrics: {
    turnCount: number;
    totalDuration: number;
    userSpeakingTime: number;
    aiSpeakingTime: number;
    latency: {
      audio: number;
      transcript: number;
      response: number;
    };
  } | null;
  onStartSession: () => void;
  onStopSession: () => void;
}

export function RuntimeMonitor({
  realtimeContext,
  metrics,
  onStartSession,
  onStopSession
}: RuntimeMonitorProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Idle":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Listening":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Thinking":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Speaking":
        return "bg-green-100 text-green-700 border-green-200";
      case "Waiting":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Interrupted":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getConnectionColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-600";
      case "disconnected":
        return "text-red-600";
      case "reconnecting":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return "text-green-600";
    if (latency < 500) return "text-yellow-600";
    return "text-red-600";
  };

  const isSessionActive = realtimeContext?.currentState !== "Idle" && realtimeContext?.currentState !== "Error";

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900">Runtime Monitor</CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={onStartSession}
              disabled={isSessionActive}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-4 h-4" />
              <span className="text-sm font-medium">Start</span>
            </button>
            <button
              onClick={onStopSession}
              disabled={!isSessionActive}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MicOff className="w-4 h-4" />
              <span className="text-sm font-medium">Stop</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Session Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Session Status</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(realtimeContext?.currentState || "Idle")}`}>
              {realtimeContext?.currentState || "Idle"}
            </div>
          </div>

          {/* Connection Status */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Signal className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Connection Status</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${getConnectionColor(realtimeContext?.connectionStatus || "disconnected")}`}>
                  {realtimeContext?.connectionStatus || "disconnected"}
                </span>
                {realtimeContext?.connectionStatus === "connected" && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                {realtimeContext?.connectionStatus === "disconnected" && (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                {realtimeContext?.connectionStatus === "reconnecting" && (
                  <Clock className="w-4 h-4 text-yellow-600" />
                )}
                {realtimeContext?.connectionStatus === "error" && (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
          </div>

          {/* Heartbeat Status */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Heartbeat Status</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-purple-700">Last Heartbeat</div>
                  <div className="text-sm font-medium text-purple-900">
                    {realtimeContext?.heartbeatStatus.lastHeartbeat 
                      ? new Date(realtimeContext.heartbeatStatus.lastHeartbeat).toLocaleTimeString() 
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-purple-700">Interval</div>
                  <div className="text-sm font-medium text-purple-900">
                    {realtimeContext?.heartbeatStatus.interval || 0}ms
                  </div>
                </div>
                <div>
                  <div className="text-xs text-purple-700">Missed</div>
                  <div className="text-sm font-medium text-purple-900">
                    {realtimeContext?.heartbeatStatus.missed || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          {metrics && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-900">Metrics</span>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-indigo-700">Turn Count</div>
                    <div className="text-sm font-medium text-indigo-900">{metrics.turnCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-indigo-700">Total Duration</div>
                    <div className="text-sm font-medium text-indigo-900">{Math.round(metrics.totalDuration / 1000)}s</div>
                  </div>
                  <div>
                    <div className="text-xs text-indigo-700">User Speaking</div>
                    <div className="text-sm font-medium text-indigo-900">{Math.round(metrics.userSpeakingTime / 1000)}s</div>
                  </div>
                  <div>
                    <div className="text-xs text-indigo-700">AI Speaking</div>
                    <div className="text-sm font-medium text-indigo-900">{Math.round(metrics.aiSpeakingTime / 1000)}s</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Latency */}
          {metrics && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">Latency</span>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-orange-700">Audio</span>
                    </div>
                    <span className={`text-sm font-medium ${getLatencyColor(metrics.latency.audio)}`}>
                      {metrics.latency.audio}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-orange-700">Transcript</span>
                    </div>
                    <span className={`text-sm font-medium ${getLatencyColor(metrics.latency.transcript)}`}>
                      {metrics.latency.transcript}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-orange-700">Response</span>
                    </div>
                    <span className={`text-sm font-medium ${getLatencyColor(metrics.latency.response)}`}>
                      {metrics.latency.response}ms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {realtimeContext?.error && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Error</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-sm text-red-900">{realtimeContext.error}</div>
              </div>
            </div>
          )}

          {/* Session Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Session Info</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-xs text-blue-700">Session ID</div>
              <div className="text-sm font-medium text-blue-900">{realtimeContext?.sessionId || "N/A"}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

interface OpenAIRealtimeConnectionProps {
  connectionData: {
    state: string;
    sessionId: string;
    connectedAt: number | null;
    lastHeartbeat: number | null;
    latency: number;
    reconnectAttempts: number;
  };
  onConnect: () => void;
  onDisconnect: () => void;
  onReconnect: () => void;
}

export function OpenAIRealtimeConnection({
  connectionData,
  onConnect,
  onDisconnect,
  onReconnect
}: OpenAIRealtimeConnectionProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Connected":
      case "Streaming":
        return "bg-green-100 text-green-700 border-green-200";
      case "Connecting":
      case "Recovering":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Disconnected":
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "Connected":
      case "Streaming":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Connecting":
      case "Recovering":
        return <RefreshCw className="w-4 h-4 text-yellow-600" />;
      case "Disconnected":
      case "Closed":
        return <WifiOff className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">OpenAI Realtime Connection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Connection Status</div>
                <div className="text-xs text-gray-600">Session: {connectionData.sessionId}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(connectionData.state)}`}>
                {connectionData.state}
              </div>
              {getStateIcon(connectionData.state)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Connected At</div>
              <div className="text-sm font-medium text-gray-900">
                {connectionData.connectedAt ? new Date(connectionData.connectedAt).toLocaleTimeString() : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Last Heartbeat</div>
              <div className="text-sm font-medium text-gray-900">
                {connectionData.lastHeartbeat ? new Date(connectionData.lastHeartbeat).toLocaleTimeString() : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Latency</div>
              <div className="text-sm font-medium text-gray-900">{connectionData.latency}ms</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Reconnect Attempts: {connectionData.reconnectAttempts}</div>
            <div className="flex gap-2">
              <button
                onClick={onConnect}
                className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                Connect
              </button>
              <button
                onClick={onDisconnect}
                className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                Disconnect
              </button>
              <button
                onClick={onReconnect}
                className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                Reconnect
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Activity, CheckCircle, XCircle, Play, Square, RotateCcw, Power } from "lucide-react";

interface ProviderLifecycleProps {
  lifecycleData: {
    state: string;
    providers: Array<{
      id: string;
      name: string;
      status: string;
      uptime: number;
      lastTransition: number;
    }>;
  };
  onInitialize: (providerId: string) => void;
  onStart: (providerId: string) => void;
  onStop: (providerId: string) => void;
  onRestart: (providerId: string) => void;
  onShutdown: (providerId: string) => void;
}

export function ProviderLifecycle({
  lifecycleData,
  onInitialize,
  onStart,
  onStop,
  onRestart,
  onShutdown
}: ProviderLifecycleProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "initialized":
      case "started":
        return "bg-green-100 text-green-700 border-green-200";
      case "stopped":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "shutdown":
        return "bg-red-100 text-red-700 border-red-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "initialized":
      case "started":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "stopped":
        return <Square className="w-4 h-4 text-gray-600" />;
      case "shutdown":
        return <Power className="w-4 h-4 text-red-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Provider Lifecycle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Lifecycle Status</div>
                <div className="text-xs text-gray-600">Provider lifecycle management</div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lifecycleData.state)}`}>
              {lifecycleData.state}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            {lifecycleData.providers.length === 0 ? (
              <div className="text-sm text-gray-600 text-center py-4">No providers in lifecycle</div>
            ) : (
              lifecycleData.providers.map((provider, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(provider.status)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                      <div className="text-xs text-gray-600">Uptime: {provider.uptime}s</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </div>
                    <button
                      onClick={() => onInitialize(provider.id)}
                      className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700"
                    >
                      Initialize
                    </button>
                    <button
                      onClick={() => onStart(provider.id)}
                      className="px-2 py-1 rounded text-xs bg-green-100 text-green-700"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onStop(provider.id)}
                      className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700"
                    >
                      <Square className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRestart(provider.id)}
                      className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onShutdown(provider.id)}
                      className="px-2 py-1 rounded text-xs bg-red-100 text-red-700"
                    >
                      <Power className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Settings, CheckCircle, XCircle, AlertTriangle, Play, Square, RotateCcw } from "lucide-react";

interface RuntimeManagerProps {
  managerData: {
    state: string;
    activeProviders: number;
    inactiveProviders: number;
    lastEvent: string;
  };
  onInitialize: () => void;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
}

export function RuntimeManager({
  managerData,
  onInitialize,
  onStart,
  onStop,
  onRestart
}: RuntimeManagerProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Running":
        return "bg-green-100 text-green-700 border-green-200";
      case "Initializing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "Running":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Initializing":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "Error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Runtime Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Manager State</div>
                <div className="text-xs text-gray-600">Runtime coordination</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(managerData.state)}`}>
                {managerData.state}
              </div>
              {getStateIcon(managerData.state)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Active Providers</div>
              <div className="text-sm font-medium text-green-600">{managerData.activeProviders}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Inactive Providers</div>
              <div className="text-sm font-medium text-gray-600">{managerData.inactiveProviders}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600">Last Event</div>
            <div className="text-sm font-medium text-gray-900">{managerData.lastEvent}</div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={onInitialize}
                className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                Initialize
              </button>
              <button
                onClick={onStart}
                className="flex-1 py-2 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
              >
                <Play className="w-3 h-3 inline mr-1" />
                Start
              </button>
              <button
                onClick={onStop}
                className="flex-1 py-2 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                <Square className="w-3 h-3 inline mr-1" />
                Stop
              </button>
              <button
                onClick={onRestart}
                className="flex-1 py-2 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors"
              >
                <RotateCcw className="w-3 h-3 inline mr-1" />
                Restart
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

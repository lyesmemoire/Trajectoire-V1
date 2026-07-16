"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Cpu, CheckCircle, XCircle, AlertTriangle, Play, Square, RefreshCw } from "lucide-react";

interface RuntimeEngineProps {
  engineData: {
    state: string;
    metrics: {
      totalRequests: number;
      successfulRequests: number;
      failedRequests: number;
      averageLatency: number;
      circuitBreakerOpenCount: number;
      failoverCount: number;
      switchCount: number;
      activeProviders: number;
      inactiveProviders: number;
    };
    circuitBreakerOpen: boolean;
  };
  onStart: () => void;
  onStop: () => void;
  onResetCircuitBreaker: () => void;
}

export function RuntimeEngine({
  engineData,
  onStart,
  onStop,
  onResetCircuitBreaker
}: RuntimeEngineProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Running":
        return "bg-green-100 text-green-700 border-green-200";
      case "Initializing":
      case "Switching":
      case "FailingOver":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CircuitBreakerOpen":
        return "bg-red-100 text-red-700 border-red-200";
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
      case "Switching":
      case "FailingOver":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "CircuitBreakerOpen":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Cpu className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Runtime Engine</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Runtime State</div>
                <div className="text-xs text-gray-600">Provider runtime</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(engineData.state)}`}>
                {engineData.state}
              </div>
              {getStateIcon(engineData.state)}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Requests</div>
              <div className="text-sm font-medium text-gray-900">{engineData.metrics.totalRequests}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Successful</div>
              <div className="text-sm font-medium text-green-600">{engineData.metrics.successfulRequests}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Failed</div>
              <div className="text-sm font-medium text-red-600">{engineData.metrics.failedRequests}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Avg Latency</div>
              <div className="text-sm font-medium text-gray-900">{engineData.metrics.averageLatency}ms</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Circuit Breaker Opens</div>
              <div className="text-sm font-medium text-orange-600">{engineData.metrics.circuitBreakerOpenCount}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Failovers</div>
              <div className="text-sm font-medium text-purple-600">{engineData.metrics.failoverCount}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Switches</div>
              <div className="text-sm font-medium text-blue-600">{engineData.metrics.switchCount}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Active Providers</div>
              <div className="text-sm font-medium text-green-600">{engineData.metrics.activeProviders}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600">Circuit Breaker</div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${engineData.circuitBreakerOpen ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {engineData.circuitBreakerOpen ? 'Open' : 'Closed'}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex gap-2">
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
                onClick={onResetCircuitBreaker}
                className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-3 h-3 inline mr-1" />
                Reset CB
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

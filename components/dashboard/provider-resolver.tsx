"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Search, CheckCircle, XCircle, AlertTriangle, Play } from "lucide-react";

interface ProviderResolverProps {
  resolverData: {
    state: string;
    resolvedProvider: {
      id: string;
      name: string;
      type: string;
      priority: number;
    } | null;
    requirements: {
      type: string;
      capabilities: string[];
      maxLatency?: number;
    };
  };
  onResolve: () => void;
  onResolveBest: () => void;
  onResolveAll: () => void;
}

export function ProviderResolver({
  resolverData,
  onResolve,
  onResolveBest,
  onResolveAll
}: ProviderResolverProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Resolved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Resolving":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "Resolved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Resolving":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "Error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Search className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Provider Resolver</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Resolver Status</div>
                <div className="text-xs text-gray-600">Provider resolution</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(resolverData.state)}`}>
                {resolverData.state}
              </div>
              {getStateIcon(resolverData.state)}
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">Requirements</div>
              <div className="text-sm font-medium text-gray-900">{resolverData.requirements.type}</div>
              <div className="text-xs text-gray-600">
                Capabilities: {resolverData.requirements.capabilities.join(", ")}
              </div>
              {resolverData.requirements.maxLatency && (
                <div className="text-xs text-gray-600">
                  Max Latency: {resolverData.requirements.maxLatency}ms
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            {resolverData.resolvedProvider ? (
              <div className="flex items-center justify-between p-2 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{resolverData.resolvedProvider.name}</div>
                    <div className="text-xs text-gray-600">{resolverData.resolvedProvider.type}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">Priority: {resolverData.resolvedProvider.priority}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 text-center py-4">No provider resolved</div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={onResolve}
                className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                <Play className="w-3 h-3 inline mr-1" />
                Resolve
              </button>
              <button
                onClick={onResolveBest}
                className="flex-1 py-2 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
              >
                Resolve Best
              </button>
              <button
                onClick={onResolveAll}
                className="flex-1 py-2 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors"
              >
                Resolve All
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

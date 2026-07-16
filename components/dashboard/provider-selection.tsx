"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle, XCircle, AlertTriangle, Star, ArrowRight } from "lucide-react";

interface ProviderSelectionProps {
  selectionData: {
    state: string;
    selectedProvider: {
      id: string;
      name: string;
      type: string;
      priority: number;
      health: string;
    } | null;
    candidates: Array<{
      id: string;
      name: string;
      type: string;
      priority: number;
      health: string;
    }>;
    strategy: string;
  };
  onSelect: (providerId: string) => void;
  onSetStrategy: (strategy: string) => void;
}

export function ProviderSelection({
  selectionData,
  onSelect,
  onSetStrategy
}: ProviderSelectionProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Selected":
        return "bg-green-100 text-green-700 border-green-200";
      case "Selecting":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "unhealthy":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "healthy":
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="w-3 h-3 text-yellow-600" />;
      case "unhealthy":
        return <XCircle className="w-3 h-3 text-red-600" />;
      default:
        return <AlertTriangle className="w-3 h-3 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Provider Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Selection Status</div>
                <div className="text-xs text-gray-600">Provider selection</div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(selectionData.state)}`}>
              {selectionData.state}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600">Strategy</div>
            <div className="text-sm font-medium text-gray-900">{selectionData.strategy}</div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            {selectionData.selectedProvider ? (
              <div className="flex items-center justify-between p-2 rounded-lg border border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{selectionData.selectedProvider.name}</div>
                    <div className="text-xs text-gray-600">{selectionData.selectedProvider.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-600">Priority: {selectionData.selectedProvider.priority}</div>
                  {getHealthIcon(selectionData.selectedProvider.health)}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 text-center py-4">No provider selected</div>
            )}
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-900">Candidates</div>
            {selectionData.candidates.length === 0 ? (
              <div className="text-sm text-gray-600 text-center py-4">No candidates available</div>
            ) : (
              selectionData.candidates.map((provider, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelect(provider.id)}
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                      <div className="text-xs text-gray-600">{provider.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-600">Priority: {provider.priority}</div>
                    {getHealthIcon(provider.health)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => onSetStrategy("priority")}
                className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${selectionData.strategy === "priority" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                Priority
              </button>
              <button
                onClick={() => onSetStrategy("round-robin")}
                className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${selectionData.strategy === "round-robin" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                Round Robin
              </button>
              <button
                onClick={() => onSetStrategy("random")}
                className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${selectionData.strategy === "random" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                Random
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

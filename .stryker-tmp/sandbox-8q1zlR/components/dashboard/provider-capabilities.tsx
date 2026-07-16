// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Zap, CheckCircle, XCircle, Search } from "lucide-react";

interface ProviderCapabilitiesProps {
  capabilitiesData: {
    state: string;
    providers: Array<{
      id: string;
      name: string;
      type: string;
      capabilities: Record<string, boolean>;
    }>;
    searchCapability: string;
  };
  onSearch: (capability: string) => void;
  onCheckCapability: (providerId: string, capability: string) => void;
}

export function ProviderCapabilities({
  capabilitiesData,
  onSearch,
  onCheckCapability
}: ProviderCapabilitiesProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Ready":
        return "bg-green-100 text-green-700 border-green-200";
      case "Searching":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Provider Capabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Capabilities Discovery</div>
                <div className="text-xs text-gray-600">Provider capabilities</div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(capabilitiesData.state)}`}>
              {capabilitiesData.state}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search capability..."
              value={capabilitiesData.searchCapability}
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded"
            />
            <button className="px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            {capabilitiesData.providers.length === 0 ? (
              <div className="text-sm text-gray-600 text-center py-4">No providers found</div>
            ) : (
              capabilitiesData.providers.map((provider, index) => (
                <div key={index} className="p-2 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                    <div className="text-xs text-gray-600">{provider.type}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(provider.capabilities).map(([capability, enabled], idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-1 rounded border border-gray-200"
                      >
                        {enabled ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-600" />
                        )}
                        <div className="text-xs text-gray-600">{capability}</div>
                      </div>
                    ))}
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

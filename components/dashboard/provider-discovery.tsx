"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Globe, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface ProviderDiscoveryProps {
  discoveryData: {
    state: string;
    discoveredProviders: Array<{
      id: string;
      name: string;
      type: string;
      version: string;
      endpoint: string;
      available: boolean;
    }>;
    lastDiscovery: number;
  };
  onDiscover: () => void;
  onRefresh: () => void;
}

export function ProviderDiscovery({
  discoveryData,
  onDiscover,
  onRefresh
}: ProviderDiscoveryProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Ready":
        return "bg-green-100 text-green-700 border-green-200";
      case "Discovering":
      case "Refreshing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "Ready":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Discovering":
      case "Refreshing":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "Error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Globe className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Provider Discovery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Discovery Status</div>
                <div className="text-xs text-gray-600">Provider discovery</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(discoveryData.state)}`}>
                {discoveryData.state}
              </div>
              {getStateIcon(discoveryData.state)}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600">Last Discovery</div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(discoveryData.lastDiscovery).toLocaleTimeString()}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            {discoveryData.discoveredProviders.length === 0 ? (
              <div className="text-sm text-gray-600 text-center py-4">No providers discovered</div>
            ) : (
              discoveryData.discoveredProviders.map((provider, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    {provider.available ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                      <div className="text-xs text-gray-600">{provider.type} v{provider.version}</div>
                      <div className="text-xs text-gray-600">{provider.endpoint}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${provider.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {provider.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={onDiscover}
                className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                <Globe className="w-3 h-3 inline mr-1" />
                Discover
              </button>
              <button
                onClick={onRefresh}
                className="flex-1 py-2 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
              >
                <RefreshCw className="w-3 h-3 inline mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

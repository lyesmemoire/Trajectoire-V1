// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Database, CheckCircle, XCircle, AlertTriangle, Plus, Trash2 } from "lucide-react";

interface ProviderRegistryProps {
  registryData: {
    state: string;
    providers: Array<{
      id: string;
      name: string;
      type: string;
      enabled: boolean;
      priority: number;
    }>;
    totalProviders: number;
    enabledProviders: number;
    disabledProviders: number;
  };
  onRegister: () => void;
  onUnregister: (providerId: string) => void;
  onEnable: (providerId: string) => void;
  onDisable: (providerId: string) => void;
}

export function ProviderRegistry({
  registryData,
  onRegister,
  onUnregister,
  onEnable,
  onDisable
}: ProviderRegistryProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Ready":
        return "bg-green-100 text-green-700 border-green-200";
      case "Loading":
      case "Updating":
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
      case "Loading":
      case "Updating":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "Error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Provider Registry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Registry Status</div>
                <div className="text-xs text-gray-600">Provider management</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(registryData.state)}`}>
                {registryData.state}
              </div>
              {getStateIcon(registryData.state)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Total Providers</div>
              <div className="text-sm font-medium text-gray-900">{registryData.totalProviders}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Enabled</div>
              <div className="text-sm font-medium text-green-600">{registryData.enabledProviders}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Disabled</div>
              <div className="text-sm font-medium text-red-600">{registryData.disabledProviders}</div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            {registryData.providers.length === 0 ? (
              <div className="text-sm text-gray-600 text-center py-4">No providers registered</div>
            ) : (
              registryData.providers.map((provider, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    {provider.enabled ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                      <div className="text-xs text-gray-600">{provider.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-600">Priority: {provider.priority}</div>
                    <button
                      onClick={() => provider.enabled ? onDisable(provider.id) : onEnable(provider.id)}
                      className={`px-2 py-1 rounded text-xs ${provider.enabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {provider.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => onUnregister(provider.id)}
                      className="px-2 py-1 rounded text-xs bg-red-100 text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={onRegister}
              className="w-full py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3 h-3 inline mr-1" />
              Register Provider
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

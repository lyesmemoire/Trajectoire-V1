"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Server, CheckCircle, XCircle, AlertTriangle, Clock, DollarSign, Activity, Signal } from "lucide-react";

interface ProviderMonitorProps {
  providers: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    latency: number;
    cost: number;
    requests: number;
    enabled: boolean;
  }>;
  onToggleProvider: (providerId: string) => void;
}

export function ProviderMonitor({
  providers,
  onToggleProvider
}: ProviderMonitorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-700 border-green-200";
      case "degraded":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "unhealthy":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "unhealthy":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Provider Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {providers.map((provider, index) => (
            <m.div
              key={provider.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                    <div className="text-xs text-gray-600">{provider.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                    {provider.status}
                  </div>
                  {getStatusIcon(provider.status)}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div className="text-xs text-gray-600">
                    <span className="font-medium text-gray-900">{provider.latency}</span>ms
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                  <div className="text-xs text-gray-600">
                    <span className="font-medium text-gray-900">${provider.cost.toFixed(4)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <div className="text-xs text-gray-600">
                    <span className="font-medium text-gray-900">{provider.requests}</span> req
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Signal className="w-4 h-4 text-gray-600" />
                  <div className="text-xs text-gray-600">
                    {provider.enabled ? (
                      <span className="font-medium text-green-900">Enabled</span>
                    ) : (
                      <span className="font-medium text-red-900">Disabled</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onToggleProvider(provider.id)}
                className="mt-3 w-full py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                {provider.enabled ? "Disable" : "Enable"}
              </button>
            </m.div>
          ))}

          {providers.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No providers registered
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

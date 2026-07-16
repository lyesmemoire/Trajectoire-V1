"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Clock, CheckCircle, XCircle, AlertTriangle, Heart } from "lucide-react";

interface ProviderHealthDashboardProps {
  healthData: Array<{
    providerId: string;
    providerName: string;
    status: string;
    uptime: number;
    errorRate: number;
    latency: number;
    lastCheck: number;
  }>;
}

export function ProviderHealthDashboard({ healthData }: ProviderHealthDashboardProps) {
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
        <CardTitle className="text-gray-900">Provider Health Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthData.map((provider, index) => (
            <m.div
              key={provider.providerId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{provider.providerName}</div>
                    <div className="text-xs text-gray-600">{provider.providerId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                    {provider.status}
                  </div>
                  {getStatusIcon(provider.status)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Uptime</div>
                  <div className="text-sm font-medium text-gray-900">{provider.uptime.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Error Rate</div>
                  <div className="text-sm font-medium text-gray-900">{provider.errorRate.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Latency</div>
                  <div className="text-sm font-medium text-gray-900">{provider.latency}ms</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600">
                  Last check: {new Date(provider.lastCheck).toLocaleString()}
                </div>
              </div>
            </m.div>
          ))}

          {healthData.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No health data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

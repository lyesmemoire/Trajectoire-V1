// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";

interface ProviderLatencyDashboardProps {
  latencyData: Array<{
    providerId: string;
    providerName: string;
    averageLatency: number;
    minLatency: number;
    maxLatency: number;
    p50: number;
    p95: number;
    p99: number;
  }>;
}

export function ProviderLatencyDashboard({ latencyData }: ProviderLatencyDashboardProps) {
  const getLatencyColor = (latency: number) => {
    if (latency < 100) return "text-green-600";
    if (latency < 500) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Latency Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {latencyData.map((provider, index) => (
            <motion.div
              key={provider.providerId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{provider.providerName}</div>
                    <div className="text-xs text-gray-600">{provider.providerId}</div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getLatencyColor(provider.averageLatency)}`}>
                  {provider.averageLatency}ms
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Min</div>
                  <div className="text-sm font-medium text-gray-900">{provider.minLatency}ms</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">P50</div>
                  <div className="text-sm font-medium text-gray-900">{provider.p50}ms</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">P95</div>
                  <div className="text-sm font-medium text-gray-900">{provider.p95}ms</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">P99</div>
                  <div className="text-sm font-medium text-gray-900">{provider.p99}ms</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <TrendingDown className="w-3 h-3" />
                  <span>Min: {provider.minLatency}ms</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Max: {provider.maxLatency}ms</span>
                </div>
              </div>
            </motion.div>
          ))}

          {latencyData.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No latency data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

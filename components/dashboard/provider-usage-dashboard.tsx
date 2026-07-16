"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Activity, BarChart } from "lucide-react";

interface ProviderUsageDashboardProps {
  usageData: Array<{
    providerId: string;
    providerName: string;
    requests: number;
    successfulRequests: number;
    failedRequests: number;
    tokens: number;
    averageLatency: number;
  }>;
}

export function ProviderUsageDashboard({ usageData }: ProviderUsageDashboardProps) {
  const totalRequests = usageData.reduce((sum, provider) => sum + provider.requests, 0);
  const totalTokens = usageData.reduce((sum, provider) => sum + provider.tokens, 0);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Usage Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Total Requests</span>
              </div>
              <div className="text-lg font-bold text-blue-900">{totalRequests}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Total Tokens</span>
              </div>
              <div className="text-lg font-bold text-green-900">{totalTokens}</div>
            </div>
          </div>

          {usageData.map((provider, index) => (
            <m.div
              key={provider.providerId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{provider.providerName}</div>
                    <div className="text-xs text-gray-600">{provider.providerId}</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">{provider.requests} req</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Success</div>
                  <div className="text-sm font-medium text-green-900">{provider.successfulRequests}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Failed</div>
                  <div className="text-sm font-medium text-red-900">{provider.failedRequests}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Tokens</div>
                  <div className="text-sm font-medium text-gray-900">{provider.tokens}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Success Rate: {((provider.successfulRequests / provider.requests) * 100).toFixed(1)}%</span>
                  <span>Avg Latency: {provider.averageLatency}ms</span>
                </div>
              </div>
            </m.div>
          ))}

          {usageData.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No usage data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

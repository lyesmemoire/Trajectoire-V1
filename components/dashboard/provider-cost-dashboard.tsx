"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { DollarSign, PieChart } from "lucide-react";

interface ProviderCostDashboardProps {
  costData: Array<{
    providerId: string;
    providerName: string;
    totalCost: number;
    costPerRequest: number;
    costPerToken: number;
    requests: number;
    tokens: number;
  }>;
}

export function ProviderCostDashboard({ costData }: ProviderCostDashboardProps) {
  const totalCost = costData.reduce((sum, provider) => sum + provider.totalCost, 0);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Cost Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Total Cost</span>
              </div>
              <div className="text-lg font-bold text-blue-900">${totalCost.toFixed(4)}</div>
            </div>
          </div>

          {costData.map((provider, index) => (
            <m.div
              key={provider.providerId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <PieChart className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{provider.providerName}</div>
                    <div className="text-xs text-gray-600">{provider.providerId}</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">${provider.totalCost.toFixed(4)}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Cost/Request</div>
                  <div className="text-sm font-medium text-gray-900">${provider.costPerRequest.toFixed(6)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Cost/Token</div>
                  <div className="text-sm font-medium text-gray-900">${provider.costPerToken.toFixed(6)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Requests</div>
                  <div className="text-sm font-medium text-gray-900">{provider.requests}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Tokens: {provider.tokens}</span>
                  <span>{((provider.totalCost / totalCost) * 100).toFixed(1)}% of total</span>
                </div>
              </div>
            </m.div>
          ))}

          {costData.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No cost data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Heart, Activity, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

interface ModerationHealthProps {
  healthData: {
    textHealth: {
      status: "healthy" | "degraded" | "unhealthy";
      uptime: number;
      errorRate: number;
      latency: number;
    };
    imageHealth: {
      status: "healthy" | "degraded" | "unhealthy";
      uptime: number;
      errorRate: number;
      latency: number;
    };
    lastCheck: number;
  };
}

export function ModerationHealth({ healthData }: ModerationHealthProps) {
  const getHealthColor = (status: string) => {
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

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "unhealthy":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getOverallHealth = () => {
    const statuses = [
      healthData.textHealth.status,
      healthData.imageHealth.status
    ];
    
    if (statuses.every(s => s === "healthy")) return "healthy";
    if (statuses.some(s => s === "unhealthy")) return "unhealthy";
    return "degraded";
  };

  const overallHealth = getOverallHealth();

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Moderation Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Health Status</div>
                <div className="text-xs text-gray-600">System health monitoring</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(overallHealth)}`}>
                {overallHealth}
              </div>
              {getHealthIcon(overallHealth)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg border ${getHealthColor(healthData.textHealth.status)}`}>
              <div className="text-xs font-medium mb-2">Text Moderation</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Status</span>
                  <span className="font-medium">{healthData.textHealth.status}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Uptime</span>
                  <span className="font-medium">{healthData.textHealth.uptime}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Error Rate</span>
                  <span className="font-medium">{healthData.textHealth.errorRate}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Latency</span>
                  <span className="font-medium">{healthData.textHealth.latency}ms</span>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${getHealthColor(healthData.imageHealth.status)}`}>
              <div className="text-xs font-medium mb-2">Image Moderation</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Status</span>
                  <span className="font-medium">{healthData.imageHealth.status}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Uptime</span>
                  <span className="font-medium">{healthData.imageHealth.uptime}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Error Rate</span>
                  <span className="font-medium">{healthData.imageHealth.errorRate}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Latency</span>
                  <span className="font-medium">{healthData.imageHealth.latency}ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">Last Check</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" />
                {new Date(healthData.lastCheck).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

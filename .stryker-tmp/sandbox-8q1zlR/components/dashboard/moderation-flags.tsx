// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Flag, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

interface ModerationFlagsProps {
  flagsData: {
    flags: Array<{
      id: string;
      category: string;
      severity: "low" | "medium" | "high";
      confidence: number;
      message: string;
    }>;
    totalFlags: number;
    highSeverityFlags: number;
    mediumSeverityFlags: number;
    lowSeverityFlags: number;
  };
}

export function ModerationFlags({ flagsData }: ModerationFlagsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Flag className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Moderation Flags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flag className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Raised Flags</div>
                <div className="text-xs text-gray-600">Content moderation flags</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {flagsData.totalFlags} flags
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">High Severity</div>
              <div className="text-sm font-medium text-red-600">
                {flagsData.highSeverityFlags}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Medium Severity</div>
              <div className="text-sm font-medium text-yellow-600">
                {flagsData.mediumSeverityFlags}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Low Severity</div>
              <div className="text-sm font-medium text-green-600">
                {flagsData.lowSeverityFlags}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            {flagsData.flags.length === 0 ? (
              <div className="text-sm text-gray-600 text-center py-4">No flags raised</div>
            ) : (
              flagsData.flags.map((flag, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(flag.severity)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{flag.category}</div>
                      <div className="text-xs text-gray-600">{flag.message}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(flag.severity)}`}>
                      {flag.severity}
                    </div>
                    <div className="text-xs text-gray-600">
                      {flag.confidence.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Severity Distribution</div>
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">High</span>
                  <span className="font-medium text-red-600">{flagsData.highSeverityFlags}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all"
                    style={{ width: `${flagsData.totalFlags > 0 ? (flagsData.highSeverityFlags / flagsData.totalFlags) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Medium</span>
                  <span className="font-medium text-yellow-600">{flagsData.mediumSeverityFlags}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full transition-all"
                    style={{ width: `${flagsData.totalFlags > 0 ? (flagsData.mediumSeverityFlags / flagsData.totalFlags) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Low</span>
                  <span className="font-medium text-green-600">{flagsData.lowSeverityFlags}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${flagsData.totalFlags > 0 ? (flagsData.lowSeverityFlags / flagsData.totalFlags) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

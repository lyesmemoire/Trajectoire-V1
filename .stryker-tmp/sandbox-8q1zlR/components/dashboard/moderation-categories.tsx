// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Tag, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface ModerationCategoriesProps {
  categoriesData: {
    categories: Array<{
      name: string;
      score: number;
      severity: "low" | "medium" | "high";
      confidence: number;
    }>;
    threshold: number;
  };
}

export function ModerationCategories({ categoriesData }: ModerationCategoriesProps) {
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
        return <XCircle className="w-3 h-3 text-red-600" />;
      case "medium":
        return <AlertTriangle className="w-3 h-3 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      default:
        return <Tag className="w-3 h-3 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Moderation Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Category Detection</div>
                <div className="text-xs text-gray-600">Detected categories</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">Threshold: {categoriesData.threshold}</div>
          </div>

          <div className="space-y-2">
            {categoriesData.categories.length === 0 ? (
              <div className="text-sm text-gray-600 text-center py-4">No categories detected</div>
            ) : (
              categoriesData.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(category.severity)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      <div className="text-xs text-gray-600">Confidence: {category.confidence.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(category.severity)}`}>
                      {category.severity}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {category.score.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Category Distribution</div>
            <div className="space-y-2">
              {categoriesData.categories.map((category, index) => {
                const percentage = Math.min(category.score * 100, 100);
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{category.name}</span>
                      <span className="font-medium text-gray-900">{category.score.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          category.severity === "high" ? "bg-red-600" :
                          category.severity === "medium" ? "bg-yellow-600" : "bg-green-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp } from "lucide-react";
import { DigitalTwin } from "../types";

export interface ProbableTrendsProps {
  twin: DigitalTwin;
}

export function ProbableTrends({ twin }: ProbableTrendsProps) {
  return (
    <>
      {/* Probable Trends */}
      {twin.probableTrends && twin.probableTrends.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
          <CardHeader className="border-b border-blue-200">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Ce que j'observe probablement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {twin.probableTrends.map((trend, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-blue-900">{trend.trend}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                      {trend.confidence}%
                    </span>
                  </div>
                  {trend.evidence.length > 0 && (
                    <p className="text-xs text-blue-700">
                      Preuves: {trend.evidence.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}

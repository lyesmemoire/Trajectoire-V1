import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Clock, ArrowRight } from "lucide-react";
import { DigitalTwin } from "../types";

export interface TemporalComparisonProps {
  twin: DigitalTwin;
}

export function TemporalComparison({ twin }: TemporalComparisonProps) {
  return (
    <>
      {/* Temporal Comparison */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Comparaison Temporelle
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-24 flex-shrink-0">
                <p className="font-medium text-purple-900">Aujourd'hui</p>
              </div>
              <p className="text-gray-700">{twin.temporalComparison.today}</p>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-24 flex-shrink-0">
                <p className="font-medium text-gray-700">Il y a 1 semaine</p>
              </div>
              <p className="text-gray-600">{twin.temporalComparison.oneWeekAgo}</p>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-24 flex-shrink-0">
                <p className="font-medium text-gray-700">Il y a 1 mois</p>
              </div>
              <p className="text-gray-600">{twin.temporalComparison.oneMonthAgo}</p>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-24 flex-shrink-0">
                <p className="font-medium text-gray-700">Première simulation</p>
              </div>
              <p className="text-gray-600">{twin.temporalComparison.firstSimulation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </>
  );
}

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle, Sparkles, Zap } from "lucide-react";
import { DigitalTwin } from "../types";

export interface DominantStrengthsProps {
  twin: DigitalTwin;
}

export function DominantStrengths({ twin }: DominantStrengthsProps) {
  return (
    <>
      {/* Dominant Strengths */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Forces Dominantes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {twin.dominantStrengths.naturalStrengths.length > 0 && (
              <div>
                <p className="font-medium text-green-700 mb-2">Forces naturelles</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.dominantStrengths.naturalStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.dominantStrengths.emergingStrengths.length > 0 && (
              <div>
                <p className="font-medium text-blue-700 mb-2">Forces émergentes</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.dominantStrengths.emergingStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </>
  );
}

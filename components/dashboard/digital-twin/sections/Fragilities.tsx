import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { AlertTriangle } from "lucide-react";
import { DigitalTwin } from "../types";

export interface FragilitiesProps {
  twin: DigitalTwin;
}

export function Fragilities({ twin }: FragilitiesProps) {
  return (
    <>
      {/* Fragilities */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Fragilités
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {twin.fragilities.persistentFragilities.length > 0 && (
              <div>
                <p className="font-medium text-red-700 mb-2">Fragilités persistantes</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.fragilities.persistentFragilities.map((fragility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{fragility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.fragilities.situationalFragilities.length > 0 && (
              <div>
                <p className="font-medium text-amber-700 mb-2">Fragilités situationnelles</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.fragilities.situationalFragilities.map((fragility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{fragility}</span>
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

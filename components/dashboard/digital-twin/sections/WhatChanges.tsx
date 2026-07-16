import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { DigitalTwin } from "../types";

export interface WhatChangesProps {
  twin: DigitalTwin;
}

export function WhatChanges({ twin }: WhatChangesProps) {
  return (
    <>
      {/* What Changes */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Ce Qui Change
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {twin.whatChanges.evolves.length > 0 && (
              <div>
                <p className="font-medium text-green-700 mb-2">Évolue</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.whatChanges.evolves.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.whatChanges.staysStable.length > 0 && (
              <div>
                <p className="font-medium text-blue-700 mb-2">Reste stable</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.whatChanges.staysStable.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.whatChanges.regresses.length > 0 && (
              <div>
                <p className="font-medium text-red-700 mb-2">Régresse</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.whatChanges.regresses.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.whatChanges.surprises.length > 0 && (
              <div>
                <p className="font-medium text-amber-700 mb-2">Surprend</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.whatChanges.surprises.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{change}</span>
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

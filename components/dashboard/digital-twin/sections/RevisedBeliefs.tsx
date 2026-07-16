import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { RefreshCw } from "lucide-react";
import { DigitalTwin } from "../types";

export interface RevisedBeliefsProps {
  twin: DigitalTwin;
}

export function RevisedBeliefs({ twin }: RevisedBeliefsProps) {
  return (
    <>
      {/* Revised Beliefs */}
      {twin.revisedBeliefs && twin.revisedBeliefs.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Croyances révisées
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {twin.revisedBeliefs.map((belief, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600 mb-1">Ancienne croyance:</p>
                  <p className="text-sm text-amber-800 mb-1">{belief.oldBelief}</p>
                  <p className="text-xs text-amber-600 mb-1">Nouvelle croyance:</p>
                  <p className="text-sm font-medium text-amber-900 mb-1">{belief.newBelief}</p>
                  <p className="text-xs text-amber-800 mb-1">{belief.reason}</p>
                  {belief.observations.length > 0 && (
                    <p className="text-xs text-amber-700">
                      Observations: {belief.observations.join(", ")}
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

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle } from "lucide-react";
import { DigitalTwin } from "../types";

export interface ConfirmedBeliefsProps {
  twin: DigitalTwin;
}

export function ConfirmedBeliefs({ twin }: ConfirmedBeliefsProps) {
  return (
    <>
      {/* Confirmed Beliefs */}
      {twin.confirmedBeliefs && twin.confirmedBeliefs.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
          <CardHeader className="border-b border-green-200">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Croyances confirmées
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {twin.confirmedBeliefs.map((belief, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-1">{belief.belief}</p>
                  <p className="text-xs text-green-800 mb-1">{belief.reason}</p>
                  {belief.observations.length > 0 && (
                    <p className="text-xs text-green-700">
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

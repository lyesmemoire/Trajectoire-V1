import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { AlertTriangle } from "lucide-react";
import { DigitalTwin } from "../types";

export interface ToConfirmProps {
  twin: DigitalTwin;
}

export function ToConfirm({ twin }: ToConfirmProps) {
  return (
    <>
      {/* To Confirm */}
      {twin.toConfirm && twin.toConfirm.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Ce que je dois encore confirmer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {twin.toConfirm.map((hypothesis, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-amber-900">{hypothesis.hypothesis}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800`}>
                      {hypothesis.confidence}%
                    </span>
                  </div>
                  {hypothesis.evidence.length > 0 && (
                    <p className="text-xs text-amber-700">
                      Preuves: {hypothesis.evidence.join(", ")}
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

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Zap } from "lucide-react";
import { DigitalTwin } from "../types";

export interface PriorityDecisionProps {
  twin: DigitalTwin;
}

export function PriorityDecision({ twin }: PriorityDecisionProps) {
  return (
    <>
      {/* Priority Decision */}
      {twin.priorityDecision && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Décision la plus rentable
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-amber-600 font-medium mb-1">Priorité absolue</p>
                <p className="text-sm font-bold text-amber-900">{twin.priorityDecision.absolutePriority}</p>
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium mb-1">Raison</p>
                <p className="text-sm text-amber-800">{twin.priorityDecision.priorityReason}</p>
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium mb-1">Impact attendu</p>
                <p className="text-sm text-amber-800">{twin.priorityDecision.expectedImpact}</p>
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium mb-1">Urgence</p>
                <p className="text-sm text-amber-800">{twin.priorityDecision.urgency}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle } from "lucide-react";
import { DigitalTwin } from "../types";

export interface CertainKnowledgeProps {
  twin: DigitalTwin;
}

export function CertainKnowledge({ twin }: CertainKnowledgeProps) {
  return (
    <>
      {/* Certain Knowledge */}
      {twin.certainKnowledge && twin.certainKnowledge.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
          <CardHeader className="border-b border-green-200">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Ce que je sais avec certitude
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {twin.certainKnowledge.map((knowledge, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-green-900">{knowledge.knowledge}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                      {knowledge.confidence}%
                    </span>
                  </div>
                  {knowledge.evidence.length > 0 && (
                    <p className="text-xs text-green-700">
                      Preuves: {knowledge.evidence.join(", ")}
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

import * as React from "react";
import { Card, CardContent } from "@/components/design-system";
import { Sparkles } from "lucide-react";
import { DigitalTwin } from "../types";

export interface NaturalSynthesisProps {
  twin: DigitalTwin;
}

export function NaturalSynthesis({ twin }: NaturalSynthesisProps) {
  return (
    <>
      {/* Natural Synthesis */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-blue-900 mb-2">Si je devais te décrire aujourd'hui en tant que professionnel...</p>
              <p className="text-sm text-blue-800">{twin.naturalSynthesis}</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </>
  );
}

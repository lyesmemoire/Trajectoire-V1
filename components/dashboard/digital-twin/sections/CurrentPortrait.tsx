import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { User } from "lucide-react";
import { DigitalTwin } from "../types";

export interface CurrentPortraitProps {
  twin: DigitalTwin;
}

export function CurrentPortrait({ twin }: CurrentPortraitProps) {
  return (
    <>
      {/* Current Portrait */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-sm">
        <CardHeader className="border-b border-purple-200">
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Portrait Actuel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <p className="font-medium text-purple-900 mb-2">Aujourd'hui tu es :</p>
              <ul className="space-y-2 text-sm text-purple-800">
                {twin.currentPortrait.description.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-purple-900 mb-1">Évolution</p>
              <p className="text-sm text-purple-800">{twin.currentPortrait.evolution}</p>
            </div>
            <div>
              <p className="font-medium text-purple-900 mb-1">Pourquoi ce score ?</p>
              <p className="text-sm text-purple-800">{twin.currentPortrait.scoreExplanation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </>
  );
}

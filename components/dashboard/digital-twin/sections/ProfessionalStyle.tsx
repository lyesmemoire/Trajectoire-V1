import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { User } from "lucide-react";
import { DigitalTwin } from "../types";

export interface ProfessionalStyleProps {
  twin: DigitalTwin;
}

export function ProfessionalStyle({ twin }: ProfessionalStyleProps) {
  return (
    <>
      {/* Professional Style */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Style Professionnel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-900 mb-1">Style de communication</p>
              <p className="text-gray-700">{twin.professionalStyle.communicationStyle}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Style de leadership</p>
              <p className="text-gray-700">{twin.professionalStyle.leadershipStyle}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Style décisionnel</p>
              <p className="text-gray-700">{twin.professionalStyle.decisionStyle}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Style relationnel</p>
              <p className="text-gray-700">{twin.professionalStyle.relationshipStyle}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Style d'apprentissage</p>
              <p className="text-gray-700">{twin.professionalStyle.learningStyle}</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </>
  );
}

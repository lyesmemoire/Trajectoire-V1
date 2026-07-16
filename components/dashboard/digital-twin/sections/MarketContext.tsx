import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, Sparkles, TrendingDown } from "lucide-react";
import { DigitalTwin } from "../types";

export interface MarketContextProps {
  twin: DigitalTwin;
}

export function MarketContext({ twin }: MarketContextProps) {
  return (
    <>
      {/* Market Context */}
      {twin.marketContext && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
          <CardHeader className="border-b border-emerald-200">
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Contexte du Marché
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-1">Compétitivité du profil</p>
                <p className="text-sm text-emerald-800">{twin.marketContext.profileCompetitiveness}</p>
              </div>
              {twin.marketContext.differentiatingSkills.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Compétences différenciantes</p>
                  <div className="space-y-1">
                    {twin.marketContext.differentiatingSkills.map((skill, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {twin.marketContext.lessDifferentiatingSkills.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Compétences moins différenciantes</p>
                  <div className="space-y-1">
                    {twin.marketContext.lessDifferentiatingSkills.map((skill, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingDown className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-1">Demande du marché</p>
                <p className="text-sm text-emerald-800">{twin.marketContext.marketDemand}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-1">Raison</p>
                <p className="text-sm text-emerald-800">{twin.marketContext.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}

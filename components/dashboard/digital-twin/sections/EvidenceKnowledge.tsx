import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, CheckCircle, Lightbulb, Database, Search } from "lucide-react";
import { DigitalTwin } from "../types";

export interface EvidenceKnowledgeProps {
  twin: DigitalTwin;
}

export function EvidenceKnowledge({ twin }: EvidenceKnowledgeProps) {
  return (
    <>
      {/* Evidence Knowledge */}
      {twin.evidenceKnowledge && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-200">
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Ce que je sais réellement de toi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600">Total preuves</p>
                  <p className="text-lg font-bold text-amber-900">{twin.evidenceKnowledge.evidenceCount}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600">Fortes</p>
                  <p className="text-lg font-bold text-green-600">{twin.evidenceKnowledge.strongEvidence}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600">Faibles</p>
                  <p className="text-lg font-bold text-red-600">{twin.evidenceKnowledge.weakEvidence}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600">Qualité globale</p>
                  <p className="text-sm font-medium text-amber-900 capitalize">{twin.evidenceKnowledge.overallEvidenceQuality.replace("_", " ")}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-600">Confiance</p>
                  <p className="text-lg font-bold text-amber-900">{twin.evidenceKnowledge.overallConfidence}%</p>
                </div>
              </div>

              {twin.evidenceKnowledge.certitudes.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Certitudes
                  </p>
                  <div className="space-y-1">
                    {twin.evidenceKnowledge.certitudes.map((certitude: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-800">{certitude}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.evidenceKnowledge.trends.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Tendances
                  </p>
                  <div className="space-y-1">
                    {twin.evidenceKnowledge.trends.map((trend: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">{trend}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.evidenceKnowledge.hypotheses.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Hypothèses
                  </p>
                  <div className="space-y-1">
                    {twin.evidenceKnowledge.hypotheses.map((hypothesis: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-purple-800">{hypothesis}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.evidenceKnowledge.toConfirm.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    À confirmer
                  </p>
                  <div className="space-y-1">
                    {twin.evidenceKnowledge.toConfirm.map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Search className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}

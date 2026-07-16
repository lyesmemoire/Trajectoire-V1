import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, CheckCircle, Brain, Search, Archive } from "lucide-react";
import { DigitalTwin } from "../types";

export interface KnowledgeEvolutionProps {
  twin: DigitalTwin;
}

export function KnowledgeEvolution({ twin }: KnowledgeEvolutionProps) {
  return (
    <>
      {/* Knowledge Evolution */}
      {twin.knowledgeEvolution && (
        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 shadow-sm">
          <CardHeader className="border-b border-cyan-200">
            <CardTitle className="text-cyan-900 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Ce que je sais de moi-même
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {twin.knowledgeEvolution.certainKnowledge.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Ce que je sais avec certitude
                  </p>
                  <div className="space-y-2">
                    {twin.knowledgeEvolution.certainKnowledge.map((item, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-green-200">
                        <p className="text-xs text-green-800 mb-1">{item.knowledge}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600">Confiance: {item.confidence}%</span>
                          {item.evidence.length > 0 && (
                            <span className="text-xs text-green-500">{item.evidence.length} preuves</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.knowledgeEvolution.strengthenedKnowledge.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Ce que je renforce
                  </p>
                  <div className="space-y-2">
                    {twin.knowledgeEvolution.strengthenedKnowledge.map((item, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-blue-200">
                        <p className="text-xs text-blue-800 mb-1">{item.knowledge}</p>
                        <p className="text-xs text-blue-600">{item.reason}</p>
                        <span className="text-xs text-blue-500">Confiance: {item.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.knowledgeEvolution.obsoleteKnowledge.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Ce qui devient obsolète
                  </p>
                  <div className="space-y-2">
                    {twin.knowledgeEvolution.obsoleteKnowledge.map((item, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-red-200">
                        <p className="text-xs text-red-800 mb-1">{item.knowledge}</p>
                        <p className="text-xs text-red-600">{item.reason}</p>
                        {item.replacedBy && (
                          <p className="text-xs text-red-500">Remplacé par: {item.replacedBy}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.knowledgeEvolution.toConfirm.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Ce qui reste à confirmer
                  </p>
                  <div className="space-y-2">
                    {twin.knowledgeEvolution.toConfirm.map((item, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-amber-200">
                        <p className="text-xs text-amber-800 mb-1">{item.knowledge}</p>
                        <p className="text-xs text-amber-600">{item.needsValidation}</p>
                        <span className="text-xs text-amber-500">Confiance: {item.confidence}%</span>
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

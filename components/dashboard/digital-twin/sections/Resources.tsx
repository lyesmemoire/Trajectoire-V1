import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, AlertTriangle, Sparkles, Zap, TrendingDown, Info } from "lucide-react";
import { DigitalTwin } from "../types";

export interface ResourcesProps {
  twin: DigitalTwin;
}

export function Resources({ twin }: ResourcesProps) {
  return (
    <>
      {/* Resources */}
      {twin.resources && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
          <CardHeader className="border-b border-emerald-200">
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Mes ressources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-sm font-medium text-emerald-900 mb-3">Ressources disponibles</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-emerald-600">Temps</p>
                    <p className="text-sm font-medium text-emerald-900">{twin.resources.availableResources.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600">Énergie</p>
                    <p className="text-sm font-medium text-emerald-900">{twin.resources.availableResources.energy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600">Budget</p>
                    <p className="text-sm font-medium text-emerald-900">{twin.resources.availableResources.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600">Réseau</p>
                    <p className="text-sm font-medium text-emerald-900">{twin.resources.availableResources.network}</p>
                  </div>
                </div>
                {twin.resources.availableResources.skills.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-emerald-600 mb-1">Compétences</p>
                    <div className="flex flex-wrap gap-1">
                      {twin.resources.availableResources.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {twin.resources.resourceStrengths.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Forces de ressources</p>
                  <div className="space-y-1">
                    {twin.resources.resourceStrengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.resources.resourceWeaknesses.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Faiblesses de ressources</p>
                  <div className="space-y-1">
                    {twin.resources.resourceWeaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{weakness}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-900 mb-1">Capacité actuelle</p>
                  <p className="text-sm text-emerald-800">{twin.resources.currentCapacity}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-900 mb-1">Capacité future</p>
                  <p className="text-sm text-emerald-800">{twin.resources.futureCapacity}</p>
                </div>
              </div>

              {twin.resources.limitingFactors.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-900 mb-2">Facteurs limitants</p>
                  <div className="space-y-1">
                    {twin.resources.limitingFactors.map((factor, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-orange-800">{factor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.resources.underutilizedResources.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2">Ressources sous-utilisées</p>
                  <div className="space-y-1">
                    {twin.resources.underutilizedResources.map((resource, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{resource}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.resources.overutilizedResources.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Ressources sur-utilisées</p>
                  <div className="space-y-1">
                    {twin.resources.overutilizedResources.map((resource, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{resource}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.resources.resourceOptimizations.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2">Optimisations proposées</p>
                  <div className="space-y-1">
                    {twin.resources.resourceOptimizations.map((optimization, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{optimization}</p>
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

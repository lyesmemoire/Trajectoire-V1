import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle, RefreshCw, Shield, AlertCircle } from "lucide-react";
import { DigitalTwin } from "../types";

export interface SynchronizationStatusProps {
  twin: DigitalTwin;
}

export function SynchronizationStatus({ twin }: SynchronizationStatusProps) {
  return (
    <>
      {/* Synchronization Status */}
      {twin.synchronizationStatus && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Statut de synchronisation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-600">Cohérence globale</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-lg font-bold ${twin.synchronizationStatus.globalCoherence >= 90 ? "bg-green-100 text-green-800" : twin.synchronizationStatus.globalCoherence >= 70 ? "bg-blue-100 text-blue-800" : twin.synchronizationStatus.globalCoherence >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                  {twin.synchronizationStatus.globalCoherence}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-600">Cohérent</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${twin.synchronizationStatus.isCoherent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {twin.synchronizationStatus.isCoherent ? "Oui" : "Non"}
                </span>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2">Analyses cohérentes</p>
                <div className="space-y-1">
                  {twin.synchronizationStatus.coherentAnalyses.map((analysis, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-purple-800">{analysis}</p>
                    </div>
                  ))}
                </div>
              </div>
              {twin.synchronizationStatus.incoherentAnalyses && twin.synchronizationStatus.incoherentAnalyses.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900 mb-2">Analyses incohérentes</p>
                  <div className="space-y-1">
                    {twin.synchronizationStatus.incoherentAnalyses.map((analysis, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{analysis}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">Raison</p>
                <p className="text-sm text-purple-800">{twin.synchronizationStatus.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}

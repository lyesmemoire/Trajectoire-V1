"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface StrengthsWeaknessesWidgetProps {
  strengths: Array<{
    id: string;
    category: string;
    priority: "low" | "medium" | "high";
    evidence: string;
  }>;
  weaknesses: Array<{
    id: string;
    category: string;
    priority: "low" | "medium" | "high";
    suggestion: string;
  }>;
}

export function StrengthsWeaknessesWidget({ strengths, weaknesses }: StrengthsWeaknessesWidgetProps) {
  const topStrengths = strengths.filter(s => s.priority === "high").slice(0, 3);
  const topWeaknesses = weaknesses.filter(w => w.priority === "high").slice(0, 3);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Forces & Faiblesses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Strengths */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-medium text-gray-900">Forces principales</h3>
            </div>
            <div className="space-y-2">
              {topStrengths.length > 0 ? (
                topStrengths.map((strength, index) => (
                  <m.div
                    key={strength.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="flex items-start gap-2 p-2 bg-emerald-50 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{strength.category}</p>
                      <p className="text-xs text-gray-600">{strength.evidence}</p>
                    </div>
                  </m.div>
                ))
              ) : (
                <p className="text-sm text-gray-600 text-center py-2">Pas encore de forces détectées</p>
              )}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-medium text-gray-900">Faiblesses prioritaires</h3>
            </div>
            <div className="space-y-2">
              {topWeaknesses.length > 0 ? (
                topWeaknesses.map((weakness, index) => (
                  <m.div
                    key={weakness.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg"
                  >
                    <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{weakness.category}</p>
                      <p className="text-xs text-gray-600">{weakness.suggestion}</p>
                    </div>
                  </m.div>
                ))
              ) : (
                <p className="text-sm text-gray-600 text-center py-2">Pas encore de faiblesses détectées</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

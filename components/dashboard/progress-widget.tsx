"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle2, Circle } from "lucide-react";

interface ProgressStep {
  id: string;
  title: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressWidgetProps {
  steps: ProgressStep[];
}

export function ProgressWidget({ steps }: ProgressWidgetProps) {
  const progress = steps.filter((s) => s.completed).length;
  const total = steps.length;
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Progression</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-900">
              Étape {progress + 1} sur {total}
            </span>
            <span className="text-sm text-gray-600">{percentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {step.completed ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                ) : step.current ? (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
              <span
                className={`text-sm ${
                  step.completed
                    ? "text-gray-900 line-through"
                    : step.current
                    ? "text-gray-900 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
